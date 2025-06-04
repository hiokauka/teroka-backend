const mongoose = require('mongoose');

const carbonHistorySchema = new mongoose.Schema({
  carbonhistoryid: { type: String, required: true, unique: true },
  transportation: { type: String, required: true },
  distance: { type: Number, required: true }, // e.g. in km
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  accommodation: { type: String }, // e.g. hotel name/type
  night: { type: Number, default: 0 },
  date: { type: Date, required: true },
  email: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CarbonHistory', carbonHistorySchema);
