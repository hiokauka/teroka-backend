const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tags: [String],
  carbon: { type: Number, required: true } // 👉 Add this line
});

const DaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  date: { type: Date },
  places: [PlaceSchema]
});

const ItinerarySchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true }, // unique to each user
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: [DaySchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Itinerary', ItinerarySchema);
