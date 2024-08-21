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
