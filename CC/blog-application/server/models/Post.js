const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title:         { type: String, required: true, trim: true },
  slug:          { type: String, required: true, unique: true },
  excerpt:       { type: String, required: true },
  content:       { type: String, required: true },
  coverImageUrl: { type: String, default: '' },
  authorId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  tags:          [{ type: String, trim: true }],
  status:        { type: String, enum: ['draft', 'published'], default: 'draft' },
  featured:      { type: Boolean, default: false },
  views:         { type: Number, default: 0 },
  likes:         { type: Number, default: 0 },
  publishedAt:   { type: Date, default: null },
}, { timestamps: true });

postSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
