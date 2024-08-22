// Import DataTypes to define the model schema
const { DataTypes } = require('sequelize');
// Import the configured sequelize instance
const sequelize = require('../config/database');

// Define the 'User' model, which maps to the 'users' table in the database
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,      // Integer type for the primary key
        autoIncrement: true,          // Auto-incrementing ID
        primaryKey: true,             // Primary key of the table
    },
    first_name: {
        type: DataTypes.STRING(100),  // String with a maximum length of 100 characters
        allowNull: false,             // Field cannot be null
    },
    last_name: {
        type: DataTypes.STRING(100),  // String with a maximum length of 100 characters
        allowNull: false,             // Field cannot be null
    },
    email: {
        type: DataTypes.STRING(255),  // String with a maximum length of 255 characters
        allowNull: false,             // Field cannot be null
        unique: true,                 // Email must be unique
    },
    created_at: {
        type: DataTypes.DATE,         // Date type for created timestamp
        defaultValue: DataTypes.NOW,  // Default value is the current timestamp
    },
    updated_at: {
        type: DataTypes.DATE,         // Date type for updated timestamp
        defaultValue: DataTypes.NOW,  // Default value is the current timestamp
    },
}, {
    tableName: 'users',               // Explicitly specify the table name
    timestamps: false,                // Disable automatic timestamps (createdAt, updatedAt)
});

// Export the model to be used in other parts of the application
module.exports = User;
