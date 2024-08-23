// models/portfolio.js
module.exports = (sequelize, DataTypes) => {
  const Portfolio = sequelize.define('Portfolio', {
      asset_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      average_price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
      },
      // No need to define total_value here because it's a generated column in the DB
  }, {
      timestamps: true, // or false, depending on whether you need createdAt and updatedAt
      tableName: 'portfolio',
  });

  // Including total_value in the model's attribute list when querying
  Portfolio.prototype.toJSON = function () {
      const values = Object.assign({}, this.get());

      // Add total_value manually from raw data, if present
      if (this.getDataValue('total_value') !== undefined) {
          values.total_value = this.getDataValue('total_value');
      }
      
      return values;
  };

  return Portfolio;
};
