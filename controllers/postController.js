const Post = require('../models/post');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');

const createPost = async (req, res) => {
    try {
        const { email, post, imageUrl } = req.body; // Get imageUrl from body now

        // Validate required fields
        if (!email || !post) {
            return res.status(400).json({ message: 'Email and post text are required.' });
        }

        // Check if user exists by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please use a registered email.' });
        }

        // Create new post
        const newPost = new Post({
            postid: uuidv4(),
            email,
            post,
            imageUrl: imageUrl || null // Store Cloudinary URL or null
        });

        await newPost.save();

        res.status(201).json({ message: 'Post created successfully.', post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get All Posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }); // Latest first
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = { createPost, getAllPosts };
