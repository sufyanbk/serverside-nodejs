const Sequelize = require('sequelize');
const sequelize = require('../config/database'); // Adjust path if necessary

// Import models
const Asset = require('./asset'); // Adjust the path if necessary
const Portfolio = require('./portfolio');
const Transaction = require('./transaction');

// Establish associations
Portfolio.belongsTo(Asset, { foreignKey: 'asset_id', as: 'asset' });
Transaction.belongsTo(Asset, { foreignKey: 'asset_id', as: 'asset' });

// Add other associations if needed

// Create the database object to be exported
const db = {
  sequelize,
  Sequelize,
  Asset,
  Portfolio,
  Transaction,
};

// Export the database object
module.exports = db;
