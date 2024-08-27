const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const sequelize = require('./config/database'); // Import sequelize for database sync

// Import routes
const portfolioRoutes = require('./routes/portfolioRoutes');
const assetRoutes = require('./routes/assetRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reportRoutes = require('./routes/reportRoutes'); 
const chartsRoutes = require('./routes/chartsRoutes');
const priceCheckRoutes = require('./routes/priceCheckRoutes');

// Import cron for scheduled tasks
const cron = require('node-cron'); 
const { checkAssetPrices } = require('./controllers/assetController'); // Asset price checker

// Middleware to parse JSON bodies
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // To parse JSON bodies

// Register routes with the '/api' prefix
app.use('/api', portfolioRoutes);
app.use('/api', assetRoutes);
app.use('/api', transactionRoutes);
app.use('/api', reportRoutes);
app.use('/api', chartsRoutes);
app.use('/api', priceCheckRoutes); // Price check route

// Global error handling
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

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

// Uncomment the following block if you decide to use the 24-hour schedule as well
// Schedule the task to run every 24 hours
// cron.schedule('0 0 * * *', async () => {
//     console.log('Running scheduled check for asset prices...');
//     try {
//         await checkAssetPrices();
//         console.log("checkAssetPrices function executed.");
//     } catch (error) {
//         console.error("Error executing checkAssetPrices:", error);
//     }
// });

// Sync database and start server
const PORT = process.env.PORT || 3000;
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });
