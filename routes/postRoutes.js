const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); // if you use multer for image upload
const { createPost, getAllPosts } = require('../controllers/postController');

// Create Post (with image upload)
router.post('/', upload.single('image'), createPost);

// Get All Posts
router.get('/', getAllPosts);

module.exports = router;
