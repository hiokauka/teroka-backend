const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  favid: { type: String, required: true, unique: true }, // unique ID for favorite
  place_name: { type: String, required: true },
  place_address: { type: String },
  place_type: { type: String },
  place_rating: { type: Number },
  place_photo: { type: String }, // URL or photo reference
  userid: { type: String, required: true, ref: 'User' } // foreign key referencing User's userid
}, { timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
