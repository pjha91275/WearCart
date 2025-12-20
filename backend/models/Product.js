const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'product_name'
  },
  productCategory: {
    type: DataTypes.ENUM('men', 'women', 'children', 'unisex'),
    allowNull: false,
    field: 'product_category'
  },
  productType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'product_type'
  },
  material: {
    type: DataTypes.STRING,
    allowNull: true
  },
  colors: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  currentStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'current_stock'
  },
  salesPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'sales_price'
  },
  salesTax: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'sales_tax'
  },
  purchasePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'purchase_price'
  },
  purchaseTax: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'purchase_tax'
  },
  published: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  }
}, {
  tableName: 'products',
  timestamps: true
});

module.exports = Product;

