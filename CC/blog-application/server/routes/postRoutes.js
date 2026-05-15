const express = require('express');
const router = express.Router();
const {
  getPosts, getFeaturedPosts, searchPosts,
  getPostBySlug, getRelatedPosts,
  createPost, updatePost, deletePost, likePost,
} = require('../controllers/postController');
const { protect, adminOnly } = require('../middleware/auth');

// Optional auth middleware - attaches user if token present but doesn't block
const optionalAuth = async (req, res, next) => {
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-passwordHash');
    } catch { /* ignore */ }
  }
  next();
};

router.get('/featured', getFeaturedPosts);
router.get('/search', searchPosts);
router.get('/related/:slug', getRelatedPosts);
router.get('/', optionalAuth, getPosts);
router.get('/:slug', optionalAuth, getPostBySlug);

router.post('/', protect, adminOnly, createPost);
router.put('/:id', protect, adminOnly, updatePost);
router.delete('/:id', protect, adminOnly, deletePost);
router.patch('/:id/like', likePost);

module.exports = router;
