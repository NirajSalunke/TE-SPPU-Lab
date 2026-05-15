const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  guestName: { type: String, required: true, trim: true, maxlength: 60 },
  message:   { type: String, required: true, trim: true, maxlength: 1000 },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
