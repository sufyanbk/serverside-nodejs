
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
      }
      // Notice that total_value is not included here
    }, {
      timestamps: true, // or false, depending on whether you need createdAt and updatedAt
      tableName: 'portfolio',
    });
  
    return Portfolio;
};
