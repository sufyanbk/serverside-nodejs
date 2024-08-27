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
      asset_name: asset.asset_name,
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
    let portfolioAsset = await PortfolioAsset.findOne({
      where: { portfolio_id, asset_id },
    });

    if (transaction_type === 'buy') {
      // Update or create PortfolioAsset
      if (portfolioAsset) {
        // Calculate new average price for the asset in the portfolio
        const newQuantity = portfolioAsset.quantity + quantity;
        const newAveragePrice =
          (portfolioAsset.average_price * portfolioAsset.quantity + totalTransactionValue) / newQuantity;

        portfolioAsset.quantity = newQuantity;
        portfolioAsset.average_price = newAveragePrice;
      } else {
        portfolioAsset = await PortfolioAsset.create({
          portfolio_id,
          asset_id,
          quantity,
          average_price: price,
        });
      }

      // Update the portfolio's total quantity and average price
      const newPortfolioQuantity = portfolio.quantity + quantity;
      portfolio.average_price =
        (portfolio.average_price * portfolio.quantity + totalTransactionValue) / newPortfolioQuantity;
      portfolio.quantity = newPortfolioQuantity;
    } else if (transaction_type === 'sell') {
      if (portfolio.quantity < quantity || (portfolioAsset && portfolioAsset.quantity < quantity)) {
        return res.status(400).json({ error: 'Not enough assets in portfolio to sell' });
      }

      // Update PortfolioAsset for selling
      portfolioAsset.quantity -= quantity;
      if (portfolioAsset.quantity === 0) {
        await portfolioAsset.destroy(); // Remove the asset from the portfolio if quantity is 0
      } else {
        await portfolioAsset.save(); // Otherwise, save the updated quantity
      }

      // Update portfolio quantity
      portfolio.quantity -= quantity;
      if (portfolio.quantity === 0) {
        portfolio.average_price = 0.00; // Reset average price if no assets are left
      }
    }

    // Save the updated portfolio
    await portfolio.save();

    res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
  } catch (error) {
    console.error('Error processing transaction:', error);
    res.status(500).json({ error: 'An error occurred while processing the transaction' });
  }
};


// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'An error occurred while fetching transactions' });
  }
};

// Get transactions by portfolio ID
exports.getTransactionsByPortfolio = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const transactions = await Transaction.findAll({
      where: { portfolio_id: portfolioId },
    });
    if (!transactions.length) {
      return res.status(404).json({ error: 'No transactions found for this portfolio' });
    }
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions by portfolio:', error);
    res.status(500).json({ error: 'An error occurred while fetching transactions by portfolio' });
  }
};

// Get transactions by asset ID
exports.getTransactionsByAsset = async (req, res) => {
  try {
    const { assetId } = req.params;
    const transactions = await Transaction.findAll({
      where: { asset_id: assetId },
    });
    if (!transactions.length) {
      return res.status(404).json({ error: 'No transactions found for this asset' });
    }
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions by asset:', error);
    res.status(500).json({ error: 'An error occurred while fetching transactions by asset' });
  }
};
