const { DataTypes } = require('sequelize');

// Import the configured sequelize instance
const sequelize = require('../config/database');

// Define the 'Asset' model, which maps to the 'assets' table in the database
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
    value : {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'assets',
    timestamps: false,  // Disable automatic timestamps (createdAt, updatedAt)
});

// Export the model to be used in other parts of the application
module.exports = Asset;
