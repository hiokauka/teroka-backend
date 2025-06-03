const express = require('express');
const router = express.Router();
const CarbonHistory = require('../models/carbonHistory');
const { v4: uuidv4 } = require('uuid');

// Create new carbon history entry
router.post('/', async (req, res) => {
  try {
    const { transportation, distance, origin, destination, accommodation, night, date, userid } = req.body;
    const carbonhistoryid = uuidv4();

    const carbonEntry = new CarbonHistory({
      carbonhistoryid,
      transportation,
      distance,
      origin,
      destination,
      accommodation,
      night,
      date,
      userid
    });

    const savedEntry = await carbonEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all carbon history entries (optionally filter by userid)
router.get('/', async (req, res) => {
  try {
    const { userid } = req.query;
    const query = userid ? { userid } : {};
    const entries = await CarbonHistory.find(query).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single carbon history by carbonhistoryid
router.get('/:carbonhistoryid', async (req, res) => {
  try {
    const entry = await CarbonHistory.findOne({ carbonhistoryid: req.params.carbonhistoryid });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete carbon history by carbonhistoryid
router.delete('/:carbonhistoryid', async (req, res) => {
  try {
    const deleted = await CarbonHistory.findOneAndDelete({ carbonhistoryid: req.params.carbonhistoryid });
    if (!deleted) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
