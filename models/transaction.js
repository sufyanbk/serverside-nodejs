const { DataTypes } = require('sequelize');

// Import the configured sequelize instance
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    asset_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      asset_type: {
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
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
}, {
      timestamps: false,
      tableName: 'transactions',
});
  
module.exports = Transaction;
  