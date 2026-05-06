const express = require('express');
const Destination = require('../models/Destination');
const router = express.Router();

// Get all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json({ destinations });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching destinations', error: error.message });
  }
});

// Get specific destination
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.status(200).json({ destination });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching destination', error: error.message });
  }
});

module.exports = router;
