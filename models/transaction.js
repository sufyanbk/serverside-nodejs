// models/transaction.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as needed

class Transaction extends Model {}

Transaction.init({
  transaction_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  portfolio_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'portfolios',
      key: 'portfolio_id'
    }
  },
  asset_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'assets',
      key: 'asset_id'
    }
  },
  asset_name: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  transaction_type: {
    type: DataTypes.ENUM('buy', 'sell'),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  transaction_date: {
    type: DataTypes.DATE,
    allowNull: false,
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
  modelName: 'Transaction',
  tableName: 'transactions',
  timestamps: true,  // Enable timestamps
});

module.exports = Transaction;
