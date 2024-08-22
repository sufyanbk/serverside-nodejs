//Const for CRUD functions
const Asset = require('../models/asset');

//Const for alpha vantage trigger and timing price check
require('dotenv').config(); //api key fomr alpha
const axios = require('axios');
const { Op } = require('sequelize'); // Import Op for Sequelize operators

// api key alpha
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

//Function to fetch the current price of an asset from alpha vantage API
const fetchCurrentPrice = async (ticker) => {
    try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`;
        const response = await axios.get(url);
        const price = response.data['Global Quote']['05. price'];

        console.log(`Fetched price for ${ticker}: ${price}`);
        return parseFloat(price);
    } catch (error) {
        console.error(`Error fetching current price for ${ticker}:`, error.message);
        return null;
    }
};

// Function to check and update asset prices
exports.checkAssetPrices = async () => {
    try {
        const date24HoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const assetsToCheck = await Asset.findAll({
            where: {
                updatedAt: {
                    [Op.lte]: date24HoursAgo
                }
            }
        });

        for (const asset of assetsToCheck) {
            const currentPrice = await fetchCurrentPrice(asset.ticker);
            if (currentPrice !== null) {
                console.log(`Current price of ${asset.ticker}: ${currentPrice}`);
                // You can store the current price or compare it with the stored value as needed
            }
        }
    } catch (error) {
        console.error('Error checking asset prices:', error);
    }
};


// /////////////////////    testing  the price checker  /////////////////////////////////////

// if (require.main === module) {
//     // This block will only run if this file is run directly from the Node.js command line
//     exports.checkAssetPrices().then(() => {
//         console.log("checkAssetPrices function executed.");
//     }).catch((error) => {
//         console.error("Error executing checkAssetPrices:", error);
//     });
// }


// ///////////////////////   testing






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

// pick asset based on id 
exports.getAssetByid = async (req, res) => {
    try {
        const { id } = req.params; // Get the ticker from the request parameters
        const asset = await Asset.findOne({ where: { id } }); // Find the asset by ticker

        if (asset) {
            res.json(asset); // Return the asset if found
        } else {
            res.status(404).json({ error: 'Asset not found' }); // Return 404 if not found
        }
    } catch (error) {
        console.error('Error fetching asset by id:', error);
        res.status(500).json({ error: 'An error occurred while fetching the asset.' });
    }
};

// pick asset based on Ticker
exports.getAssetByTicker = async (req, res) => {
    try {
        const { ticker } = req.params; // Get the ticker from the request parameters
        const asset = await Asset.findOne({ where: { ticker } }); // Find the asset by ticker

        if (asset) {
            res.json(asset); // Return the asset if found
        } else {
            res.status(404).json({ error: 'Asset not found' }); // Return 404 if not found
        }
    } catch (error) {
        console.error('Error fetching asset by ticker:', error);
        res.status(500).json({ error: 'An error occurred while fetching the asset.' });
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