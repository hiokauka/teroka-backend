const express = require('express');
const router = express.Router();
const Itinerary = require('../models/itinerary');
const { v4: uuidv4 } = require('uuid');

// Create new itinerary
router.post('/', async (req, res) => {
  try {
    const { startDate, endDate, userid } = req.body;
    const itineraryid = uuidv4();

    const newItinerary = new Itinerary({
      itineraryid,
      startDate,
      endDate,
      userid
    });

    const savedItinerary = await newItinerary.save();
    res.status(201).json(savedItinerary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all itineraries (optionally filter by userid)
router.get('/', async (req, res) => {
  try {
    const { userid } = req.query;
    const query = userid ? { userid } : {};
    const itineraries = await Itinerary.find(query).sort({ createdAt: -1 });
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single itinerary by itineraryid
router.get('/:itineraryid', async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ itineraryid: req.params.itineraryid });
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete itinerary by itineraryid
router.delete('/:itineraryid', async (req, res) => {
  try {
    const deleted = await Itinerary.findOneAndDelete({ itineraryid: req.params.itineraryid });
    if (!deleted) return res.status(404).json({ message: 'Itinerary not found' });
    res.json({ message: 'Itinerary deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
