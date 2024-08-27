const { Portfolio, Asset, PortfolioAsset } = require('../models');

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
    await portfolio.destroy();
    res.status(200).json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    res.status(500).json({ error: 'An error occurred while deleting the portfolio' });
  }
};

// Add an asset to a portfolio
exports.addAssetToPortfolio = async (req, res) => {
  try {
    const { portfolioId, assetId } = req.params;
    
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

    // Add asset to the portfolio
    await PortfolioAsset.findOrCreate({
      where: { portfolio_id: portfolioId, asset_id: assetId }
    });

    res.status(200).json({ message: 'Asset added to portfolio successfully' });
  } catch (error) {
    console.error('Error adding asset to portfolio:', error);
    res.status(500).json({ error: 'An error occurred while adding the asset to the portfolio' });
  }
};
