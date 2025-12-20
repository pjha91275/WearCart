const sequelize = require('../config/database');
const User = require('./User');
const Contact = require('./Contact');
const Product = require('./Product');
const PaymentTerm = require('./PaymentTerm');
const DiscountOffer = require('./DiscountOffer');
const CouponCode = require('./CouponCode');
const SaleOrder = require('./SaleOrder');
const SaleOrderItem = require('./SaleOrderItem');
const PurchaseOrder = require('./PurchaseOrder');
const PurchaseOrderItem = require('./PurchaseOrderItem');
const CustomerInvoice = require('./CustomerInvoice');
const CustomerInvoiceItem = require('./CustomerInvoiceItem');
const VendorBill = require('./VendorBill');
const VendorBillItem = require('./VendorBillItem');
const Payment = require('./Payment');
const SystemSetting = require('./SystemSetting');

// Define relationships

// User - Contact (One-to-One)
User.hasOne(Contact, { foreignKey: 'userId', as: 'contact' });
Contact.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Contact - SaleOrder (One-to-Many)
Contact.hasMany(SaleOrder, { foreignKey: 'customerId', as: 'saleOrders' });
SaleOrder.belongsTo(Contact, { foreignKey: 'customerId', as: 'customer' });

// Contact - PurchaseOrder (One-to-Many)
Contact.hasMany(PurchaseOrder, { foreignKey: 'vendorId', as: 'purchaseOrders' });
PurchaseOrder.belongsTo(Contact, { foreignKey: 'vendorId', as: 'vendor' });

// Contact - CustomerInvoice (One-to-Many)
Contact.hasMany(CustomerInvoice, { foreignKey: 'customerId', as: 'invoices' });
CustomerInvoice.belongsTo(Contact, { foreignKey: 'customerId', as: 'customer' });

// Contact - VendorBill (One-to-Many)
Contact.hasMany(VendorBill, { foreignKey: 'vendorId', as: 'bills' });
VendorBill.belongsTo(Contact, { foreignKey: 'vendorId', as: 'vendor' });

// Contact - Payment (One-to-Many)
Contact.hasMany(Payment, { foreignKey: 'contactId', as: 'payments' });
Payment.belongsTo(Contact, { foreignKey: 'contactId', as: 'contact' });

// Product - SaleOrderItem (One-to-Many)
Product.hasMany(SaleOrderItem, { foreignKey: 'productId', as: 'saleOrderItems' });
SaleOrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Product - PurchaseOrderItem (One-to-Many)
Product.hasMany(PurchaseOrderItem, { foreignKey: 'productId', as: 'purchaseOrderItems' });
PurchaseOrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Product - CustomerInvoiceItem (One-to-Many)
Product.hasMany(CustomerInvoiceItem, { foreignKey: 'productId', as: 'invoiceItems' });
CustomerInvoiceItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Product - VendorBillItem (One-to-Many)
Product.hasMany(VendorBillItem, { foreignKey: 'productId', as: 'billItems' });
VendorBillItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// SaleOrder - SaleOrderItem (One-to-Many)
SaleOrder.hasMany(SaleOrderItem, { foreignKey: 'saleOrderId', as: 'items' });
SaleOrderItem.belongsTo(SaleOrder, { foreignKey: 'saleOrderId', as: 'saleOrder' });

// PurchaseOrder - PurchaseOrderItem (One-to-Many)
PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: 'purchaseOrderId', as: 'items' });
PurchaseOrderItem.belongsTo(PurchaseOrder, { foreignKey: 'purchaseOrderId', as: 'purchaseOrder' });

// CustomerInvoice - CustomerInvoiceItem (One-to-Many)
CustomerInvoice.hasMany(CustomerInvoiceItem, { foreignKey: 'invoiceId', as: 'items' });
CustomerInvoiceItem.belongsTo(CustomerInvoice, { foreignKey: 'invoiceId', as: 'invoice' });

// VendorBill - VendorBillItem (One-to-Many)
VendorBill.hasMany(VendorBillItem, { foreignKey: 'billId', as: 'items' });
VendorBillItem.belongsTo(VendorBill, { foreignKey: 'billId', as: 'bill' });

// SaleOrder - CustomerInvoice (One-to-One)
SaleOrder.hasOne(CustomerInvoice, { foreignKey: 'saleOrderId', as: 'invoice' });
CustomerInvoice.belongsTo(SaleOrder, { foreignKey: 'saleOrderId', as: 'saleOrder' });

// PurchaseOrder - VendorBill (One-to-One)
PurchaseOrder.hasOne(VendorBill, { foreignKey: 'purchaseOrderId', as: 'bill' });
VendorBill.belongsTo(PurchaseOrder, { foreignKey: 'purchaseOrderId', as: 'purchaseOrder' });

// PaymentTerm - SaleOrder (One-to-Many)
PaymentTerm.hasMany(SaleOrder, { foreignKey: 'paymentTermId', as: 'saleOrders' });
SaleOrder.belongsTo(PaymentTerm, { foreignKey: 'paymentTermId', as: 'paymentTerm' });

// PaymentTerm - CustomerInvoice (One-to-Many)
PaymentTerm.hasMany(CustomerInvoice, { foreignKey: 'paymentTermId', as: 'invoices' });
CustomerInvoice.belongsTo(PaymentTerm, { foreignKey: 'paymentTermId', as: 'paymentTerm' });

// DiscountOffer - CouponCode (One-to-Many)
DiscountOffer.hasMany(CouponCode, { foreignKey: 'discountOfferId', as: 'coupons' });
CouponCode.belongsTo(DiscountOffer, { foreignKey: 'discountOfferId', as: 'discountOffer' });

// CouponCode - Contact (Many-to-One)
CouponCode.belongsTo(Contact, { foreignKey: 'contactId', as: 'contact' });
Contact.hasMany(CouponCode, { foreignKey: 'contactId', as: 'coupons' });

// CouponCode - SaleOrder (Many-to-One)
CouponCode.hasMany(SaleOrder, { foreignKey: 'couponCodeId', as: 'saleOrders' });
SaleOrder.belongsTo(CouponCode, { foreignKey: 'couponCodeId', as: 'couponCode' });

// Payment - CustomerInvoice (Many-to-One)
CustomerInvoice.hasMany(Payment, { foreignKey: 'invoiceId', as: 'payments' });
Payment.belongsTo(CustomerInvoice, { foreignKey: 'invoiceId', as: 'invoice' });

// Payment - VendorBill (Many-to-One)
VendorBill.hasMany(Payment, { foreignKey: 'billId', as: 'payments' });
Payment.belongsTo(VendorBill, { foreignKey: 'billId', as: 'bill' });

module.exports = {
  sequelize,
  User,
  Contact,
  Product,
  PaymentTerm,
  DiscountOffer,
  CouponCode,
  SaleOrder,
  SaleOrderItem,
  PurchaseOrder,
  PurchaseOrderItem,
  CustomerInvoice,
  CustomerInvoiceItem,
  VendorBill,
  VendorBillItem,
  Payment,
  SystemSetting
};

