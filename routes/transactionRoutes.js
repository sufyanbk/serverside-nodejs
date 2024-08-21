const express = require('express');
const router = express.Router();
// Import the controller that handles transaction-related logic
const transactionController = require('../controllers/transactionController');

// Define the route for GET /assets
// This route will call the getAllAssets controller function to fetch all assets
router.get('/list', transactionController.getAllTransactions);
router.post('/insert', transactionController.insertNewTransaction);

module.exports = router;