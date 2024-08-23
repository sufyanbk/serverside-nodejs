//Const for CRUD functions
const Asset = require('../models/asset');

//Const for alpha vantage trigger and timing price check
require('dotenv').config(); //api key fomr alpha
const axios = require('axios');
const { Op } = require('sequelize'); // Import Op for Sequelize operators


// api key alpha
//const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

const yahooFinance = require('yahoo-finance2').default;

const fetchCurrentPrice = async (ticker) => {
    try {
        const quote = await yahooFinance.quote(ticker, {}, { validateResult: false });
        const price = quote.regularMarketPrice;
        //console.log(`Fetched price for ${ticker}: ${price}`);
        return parseFloat(price);
    } catch (error) {
        console.error(`Error fetching current price for ${ticker} from Yahoo Finance:`, error.message);
        return null;
    }
};

var tempCheckResults = [];
function pushToList(results) {
    tempCheckResults.push(results);
}

exports.checkAssetPrices = async () => {
    try {
        const date1MinuteAgo = new Date(Date.now() - 1 * 60 * 1000);  // Adjusted for testing

        const assetsToCheck = await Asset.findAll({
            where: {
                updatedAt: {
                    [Op.lte]: date1MinuteAgo  // Adjusted for testing purposes
                }
            }
        });
    
        for (const asset of assetsToCheck) {
            const currentPrice = await fetchCurrentPrice(asset.ticker);
            if (currentPrice !== null) {
                const savedPrice = parseFloat(asset.value);  // Ensure this is a number
                const priceDifference = currentPrice - savedPrice;
                const percentageChange = ((priceDifference / savedPrice) * 100).toFixed(2);

                const result = {
                    asset: asset.ticker,
                    savedPrice: savedPrice,
                    currentPrice: currentPrice,
                    priceDifference: priceDifference.toFixed(2),  // String with 2 decimals
                    percentageChange: `${percentageChange}%`,  // Add % sign for clarity
                    status: priceDifference >= 0 ? "Profit" : "Loss"  // Indicate profit or loss
                };

                pushToList(result);
            }
        }
        return tempCheckResults;  // Return the results for further use if needed
    } catch (error) {
        console.error('Error checking asset prices:', error);
        return [];
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


//exports.lastCheckResults = lastCheckResults;  // Export the variable