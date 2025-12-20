const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  paymentNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'payment_number'
  },
  contactId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contacts',
      key: 'id'
    },
    field: 'contact_id'
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'customer_invoices',
      key: 'id'
    },
    field: 'invoice_id'
  },
  billId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'vendor_bills',
      key: 'id'
    },
    field: 'bill_id'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'payment_date'
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'card', 'bank_transfer', 'online'),
    allowNull: false,
    field: 'payment_method'
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true,
  hooks: {
    beforeCreate: async (payment) => {
      if (!payment.paymentNumber) {
        const count = await Payment.count();
        payment.paymentNumber = `PAY-${String(count + 1).padStart(6, '0')}`;
      }
    }
  }
});

module.exports = Payment;

