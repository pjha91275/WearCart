const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SaleOrder = sequelize.define('SaleOrder', {
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
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contacts',
      key: 'id'
    },
    field: 'customer_id'
  },
  paymentTermId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'payment_terms',
      key: 'id'
    },
    field: 'payment_term_id'
  },
  couponCodeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'coupon_codes',
      key: 'id'
    },
    field: 'coupon_code_id'
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
  discount: {
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
  tableName: 'sale_orders',
  timestamps: true,
  hooks: {
    beforeCreate: async (saleOrder) => {
      if (!saleOrder.orderNumber) {
        const count = await SaleOrder.count();
        saleOrder.orderNumber = `SO-${String(count + 1).padStart(6, '0')}`;
      }
    }
  }
});

module.exports = SaleOrder;

