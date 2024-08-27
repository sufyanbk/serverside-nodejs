const express = require('express');
const { checkAssetPrices } = require('../controllers/assetController');

const router = express.Router();

// Route to check asset prices
router.get('/price-check', async (req, res) => {
    try {
        const resultsReceived = await checkAssetPrices(); // Fetch the price check results
        res.json(resultsReceived);  // Return the results as JSON
    } catch (error) {
        console.error('Error fetching price comparisons:', error.message);  // Log the error for debugging
        res.status(500).json({ error: 'Failed to fetch price comparisons' });
    }
});

module.exports = router;
