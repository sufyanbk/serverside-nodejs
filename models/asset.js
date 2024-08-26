const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asset = sequelize.define('Asset', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    asset_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    asset_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    ticker: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    value: {
        type: DataTypes.DECIMAL(10, 2),
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
    tableName: 'assets',
    timestamps: true,  // Disable automatic timestamps (createdAt, updatedAt)
});

module.exports = Asset;
