const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Favorite = require('../models/favourite');

router.post("/", async (req, res) => {
  const { place_name, place_address, place_type, place_rating, place_photo, userid } = req.body;

  try {
    const favid = uuidv4();
    const favorite = new Favorite({ favid, place_name, place_address, place_type, place_rating, place_photo, userid });
    const savedFavorite = await favorite.save();
    res.status(201).json(savedFavorite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
