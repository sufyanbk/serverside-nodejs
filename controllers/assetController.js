const Asset = require('../models/asset');

// Get all assets
// Controller function to get all assets from the database
exports.getAllAssets = async (req, res) => {
    try {
        const assets = await Asset.findAll();
        res.json(assets);
    } catch (error) {
        console.error('Error fetching assets:', error);
        res.status(500).json({ error: 'An error occurred while fetching assets.' });
    }
};

// Create asset

exports.createAsset = async (req, res) => {
    try {
        const { asset_name, asset_type, ticker, value } = req.body;
        const newAsset = await Asset.create({
            asset_name,
            asset_type,
            ticker,
            value,
        });
        res.status(201).json(newAsset);
    } catch (error) {
        console.error('Error creating asset:', error);
        res.status(500).json({ error: 'An error occurred while creating the asset.' });
    }
};

// Update Asset

exports.updateAsset = async (req, res) => {
    try {
        const { id } = req.params; // Assume asset ID is passed as a URL parameter
        const { asset_name, asset_type, ticker, value } = req.body;

        // Find the asset by ID
        const asset = await Asset.findByPk(id);

        // If asset is not found, return 404 error
        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }

        // Update the asset with new values
        asset.asset_name = asset_name !== undefined ? asset_name : asset.asset_name;
        asset.asset_type = asset_type !== undefined ? asset_type : asset.asset_type;
        asset.ticker = ticker !== undefined ? ticker : asset.ticker;
        asset.value = value !== undefined ? value : asset.value;

        // Save the updated asset
        await asset.save();

        // Respond with the updated asset
        res.status(200).json(asset);
    } catch (error) {
        console.error('Error updating asset:', error);
        res.status(500).json({ error: 'An error occurred while updating the asset.' });
    }
};

// delete asset
exports.deleteAsset = async (req, res) => {
    try {
        const { id } = req.params; // Assume asset ID is passed as a URL parameter

        // Find the asset by ID
        const asset = await Asset.findByPk(id);

        // If asset is not found, return 404 error
        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }

        // Delete the asset
        await asset.destroy();

        // Respond with a success message
        res.status(200).json({ message: 'Asset deleted successfully' });
    } catch (error) {
        console.error('Error deleting asset:', error);
        res.status(500).json({ error: 'An error occurred while deleting the asset.' });
    }
};