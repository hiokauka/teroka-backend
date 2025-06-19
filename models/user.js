const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },       // 🔑 For storing reset token
  resetPasswordExpires: { type: Date }        // ⏰ Token expiry time
});

module.exports = mongoose.model("User", userSchema);
