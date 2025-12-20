const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PurchaseOrderItem = sequelize.define('PurchaseOrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  purchaseOrderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'purchase_orders',
      key: 'id'
    },
    field: 'purchase_order_id'
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
  tableName: 'purchase_order_items',
  timestamps: true
});

module.exports = PurchaseOrderItem;

