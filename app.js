const express = require('express');
const sequelize = require('./config/database');
const portfolioRoutes = require('./routes/portfolioRoutes');
//const assetRoutes = require('./routes/assets');
//const transactionRoutes = require('./routes/transactions');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/portfolio', portfolioRoutes);
//app.use('api/assets', assetRoutes);
//app.use('/transactions', transactionRoutes);

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Unable to connect to the database:', error);
});
