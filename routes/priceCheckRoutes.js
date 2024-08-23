// const express = require('express');
// const { lastCheckResults, checkAssetPrices } = require('../controllers/assetController');  // Import it

// const router = express.Router();

// router.get('/price-check', async (req, res) => {
//     try {
//         console.log('lastCheckResults:', lastCheckResults);  // Log the results to the console
//         res.json(lastCheckResults);  // Return the latest price check results
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch price comparisons' });
//     }
// });

// module.exports = router;


const express = require('express');
const { checkAssetPrices } = require('../controllers/assetController');

const router = express.Router();

router.get('/price-check', async (req, res) => {
    try {
        var resultsReceived = [];
        resultsReceived = await checkAssetPrices()
        //console.log('lastCheckResults:', );  // Log the results
        res.json(resultsReceived);  // Return the latest price check results
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch price comparisons' });
    }
});

module.exports = router;

