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
  }
}, {
  sequelize,
  modelName: 'PortfolioAsset',
  tableName: 'portfolio_assets',
  timestamps: false,  // No timestamps for this junction table
});

module.exports = PortfolioAsset;