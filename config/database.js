const { Sequelize } = require('sequelize');

// Create a Sequelize instance
const sequelize = new Sequelize('financial_portfolio', 'root', 'Khi2442526', {
    host: 'localhost',
    dialect: 'mysql',
});

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
