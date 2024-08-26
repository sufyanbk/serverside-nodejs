const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Asset = require('./asset');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    asset_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Asset, // Link to the Asset model
            key: 'id',
        },
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
        type: DataTypes.DATEONLY,
        allowNull: false,
    }
}, {
    timestamps: false, // You can set this to true if you want Sequelize to manage createdAt/updatedAt
    tableName: 'transactions',
});

Transaction.belongsTo(Asset, { foreignKey: 'asset_id', as: 'asset' });

module.exports = Transaction;

  