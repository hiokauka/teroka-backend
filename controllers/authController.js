// controllers/authController.js
const User = require('../models/user');
const crypto = require('crypto'); // For token generation
const bcrypt = require('bcrypt');

// Send Forgot Password Email
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate token
        const token = crypto.randomBytes(20).toString('hex');
        const expiry = Date.now() + 3600000; // 1 hour expiry

        // Save token to user
        user.resetPasswordToken = token;
        user.resetPasswordExpires = expiry;
        await user.save();

        // Simulate sending email by logging the reset link
        const resetLink = `http://localhost:3000/reset-password/${token}`;
        console.log(`Reset Password Link: ${resetLink}`);

        res.status(200).json({ message: 'Password reset link sent. Check console.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Find user by token and ensure token is not expired
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Token still valid
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { forgotPassword, resetPassword };
