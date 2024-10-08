const express = require('express');
const router = express.Router();
// Import the controller that handles asset-related logic
const chartsController = require('../controllers/chartsController');

router.get('/stocks', chartsController.getIntradayData);
router.get('/gainers', chartsController.getGainersData);
router.get('/losers', chartsController.getLosersData);
router.get('/commodities', chartsController.getHistoricalData);

module.exports = router;