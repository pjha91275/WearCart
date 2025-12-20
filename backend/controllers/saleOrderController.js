const { SaleOrder, SaleOrderItem, Product, Contact, PaymentTerm, CouponCode, CustomerInvoice, CustomerInvoiceItem, SystemSetting } = require('../models');
const { Op } = require('sequelize');

// Helper to calculate totals
const calculateOrderTotals = (items, couponCode = null) => {
  let subtotal = 0;
  let tax = 0;

  items.forEach(item => {
    const itemSubtotal = item.quantity * item.unitPrice;
    const itemTax = itemSubtotal * (item.tax / 100);
    subtotal += itemSubtotal;
    tax += itemTax;
  });

  let discount = 0;
  if (couponCode && couponCode.discountOffer) {
    const discountPercent = couponCode.discountOffer.discountPercentage;
    discount = (subtotal * discountPercent) / 100;
  }

  const total = subtotal + tax - discount;

  return { subtotal, tax, discount, total };
};

// @desc    Create sale order
// @route   POST /api/sale-orders
// @access  Private
exports.createSaleOrder = async (req, res) => {
  try {
    const { customerId, items, couponCodeId, paymentTermId } = req.body;

    // Get default payment term if not provided
    let paymentTerm;
    if (paymentTermId) {
      paymentTerm = await PaymentTerm.findByPk(paymentTermId);
    } else {
      paymentTerm = await PaymentTerm.findOne({ where: { name: 'Immediate Payment' } });
    }

    if (!paymentTerm) {
      return res.status(400).json({ success: false, message: 'Payment term not found' });
    }

    // Get coupon code if provided
    let couponCode = null;
    if (couponCodeId) {
      couponCode = await CouponCode.findByPk(couponCodeId, {
        include: [{ model: require('../models/DiscountOffer'), as: 'discountOffer' }]
      });

      if (!couponCode || couponCode.status === 'used') {
        return res.status(400).json({ success: false, message: 'Invalid or used coupon code' });
      }
    }

    // Validate products and stock
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product ${item.productId} not found` });
      }
      if (product.currentStock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.productName}` });
      }

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.salesPrice,
        tax: product.salesTax,
        subtotal: item.quantity * product.salesPrice
      });
    }

    const totals = calculateOrderTotals(orderItems, couponCode);

    // Generate Order Number
    const count = await SaleOrder.count();
    const orderNumber = `SO-${String(count + 1).padStart(6, '0')}`;

    // Create sale order
    const saleOrder = await SaleOrder.create({
      orderNumber,
      customerId,
      paymentTermId: paymentTerm.id,
      couponCodeId: couponCode ? couponCode.id : null,
      subtotal: totals.subtotal,
      tax: totals.tax,
      discount: totals.discount,
      total: totals.total,
      status: 'confirmed'
    });

    // Create order items
    for (const item of orderItems) {
      await SaleOrderItem.create({
        saleOrderId: saleOrder.id,
        ...item
      });

      // Update product stock
      const product = await Product.findByPk(item.productId);
      product.currentStock -= item.quantity;
      await product.save();
    }

    // Mark coupon as used
    if (couponCode) {
      couponCode.status = 'used';
      await couponCode.save();
    }

    // Auto-create invoice if setting is enabled
    const autoInvoiceSetting = await SystemSetting.findOne({ where: { key: 'automatic_invoicing' } });
    if (autoInvoiceSetting && autoInvoiceSetting.value === 'true') {
      await createInvoiceFromOrder(saleOrder.id);
    }

    const orderWithDetails = await SaleOrder.findByPk(saleOrder.id, {
      include: [
        { model: Contact, as: 'customer' },
        { model: PaymentTerm, as: 'paymentTerm' },
        { model: CouponCode, as: 'couponCode' },
        { model: SaleOrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }
      ]
    });

    res.status(201).json({
      success: true,
      data: orderWithDetails
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper to create invoice from order
const createInvoiceFromOrder = async (saleOrderId) => {
  const saleOrder = await SaleOrder.findByPk(saleOrderId, {
    include: [
      { model: SaleOrderItem, as: 'items' },
      { model: PaymentTerm, as: 'paymentTerm' }
    ]
  });

  if (!saleOrder) return;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15); // Default 15 days

  const invoice = await CustomerInvoice.create({
    saleOrderId: saleOrder.id,
    customerId: saleOrder.customerId,
    paymentTermId: saleOrder.paymentTermId,
    invoiceDate: new Date(),
    dueDate: dueDate,
    subtotal: saleOrder.subtotal,
    tax: saleOrder.tax,
    discount: saleOrder.discount,
    total: saleOrder.total,
    status: 'sent'
  });

  // Create invoice items
  for (const item of saleOrder.items) {
    await CustomerInvoiceItem.create({
      invoiceId: invoice.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      tax: item.tax,
      subtotal: item.subtotal
    });
  }

  return invoice;
};

// @desc    Get all sale orders
// @route   GET /api/sale-orders
// @access  Private
exports.getSaleOrders = async (req, res) => {
  try {
    const { customerId, status, page = 1, limit = 20 } = req.query;
    const where = {};

    if (customerId) where.customerId = customerId;
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    const { count, rows } = await SaleOrder.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: Contact, as: 'customer' },
        { model: PaymentTerm, as: 'paymentTerm' },
        { model: SaleOrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count,
      data: rows,
      page: parseInt(page),
      pages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single sale order
// @route   GET /api/sale-orders/:id
// @access  Private
exports.getSaleOrder = async (req, res) => {
  try {
    const saleOrder = await SaleOrder.findByPk(req.params.id, {
      include: [
        { model: Contact, as: 'customer' },
        { model: PaymentTerm, as: 'paymentTerm' },
        { model: CouponCode, as: 'couponCode', include: [{ model: require('../models/DiscountOffer'), as: 'discountOffer' }] },
        { model: SaleOrderItem, as: 'items', include: [{ model: Product, as: 'product' }] },
        { model: CustomerInvoice, as: 'invoice' }
      ]
    });

    if (!saleOrder) {
      return res.status(404).json({ success: false, message: 'Sale order not found' });
    }

    res.status(200).json({
      success: true,
      data: saleOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create invoice from sale order
// @route   POST /api/sale-orders/:id/invoice
// @access  Private/Internal
exports.createInvoice = async (req, res) => {
  try {
    const invoice = await createInvoiceFromOrder(req.params.id);

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Sale order not found' });
    }

    const invoiceWithDetails = await CustomerInvoice.findByPk(invoice.id, {
      include: [
        { model: Contact, as: 'customer' },
        { model: PaymentTerm, as: 'paymentTerm' },
        { model: CustomerInvoiceItem, as: 'items', include: [{ model: Product, as: 'product' }] }
      ]
    });

    res.status(201).json({
      success: true,
      data: invoiceWithDetails
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

