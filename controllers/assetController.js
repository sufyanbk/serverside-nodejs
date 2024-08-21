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