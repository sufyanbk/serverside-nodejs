const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

// Add a new asset
router.post('/assets', assetController.addAsset);

// Get all assets
router.get('/assets', assetController.getAllAssets);

// Get a specific asset by ID
router.get('/assets/:id', assetController.getAssetById);

// Edit an asset by ID
router.put('/assets/:id', assetController.editAsset);

// Delete an asset by ID
router.delete('/assets/:id', assetController.deleteAsset);

module.exports = router;
