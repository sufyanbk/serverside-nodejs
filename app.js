const express = require('express');
const app = express();
const sequelize = require('./config/database');
const Portfolio = require('./models/portfolio');
const assetRoutes = require('./routes/assetRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const userRoutes = require('./routes/userRoutes')
const reportRoutes = require('./routes/reportRoutes'); 
const priceCheckRoutes = require('./routes/priceCheckRoutes');
const cron = require('node-cron'); // con for the auto updater 12 or 24 hr
const { checkAssetPrices } = require('./controllers/assetController'); //cono for the auto updater 12 or 24 hr

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api', assetRoutes);
app.use('/transactions', transactionRoutes);
app.use('/api', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api', priceCheckRoutes); // Pirce check route


// Schedule the task to run every 12 hours
cron.schedule('0 */12 * * *', async () => {
    console.log('Running scheduled check for asset prices...');
    try {
        await checkAssetPrices();
        console.log("checkAssetPrices function executed.");
    } catch (error) {
        console.error("Error executing checkAssetPrices:", error);
    }
});

// // Schedule the task to run every 24 hours
// cron.schedule('0 0 * * *', async () => {
//     console.log('Running scheduled check for asset prices...');
//     try {
//         await checkAssetPrices();
//         console.log("checkAssetPrices function executed.");
//     } catch (error) {
//         console.error("Error executing checkAssetPrices:", error);
//     }
// });


// Start the server

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Unable to connect to the database:', error);
});
