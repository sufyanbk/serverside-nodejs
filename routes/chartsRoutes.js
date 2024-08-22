const express = require('express');
const router = express.Router();
// Import the controller that handles asset-related logic
const chartsController = require('../controllers/chartsController');

router.get('/', chartsController.getIntradayData);

module.exports = router;