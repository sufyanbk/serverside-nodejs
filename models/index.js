const sequelize = require('../config/database');
const Asset = require('./asset');
const Portfolio = require('./portfolio');
const PortfolioAsset = require('./portfolioasset');
const Transaction = require('./transaction');

// Define associations
Asset.belongsToMany(Portfolio, { through: PortfolioAsset, foreignKey: 'asset_id' });
Portfolio.belongsToMany(Asset, { through: PortfolioAsset, foreignKey: 'portfolio_id' });

Portfolio.hasMany(Transaction, { foreignKey: 'portfolio_id' });
Transaction.belongsTo(Portfolio, { foreignKey: 'portfolio_id' });

Asset.hasMany(Transaction, { foreignKey: 'asset_id' });
Transaction.belongsTo(Asset, { foreignKey: 'asset_id' });

// Sync all models
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true }); // Use { force: true } for initial setup (drops tables)
    console.log('Database synced');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

syncModels();

module.exports = {
  Asset,
  Portfolio,
  PortfolioAsset,
  Transaction,
};