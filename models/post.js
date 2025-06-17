// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postid: { type: String, required: true, unique: true },
  email: { type: String, required: true }, // Same structure as your favorites
  post: { type: String, required: true },
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
