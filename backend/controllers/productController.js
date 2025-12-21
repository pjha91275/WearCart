const { Product } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// @desc    Get all products
// @route   GET /api/products
// @access  Public (with optional published filter)
exports.getProducts = async (req, res) => {
  try {
    const { published, category, type, search, page = 1, limit = 20 } = req.query;
    console.log('GET /products query:', req.query);
    const where = {};

    if (published !== undefined) {
      where.published = published === 'true';
    }

    if (category) {
      // In UI, Category means T-Shirt, Jeans etc. which is productType in DB
      where.productType = { [Op.iLike]: `%${category}%` };
    }

    if (type) {
      where.productCategory = type;
    }

    if (search) {
      // Fuzzy search using pg_trgm operators (<-> distance, % similarity)
      // Casting ENUMs to TEXT for compatibility
      where[Op.or] = [
        { productName: { [Op.iLike]: `%${search}%` } },
        sequelize.literal(`"product_name" <-> '${search}' < 0.8`), // Fuzzy match name
        sequelize.literal(`CAST("product_category" AS TEXT) ILIKE '%${search}%'`), // Cast ENUM
        sequelize.literal(`"product_type" ILIKE '%${search}%'`),
        sequelize.literal(`"material" ILIKE '%${search}%'`)
      ];
    }

    const offset = (page - 1) * limit;

    console.log('Search WHERE clause:', JSON.stringify(where, null, 2));

    const order = search
      ? [
        [sequelize.literal(`"product_name" <-> '${search}'`), 'ASC'], // Closest distance first
        ['createdAt', 'DESC']
      ]
      : [['createdAt', 'DESC']];

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order
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

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Internal
exports.createProduct = async (req, res) => {
  try {
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }

    // Allow manual image URLs as well if passed
    if (req.body.imageUrls) {
      const manualUrls = Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [req.body.imageUrls];
      images = [...images, ...manualUrls];
    }

    const productData = { ...req.body, images };
    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Internal
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let images = product.images || [];
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      images = [...images, ...newImages];
    }

    // Handle clearing or overwriting images if needed logic can be added here
    // For now, we append new uploads to existing ones.

    const productData = { ...req.body, images };
    product = await product.update(productData);

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Internal
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private/Internal
exports.updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.currentStock = quantity;
    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

