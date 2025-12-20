const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CustomerInvoice = sequelize.define('CustomerInvoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'invoice_number'
  },
  saleOrderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'sale_orders',
      key: 'id'
    },
    field: 'sale_order_id'
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
  tableName: 'customer_invoices',
  timestamps: true,
  hooks: {
    beforeCreate: async (invoice) => {
      if (!invoice.invoiceNumber) {
        const count = await CustomerInvoice.count();
        invoice.invoiceNumber = `INV-${String(count + 1).padStart(6, '0')}`;
      }
    }
  }
});

module.exports = CustomerInvoice;

