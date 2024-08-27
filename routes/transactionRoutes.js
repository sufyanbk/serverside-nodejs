const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Route to create a new transaction (buy or sell)
router.post('/transactions', transactionController.createTransaction);

// Get all transactions
router.get('/transactions', transactionController.getAllTransactions);

// Get transactions by portfolio ID
router.get('/transactions/portfolio/:portfolioId', transactionController.getTransactionsByPortfolio);

// Get transactions by asset ID
router.get('/transactions/asset/:assetId', transactionController.getTransactionsByAsset);

module.exports = router;
