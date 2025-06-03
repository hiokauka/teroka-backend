const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  itineraryid: { type: String, required: true, unique: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  userid: { type: String, required: true, ref: 'User' }
});

module.exports = mongoose.model('Itinerary', itinerarySchema);
