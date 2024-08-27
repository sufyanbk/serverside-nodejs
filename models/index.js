const sequelize = require('../config/database');
const Asset = require('./asset');
const Portfolio = require('./portfolio');
const PortfolioAsset = require('./portfolioAsset');
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
    await sequelize.sync({ alter: true }); // { alter: true } updates the database schema to match the models
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    
    // Additional debugging information
    if (error.original) {
      console.error('Original error:', error.original);
    }
    
    if (error.errors) {
      error.errors.forEach((err) => console.error('Validation error:', err.message));
    }
  }
};

// Run the sync function
syncModels();

// Export the models for use in other parts of the application
module.exports = {
  Asset,
  Portfolio,
  PortfolioAsset,
  Transaction,
};
