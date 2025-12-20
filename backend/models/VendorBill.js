const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VendorBill = sequelize.define('VendorBill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  billNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'bill_number'
  },
  purchaseOrderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'purchase_orders',
      key: 'id'
    },
    field: 'purchase_order_id'
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
  invoiceDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'invoice_date'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'due_date'
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
  paidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'paid_amount'
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue'),
    allowNull: false,
    defaultValue: 'draft'
  }
}, {
  tableName: 'vendor_bills',
  timestamps: true,
  hooks: {
    beforeCreate: async (bill) => {
      if (!bill.billNumber) {
        const count = await VendorBill.count();
        bill.billNumber = `BILL-${String(count + 1).padStart(6, '0')}`;
      }
    }
  }
});

module.exports = VendorBill;

