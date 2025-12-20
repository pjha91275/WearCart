const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VendorBillItem = sequelize.define('VendorBillItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  billId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vendor_bills',
      key: 'id'
    },
    field: 'bill_id'
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    },
    field: 'product_id'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'unit_price'
  },
  tax: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'vendor_bill_items',
  timestamps: true
});

module.exports = VendorBillItem;

