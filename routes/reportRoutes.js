const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Get Portfolio Summary
router.get('/portfolio-summary/:user_id', reportController.getPortfolioSummary);

// Get Asset Performance
router.get('/asset-performance/:asset_id', reportController.getAssetPerformance);

// Get Transaction History by Date Range
router.get('/transactions', reportController.getTransactionHistory);

// Get User Investment Overview
router.get('/user-investment/:user_id', reportController.getUserInvestmentOverview);

module.exports = router;
