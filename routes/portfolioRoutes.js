// routes/portfolio.js
const express = require('express');
const { Portfolio } = require('../models'); // Import the Portfolio model
const router = express.Router();

// Create a new portfolio entry
router.post('/', async (req, res) => {
  try {
    const portfolio = await Portfolio.create(req.body);
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all portfolio entries
router.get('/', async (req, res) => {
  try {
    const portfolios = await Portfolio.findAll();
    res.status(200).json(portfolios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific portfolio entry by ID
router.get('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio entry not found' });
    }
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a portfolio entry by ID
router.put('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio entry not found' });
    }
    await portfolio.update(req.body);
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a portfolio entry by ID
router.delete('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio entry not found' });
    }
    await portfolio.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
