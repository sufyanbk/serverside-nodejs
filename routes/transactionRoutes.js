const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Route to create a new transaction (buy or sell)
router.post('/transactions', transactionController.createTransaction);

module.exports = router;