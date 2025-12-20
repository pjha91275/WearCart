const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentTerm = sequelize.define('PaymentTerm', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  earlyPaymentDiscount: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'early_payment_discount'
  },
  discountPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    field: 'discount_percentage'
  },
  discountDays: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'discount_days'
  },
  earlyPayDiscountComputation: {
    type: DataTypes.ENUM('base_amount', 'total_amount'),
    allowNull: true,
    field: 'early_pay_discount_computation'
  },
  examplePreview: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'example_preview'
  }
}, {
  tableName: 'payment_terms',
  timestamps: true
});

module.exports = PaymentTerm;

