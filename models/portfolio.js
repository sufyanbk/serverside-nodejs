// models/portfolio.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as needed

class Portfolio extends Model {}

Portfolio.init({
  portfolio_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  average_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: DataTypes.NOW,
  }
}, {
  sequelize,
  modelName: 'Portfolio',
  tableName: 'portfolios',
  timestamps: true,  // Enable timestamps
});

module.exports = Portfolio;