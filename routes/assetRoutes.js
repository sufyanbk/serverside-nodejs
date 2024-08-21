const express = require('express');
const router = express.Router();
// Import the controller that handles asset-related logic
const assetController = require('../controllers/assetController');

// Define the route for GET /assets
// This route will call the getAllAssets controller function to fetch all assets

// get all assets
router.get('/assets', assetController.getAllAssets);

// get assets by id
router.get('/assets/id/:id', assetController.getAssetByid);

// get assets by ticker
router.get('/assets/ticker/:ticker', assetController.getAssetByTicker);

router.post('/assets', assetController.createAsset);

router.put('/assets/:id', assetController.updateAsset);

router.delete('/assets/:id', assetController.deleteAsset);

module.exports = router;
