const Transaction = require('../models/transaction');

// Get all transactions
// Controller function to get all transactions from the database
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'An error occurred while fetching transactions.' });
    }
};

exports.insertNewTransaction = async (req, res) => {
    const { asset_id, asset_type, quantity, price, transaction_date, user_id } = req.body;

    // Check if all required fields are provided
    if (!asset_id || !asset_type || !quantity || !price || !transaction_date || !user_id) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newTransaction = await Transaction.create({
            asset_id,
            asset_type,
            quantity,
            price,
            transaction_date,
            user_id
        });
        res.status(201).json(newTransaction);
    } catch (err) {
        console.error('Error creating transaction:', err);
        res.status(500).json({ error: err.message });
    }
};
