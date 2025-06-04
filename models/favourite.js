const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  favid: { type: String, required: true, unique: true },
  place_name: { type: String, required: true },
  place_address: { type: String },
  place_type: { type: String },
  place_rating: { type: Number },
  place_photo: { type: String },
  email: { type: String, required: true } 
}, { timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
