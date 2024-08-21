const Sequelize = require('sequelize');
const sequelize = require('../config/database'); // Adjust path based on your setup
const Portfolio = require('./portfolio')(sequelize, Sequelize);
//const Transaction = require('./transaction')(sequelize, Sequelize);

const db = {
  Portfolio,
  //Transaction,
};

db.sequelize = sequelize;
//db.Sequelize = Sequelize;

module.exports = db;
