// models/portfolioAsset.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as needed

class PortfolioAsset extends Model {}

PortfolioAsset.init({
  portfolio_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'portfolios',
      key: 'portfolio_id'
    },
    primaryKey: true,
  },
  asset_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'assets',
      key: 'asset_id'
    },
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,  // Start with 0 quantity
  },
  average_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,  // Start with 0 average price
  }
}, {
  sequelize,
  modelName: 'PortfolioAsset',
  tableName: 'portfolio_assets',
  timestamps: false,  // No timestamps for this junction table
});

module.exports = PortfolioAsset;
