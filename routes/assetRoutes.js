const express = require('express');
const router = express.Router();
// Import the controller that handles asset-related logic
const assetController = require('../controllers/assetController');

// Define the route for GET /assets
// This route will call the getAllAssets controller function to fetch all assets
router.get('/assets', assetController.getAllAssets);

router.post('/assets', assetController.createAsset);

router.put('/assets/:id', assetController.updateAsset);

router.delete('/assets/:id', assetController.deleteAsset);

module.exports = router;
