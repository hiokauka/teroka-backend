const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Favorite = require('../models/favourite');

router.post("/addtofav", async (req, res) => {

  const { place_name, place_address, place_type, place_rating, place_photo, email } = req.body;

  try {
    const favid = uuidv4();
    const favorite = new Favorite({ favid, place_name, place_address, place_type, place_rating, place_photo, email });
    const savedFavorite = await favorite.save();
    res.status(201).json(savedFavorite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  const { email } = req.query;
  try {
    const favs = await Favorite.find({ email });
    res.status(200).json(favs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:favid", async (req, res) => {
  const { favid } = req.params;

  if (!favid) {
    return res.status(400).json({ message: "Favorite ID is required to delete favorite" });
  }

  try {
    const deletedFavorite = await Favorite.findOneAndDelete({ favid });
    if (!deletedFavorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(200).json({ message: "Favorite deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
