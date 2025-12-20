const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('customer', 'vendor', 'both'),
    allowNull: false,
    defaultValue: 'customer'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      city: null,
      state: null,
      pincode: null
    }
  }
}, {
  tableName: 'contacts',
  timestamps: true
});

module.exports = Contact;

