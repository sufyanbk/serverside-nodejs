const { Op } = require('sequelize');
const Transaction = require('../models/transaction');
const Portfolio = require('../models/portfolio');
const Asset = require('../models/asset');


// Get Portfolio Summary
exports.getPortfolioSummary = async (req, res) => {
    const { user_id } = req.params;
    try {
        const portfolio = await Portfolio.findAll({ where: { user_id } });

        if (portfolio.length === 0) {
            return res.status(404).json({ message: 'No portfolio found for the user.' });
        }

        let totalInvestment = 0;
        let currentValue = 0;

        portfolio.forEach((item) => {
            totalInvestment += item.quantity * item.average_price;
            currentValue += item.total_value;
        });

        const profitLoss = currentValue - totalInvestment;

        res.json({
            user_id,
            totalInvestment,
            currentValue,
            profitLoss,
        });
    } catch (error) {
        console.error('Error fetching portfolio summary:', error);
        res.status(500).json({ error: 'An error occurred while fetching portfolio summary.' });
    }
};

// Get Asset Performance
exports.getAssetPerformance = async (req, res) => {
    const { asset_id } = req.params;
    try {
        const transactions = await Transaction.findAll({ where: { asset_id } });

        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found for the asset.' });
        }

        let totalQuantity = 0;
        let totalPrice = 0;

        transactions.forEach((transaction) => {
            totalQuantity += transaction.quantity;
            totalPrice += transaction.price * transaction.quantity;
        });

        const averagePrice = totalPrice / totalQuantity;

        // Assuming current market value is stored somewhere else, otherwise:
        const asset = await Asset.findByPk(asset_id);
        const currentMarketValue = asset ? asset.price : 0;  // Replace this with real-time market data if available

        res.json({
            asset_id,
            totalQuantity,
            averagePrice,
            currentMarketValue,
        });
    } catch (error) {
        console.error('Error fetching asset performance:', error);
        res.status(500).json({ error: 'An error occurred while fetching asset performance.' });
    }
};

// Get Transaction History by Date Range
exports.getTransactionHistory = async (req, res) => {
    const { start_date, end_date } = req.query;
    try {
        const transactions = await Transaction.findAll({
            where: {
                transaction_date: {
                    [Op.between]: [start_date, end_date],
                },
            },
        });

        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        res.status(500).json({ error: 'An error occurred while fetching transaction history.' });
    }
};

// Get User Investment Overview
exports.getUserInvestmentOverview = async (req, res) => {
    const { user_id } = req.params;
    try {
        const portfolio = await Portfolio.findAll({ where: { user_id } });

        if (portfolio.length === 0) {
            return res.status(404).json({ message: 'No portfolio found for the user.' });
        }

        let totalInvestment = 0;
        let currentValue = 0;
        let realizedGainLoss = 0;

        portfolio.forEach((item) => {
            totalInvestment += item.quantity * item.average_price;
            currentValue += item.total_value;
            // Calculate realized gain/loss (assuming this info is tracked somewhere)
            // realizedGainLoss += ... 
        });

        const unrealizedGainLoss = currentValue - totalInvestment;

        res.json({
            user_id,
            totalInvestment,
            currentValue,
            realizedGainLoss,
            unrealizedGainLoss,
        });
    } catch (error) {
        console.error('Error fetching user investment overview:', error);
        res.status(500).json({ error: 'An error occurred while fetching user investment overview.' });
    }
};
