const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CouponCode = sequelize.define('CouponCode', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  discountOfferId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'discount_offers',
      key: 'id'
    },
    field: 'discount_offer_id'
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expiration_date'
  },
  status: {
    type: DataTypes.ENUM('unused', 'used'),
    allowNull: false,
    defaultValue: 'unused'
  },
  contactId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'contacts',
      key: 'id'
    },
    field: 'contact_id'
  }
}, {
  tableName: 'coupon_codes',
  timestamps: true
});

module.exports = CouponCode;

