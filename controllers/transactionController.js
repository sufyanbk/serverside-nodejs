const Transaction = require('../models/asset');

// Get all assets
// Controller function to get all assets from the database
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'An error occurred while fetching assets.' });
    }
};