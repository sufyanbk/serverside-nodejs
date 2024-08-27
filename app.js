// const express = require('express');
// const app = express();
// const sequelize = require('./config/database');
// const assetRoutes = require('./routes/assetRoutes');
// const transactionRoutes = require('./routes/transactionRoutes');
// const portfolioRoutes = require('./routes/portfolioRoutes');
// const userRoutes = require('./routes/userRoutes')
// const reportRoutes = require('./routes/reportRoutes'); 
// const chartsRoutes = require('./routes/chartsRoutes');
// const priceCheckRoutes = require('./routes/priceCheckRoutes');
// const cron = require('node-cron'); // con for the auto updater 12 or 24 hr
// const { checkAssetPrices } = require('./controllers/assetController'); //cono for the auto updater 12 or 24 hr

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Routes
// app.use('/api/portfolio', portfolioRoutes);
// app.use('/api', assetRoutes);
// app.use('/transactions', transactionRoutes);
// app.use('/api', userRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/charts', chartsRoutes);
// app.use('/api', priceCheckRoutes); // Pirce check route


// // Schedule the task to run every 12 hours
// cron.schedule('0 */12 * * *', async () => {
//     console.log('Running scheduled check for asset prices...');
//     try {
//         await checkAssetPrices();
//         console.log("checkAssetPrices function executed.");
//     } catch (error) {
//         console.error("Error executing checkAssetPrices:", error);
//     }
// });

// // // Schedule the task to run every 24 hours
// // cron.schedule('0 0 * * *', async () => {
// //     console.log('Running scheduled check for asset prices...');
// //     try {
// //         await checkAssetPrices();
// //         console.log("checkAssetPrices function executed.");
// //     } catch (error) {
// //         console.error("Error executing checkAssetPrices:", error);
// //     }
// // });


// // Start the server

// const PORT = process.env.PORT || 3000;
// sequelize.sync().then(() => {
//     app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//     });
// }).catch(error => {
//     console.error('Unable to connect to the database:', error);
// });

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const portfolioRoutes = require('./routes/portfolioRoutes');
const assetRoutes = require('./routes/assetRoutes');
const transactionRoutes = require('./routes/transactionRoutes'); // New transaction routes

app.use(bodyParser.json()); // To parse JSON bodies
// Middleware to parse JSON requests
app.use(express.json());
// Use the transaction routes
app.use('/api', transactionRoutes);
// Register routes
app.use('/api', portfolioRoutes);
// Use the asset routes
app.use('/api', assetRoutes);
// Global error handling
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
