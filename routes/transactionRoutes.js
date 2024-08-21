const express = require('express');
const router = express.Router();
// Import the controller that handles asset-related logic
const transactionController = require('../controllers/transactionController');

// Define the route for GET /assets
// This route will call the getAllAssets controller function to fetch all assets
router.get('/assets', transactionController.getAllTransactions);

module.exports = router;