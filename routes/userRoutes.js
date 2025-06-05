const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const User = require('../models/user.js');
const Favorite = require('../models/favourite');
const Itinerary = require('../models/itinerary');
const carbonHistory = require("../models/carbonHistory");





// Register route
router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // 1. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // 2. Generate user ID
    const userid = uuidv4();

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create and save new user
    const newUser = new User({
      userid,
      name,
      email,
      phone,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // 3. Respond with success and optional user info
    res.status(200).json({
      message: "Login successful!",
      userid: user.userid,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user data by email (for profile)
router.get("/profile", async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ message: "Email query parameter is required" });
  }

  try {
    const user = await User.findOne({ email }).select("-password -_id -__v"); // exclude sensitive fields
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/profile", async (req, res) => {
  const originalEmail = req.query.email;   // old email (from query)
  const { email, name, phone } = req.body; // new data (from body)

  if (!originalEmail) {
    return res.status(400).json({ message: "Original email (query parameter) is required" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: originalEmail },          // find user by original email
      { name, phone, email },            // update with new info including new email
      { new: true, runValidators: true }
    ).select("-password -_id -__v");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/profile", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required to delete account" });
  }

  try {
    // Delete the user
    const deletedUser = await User.findOneAndDelete({ email });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all related data
    await Promise.all([
      Favorite.deleteMany({ email }),
      Itinerary.deleteMany({ userEmail: email }),
      carbonHistory.deleteMany({ email }),

    ]);

    res.status(200).json({ message: "Account and related data deleted successfully." });
  } catch (err) {
    console.error("Error deleting user and related data:", err);
    res.status(500).json({ message: "Failed to delete account and related data." });
  }
});



// Update password route
router.put("/update-password", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "Email, oldPassword, and newPassword are required." });
  }

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 2. Check if oldPassword matches hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    // 3. Hash newPassword
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
