const { Transaction, Portfolio, Asset, PortfolioAsset } = require('../models');

// Function to handle buying or selling an asset
exports.createTransaction = async (req, res) => {
  const { portfolio_id, asset_id, transaction_type, quantity, price, transaction_date } = req.body;

  try {
    // Find the portfolio to which the transaction is associated
    const portfolio = await Portfolio.findByPk(portfolio_id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Find the asset to which the transaction is associated
    const asset = await Asset.findByPk(asset_id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Create the transaction
    const newTransaction = await Transaction.create({
      asset_name: asset.asset_name, //add asset_name here -> ASSET.asset_id ***
      portfolio_id,
      asset_id,
      transaction_type,
      quantity,
      price,
      transaction_date,
    });

    // Calculate the total transaction value
    const totalTransactionValue = quantity * price;

    // Update the portfolio based on transaction type
    if (transaction_type === 'buy') {
      portfolio.quantity += quantity;
      portfolio.average_price =
        (portfolio.average_price * (portfolio.quantity - quantity) + totalTransactionValue) / portfolio.quantity;
    } else if (transaction_type === 'sell') {
      if (portfolio.quantity < quantity) {
        return res.status(400).json({ error: 'Not enough assets in portfolio to sell' });
      }
      portfolio.quantity -= quantity;
      // Update average price if needed or handle specific selling logic (e.g., FIFO, LIFO)
    }

    // Save the updated portfolio
    await portfolio.save();

    // Check if the asset already exists in the portfolio
    let portfolioAsset = await PortfolioAsset.findOne({
      where: { portfolio_id, asset_id },
    });

    if (transaction_type === 'buy') {
      if (portfolioAsset) {
        // Update the quantity in PortfolioAsset
        portfolioAsset.quantity += quantity;
      } else {
        // If not, create a new PortfolioAsset
        portfolioAsset = await PortfolioAsset.create({ portfolio_id, asset_id, quantity });
      }
    } else if (transaction_type === 'sell') {
      if (portfolioAsset) {
        portfolioAsset.quantity -= quantity;
        if (portfolioAsset.quantity < 0) {
          return res.status(400).json({ error: 'Not enough assets in portfolio to sell' });
        }
      } else {
        return res.status(404).json({ error: 'Asset not found in portfolio' });
      }
    }

    // Save or update PortfolioAsset
    await portfolioAsset.save();

    res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
  } catch (error) {
    console.error('Error processing transaction:', error);
    res.status(500).json({ error: 'An error occurred while processing the transaction' });
  }
};