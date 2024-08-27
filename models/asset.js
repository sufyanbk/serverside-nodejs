// models/asset.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as needed

class Asset extends Model {}

Asset.init({
  asset_id: {
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
  sequelize,
  modelName: 'Asset',
  tableName: 'assets',
  timestamps: true,  // Enable timestamps
});

module.exports = Asset;