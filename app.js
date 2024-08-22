const express = require('express');
const app = express();
const sequelize = require('./config/database');
const Portfolio = require('./models/portfolio');
const assetRoutes = require('./routes/assetRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const userRoutes = require('./routes/userRoutes')
const reportRoutes = require('./routes/reportRoutes'); 
const chartsRoutes = require('./routes/chartsRoutes');

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api', assetRoutes);
app.use('/transactions', transactionRoutes);
app.use('/api', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/charts', chartsRoutes);


const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Unable to connect to the database:', error);
});
