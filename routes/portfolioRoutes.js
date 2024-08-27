const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// Create a new portfolio
router.post('/portfolios', portfolioController.createPortfolio);

// Get all portfolios
router.get('/portfolios', portfolioController.getAllPortfolios);

// Get a specific portfolio by ID
router.get('/portfolios/:id', portfolioController.getPortfolioById);

// Delete a portfolio by ID
router.delete('/portfolios/:id', portfolioController.deletePortfolio);

// Add an asset to a portfolio
router.post('/portfolios/:portfolioId/assets/:assetId', portfolioController.addAssetToPortfolio);

// Remove an asset from a portfolio
router.delete('/portfolios/:portfolioId/assets/:assetId', portfolioController.removeAssetFromPortfolio);

module.exports = router;
