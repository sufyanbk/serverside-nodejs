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

exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;  // Extract the asset_id from the request parameters

    try {
        // Find the transaction by id
        const transaction = await Transaction.findByPk(id);

        // If the transaction does not exist, return a 404 error
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Delete the transaction
        await transaction.destroy();

        // Return a success message
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        console.error('Error deleting transaction:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateTransaction = async (req, res) => {
    const { id } = req.params;  // Extract the id from the request parameters
    const { asset_id, asset_type, quantity, price, transaction_date, user_id } = req.body;  // Extract updated data from the request body

    try {
        // Find the transaction by id
        const transaction = await Transaction.findByPk(id);

        // If the transaction does not exist, return a 404 error
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Update the transaction with the new data
        transaction.asset_id = asset_id !== undefined ? asset_id : transaction.asset_id;
        transaction.asset_type = asset_type !== undefined ? asset_type : transaction.asset_type;
        transaction.quantity = quantity !== undefined ? quantity : transaction.quantity;
        transaction.price = price !== undefined ? price : transaction.price;
        transaction.transaction_date = transaction_date !== undefined ? transaction_date : transaction.transaction_date;
        transaction.user_id = user_id !== undefined ? user_id : transaction.user_id;

        // Save the updated transaction to the database
        await transaction.save();

        // Return the updated transaction
        res.status(200).json(transaction);
    } catch (err) {
        console.error('Error updating transaction:', err);
        res.status(500).json({ error: err.message });
    }
};