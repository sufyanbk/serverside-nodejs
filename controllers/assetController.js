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

// // pick asset based on Ticker
// exports.getAssetByTicker = async (req, res) => {
//     try {
//         const { ticker } = req.params; // Get the ticker from the request parameters
//         const asset = await Asset.findOne({ where: { ticker } }); // Find the asset by ticker

//         if (asset) {
//             res.json(asset); // Return the asset if found
//         } else {
//             res.status(404).json({ error: 'Asset not found' }); // Return 404 if not found
//         }
//     } catch (error) {
//         console.error('Error fetching asset by ticker:', error);
//         res.status(500).json({ error: 'An error occurred while fetching the asset.' });
//     }
// };

// Add a new asset
exports.addAsset = async (req, res) => {
  try {
    const { asset_name, asset_type, ticker, value } = req.body;
    const newAsset = await Asset.create({ asset_name, asset_type, ticker, value });
    res.status(201).json(newAsset);
  } catch (error) {
    console.error('Error adding asset:', error);
    res.status(500).json({ error: 'An error occurred while adding the asset' });
  }
};

// Get all assets
exports.getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll();
    res.status(200).json(assets);
  } catch (error) {
    console.error('Error retrieving assets:', error);
    res.status(500).json({ error: 'An error occurred while retrieving assets' });
  }
};

// Get a specific asset by ID
exports.getAssetById = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.status(200).json(asset);
  } catch (error) {
    console.error('Error retrieving asset:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the asset' });
  }
};

// Edit an asset by ID
exports.editAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { asset_name, asset_type, ticker, value } = req.body;

    const asset = await Asset.findByPk(id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    asset.asset_name = asset_name;
    asset.asset_type = asset_type;
    asset.ticker = ticker;
    asset.value = value;

    await asset.save();
    res.status(200).json(asset);
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ error: 'An error occurred while updating the asset' });
  }
};

// Delete an asset by ID
exports.deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    await asset.destroy();
    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ error: 'An error occurred while deleting the asset' });
  }
};