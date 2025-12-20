const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DiscountOffer = sequelize.define('DiscountOffer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  discountPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: 'discount_percentage'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_date'
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_date'
  },
  availableOn: {
    type: DataTypes.ENUM('sales', 'website'),
    allowNull: false,
    field: 'available_on'
  }
}, {
  tableName: 'discount_offers',
  timestamps: true
});

module.exports = DiscountOffer;

