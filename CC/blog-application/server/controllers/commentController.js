const Comment = require('../models/Comment');

// GET /api/posts/:id/comments
const getComments = async (req, res) => {
  const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: -1 });
  res.json(comments);
};

// POST /api/posts/:id/comments
const addComment = async (req, res) => {
  const { guestName, message } = req.body;
  if (!guestName || !message)
    return res.status(400).json({ message: 'Name and message are required' });

  const comment = await Comment.create({
    postId: req.params.id,
    guestName: guestName.trim().slice(0, 60),
    message: message.trim().slice(0, 1000),
  });
  res.status(201).json(comment);
};

// DELETE /api/comments/:id  (admin only)
const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  await comment.deleteOne();
  res.json({ message: 'Comment deleted' });
};

module.exports = { getComments, addComment, deleteComment };
