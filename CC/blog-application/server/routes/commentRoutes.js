const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/post/:id', getComments);
router.post('/post/:id', addComment);
router.delete('/:id', protect, adminOnly, deleteComment);

module.exports = router;
