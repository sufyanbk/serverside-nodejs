const express = require('express');
const sequelize = require('./config/database');
const portfolioRoutes = require('./routes/portfolioRoutes');
//const assetRoutes = require('./routes/assetsRoutes');
//const transactionRoutes = require('./routes/transactionsRoutes');

const app = express();
const assetRoutes = require('./routes/assetRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const sequelize = require('./config/database');
const portfolioRoutes = require('./routes/portfolioRoutes');
//const assetRoutes = require('./routes/assetsRoutes');
//const transactionRoutes = require('./routes/transactionsRoutes');

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/portfolio', portfolioRoutes);
//app.use('api', assetRoutes);
//app.use('/transactions', transactionRoutes);

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Unable to connect to the database:', error);
});
