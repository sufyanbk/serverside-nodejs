// models/portfolio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Asset = require('./asset');

const Portfolio = sequelize.define('Portfolio', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    portfolio_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    asset_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Asset, // This links the asset_id to the Asset model
            key: 'id',
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    average_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    total_value: {
        type: DataTypes.DECIMAL(15, 2), // Assuming you store total_value instead of calculating it dynamically
        allowNull: true, // Can be calculated or updated as needed
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
    tableName: 'portfolio',
    timestamps: true, // This will automatically manage createdAt and updatedAt fields
});

// Optionally define an association if you want to access related assets directly
Portfolio.belongsTo(Asset, { foreignKey: 'asset_id', as: 'asset' });

module.exports = Portfolio;
