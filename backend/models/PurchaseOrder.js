const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PurchaseOrder = sequelize.define('PurchaseOrder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'order_number'
  },
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contacts',
      key: 'id'
    },
    field: 'vendor_id'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'order_date'
  }
}, {
  tableName: 'purchase_orders',
  timestamps: true,
  hooks: {
    beforeCreate: async (purchaseOrder) => {
      if (!purchaseOrder.orderNumber) {
        const count = await PurchaseOrder.count();
        purchaseOrder.orderNumber = `PO-${String(count + 1).padStart(6, '0')}`;
      }
    }
  }
});

module.exports = PurchaseOrder;

