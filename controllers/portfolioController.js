const { Portfolio, Asset, PortfolioAsset, Transaction } = require('../models');

// Create a new portfolio
exports.createPortfolio = async (req, res) => {
  try {
    const { average_price, quantity } = req.body;
    const newPortfolio = await Portfolio.create({ average_price, quantity });
    res.status(201).json(newPortfolio);
  } catch (error) {
    console.error('Error creating portfolio:', error);
    res.status(500).json({ error: 'An error occurred while creating the portfolio' });
  }
};

// Get all portfolios
exports.getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.findAll();
    res.status(200).json(portfolios);
  } catch (error) {
    console.error('Error retrieving portfolios:', error);
    res.status(500).json({ error: 'An error occurred while retrieving portfolios' });
  }
};

// Get a specific portfolio by ID
exports.getPortfolioById = async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findByPk(id, {
      include: { all: true } // Includes associated models
    });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    res.status(200).json(portfolio);
  } catch (error) {
    console.error('Error retrieving portfolio:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the portfolio' });
  }
};

// Delete a portfolio by ID
exports.deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findByPk(id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Remove all assets from the portfolio before deleting it
    await PortfolioAsset.destroy({ where: { portfolio_id: id } });

    // Then delete the portfolio
    await portfolio.destroy();
    res.status(200).json({ message: 'Portfolio and all associated assets deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    res.status(500).json({ error: 'An error occurred while deleting the portfolio' });
  }
};
exports.addAssetToPortfolio = async (req, res) => {
  try {
    const { portfolioId, assetId } = req.params;
    const { quantity, price } = req.body;

    // Check if the portfolio exists
    const portfolio = await Portfolio.findByPk(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Check if the asset exists
    const asset = await Asset.findByPk(assetId);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Add or update the asset in the portfolio
    let portfolioAsset = await PortfolioAsset.findOne({
      where: { portfolio_id: portfolioId, asset_id: assetId },
    });

    if (portfolioAsset) {
      // If the asset is already in the portfolio, update the quantity and average price
      const newQuantity = portfolioAsset.quantity + quantity;
      const newAveragePrice =
        (portfolioAsset.average_price * portfolioAsset.quantity + price * quantity) / newQuantity;

      portfolioAsset.quantity = newQuantity;
      portfolioAsset.average_price = newAveragePrice;
      await portfolioAsset.save();
    } else {
      // If the asset is not in the portfolio, create a new PortfolioAsset entry
      portfolioAsset = await PortfolioAsset.create({
        portfolio_id: portfolioId,
        asset_id: assetId,
        quantity,
        average_price: price,
      });
    }

    // Update the portfolio's total quantity and average price
    const newPortfolioQuantity = portfolio.quantity + quantity;
    portfolio.average_price =
      (portfolio.average_price * portfolio.quantity + price * quantity) / newPortfolioQuantity;
    portfolio.quantity = newPortfolioQuantity;

    // Save the updated portfolio
    await portfolio.save();

    // Create a transaction for the asset addition
    await Transaction.create({
      portfolio_id: portfolioId,
      asset_id: assetId,
      asset_name: asset.asset_name,
      transaction_type: 'buy',
      quantity,
      price,
      transaction_date: new Date(), // Use the current date
    });

    res.status(200).json({ message: 'Asset added to portfolio successfully' });
  } catch (error) {
    console.error('Error adding asset to portfolio:', error);
    res.status(500).json({ error: 'An error occurred while adding the asset to the portfolio' });
  }
};
exports.removeAssetFromPortfolio = async (req, res) => {
  try {
    const { portfolioId, assetId } = req.params;
    const { quantity, price } = req.body;

    // Check if the portfolio exists
    const portfolio = await Portfolio.findByPk(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Check if the asset exists in the portfolio
    const portfolioAsset = await PortfolioAsset.findOne({
      where: { portfolio_id: portfolioId, asset_id: assetId },
    });

    if (!portfolioAsset) {
      return res.status(404).json({ error: 'Asset not found in portfolio' });
    }

    // Fetch the asset details
    const asset = await Asset.findByPk(assetId);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Check if the quantity to remove is available
    if (portfolioAsset.quantity < quantity) {
      return res.status(400).json({ error: 'Not enough assets in portfolio to remove' });
    }

    // Calculate the transaction value for the sell operation
    const transactionValue = quantity * price;

    // Update the quantity in the portfolio
    portfolioAsset.quantity -= quantity;
    if (portfolioAsset.quantity === 0) {
      await portfolioAsset.destroy(); // Remove the asset if the quantity is 0
    } else {
      await portfolioAsset.save(); // Otherwise, save the updated quantity
    }

    // Update the portfolio's total quantity and average price
    portfolio.quantity -= quantity;
    if (portfolio.quantity > 0) {
      portfolio.average_price = (portfolio.average_price * (portfolio.quantity + quantity) - transactionValue) / portfolio.quantity;
    } else {
      portfolio.average_price = 0.00; // Reset average price if no assets are left
    }

    // Save the updated portfolio
    await portfolio.save();

    // Create a transaction for the asset removal
    await Transaction.create({
      portfolio_id: portfolioId,
      asset_id: assetId,
      asset_name: asset.asset_name,  // Ensure asset_name is set here
      transaction_type: 'sell',
      quantity,
      price,
      transaction_date: new Date(), // Use the current date
    });

    res.status(200).json({ message: 'Asset removed from portfolio successfully' });
  } catch (error) {
    console.error('Error removing asset from portfolio:', error);
    res.status(500).json({ error: 'An error occurred while removing the asset from the portfolio' });
  }
};
