const Post = require('../models/Post');
const Category = require('../models/Category');
const slugify = require('slugify');

const populateOpts = [
  { path: 'authorId', select: 'name avatarUrl' },
  { path: 'categoryId', select: 'name slug' },
];

// GET /api/posts
const getPosts = async (req, res) => {
  const { category, tag, status, page = 1, limit = 9 } = req.query;
  const query = {};

  if (!req.user) query.status = 'published';
  else if (status) query.status = status;

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) query.categoryId = cat._id;
  }
  if (tag) query.tags = { $in: [tag] };

  const skip = (page - 1) * Number(limit);
  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .populate(populateOpts)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({ posts, total, page: Number(page), pages: Math.ceil(total / limit) });
};

// GET /api/posts/featured
const getFeaturedPosts = async (req, res) => {
  const posts = await Post.find({ status: 'published', featured: true })
    .populate(populateOpts)
    .sort({ publishedAt: -1 })
    .limit(5);
  res.json(posts);
};

// GET /api/posts/search?q=
const searchPosts = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const posts = await Post.find({
    status: 'published',
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { excerpt: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } },
    ],
  })
    .populate(populateOpts)
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
};

// GET /api/posts/:slug
const getPostBySlug = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate(populateOpts);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (post.status !== 'published' && !req.user)
    return res.status(404).json({ message: 'Post not found' });

  post.views += 1;
  await post.save();
  res.json(post);
};

// GET /api/posts/related/:slug
const getRelatedPosts = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  if (!post) return res.json([]);
  const related = await Post.find({
    status: 'published',
    _id: { $ne: post._id },
    $or: [{ categoryId: post.categoryId }, { tags: { $in: post.tags } }],
  })
    .populate(populateOpts)
    .limit(3);
  res.json(related);
};

// POST /api/posts
const createPost = async (req, res) => {
  const { title, excerpt, content, coverImageUrl, categoryId, tags, status, featured } = req.body;
  if (!title || !content || !excerpt)
    return res.status(400).json({ message: 'Title, excerpt, and content are required' });

  let slug = slugify(title, { lower: true, strict: true });
  if (await Post.findOne({ slug })) slug = `${slug}-${Date.now()}`;

  const post = await Post.create({
    title,
    slug,
    excerpt,
    content,
    coverImageUrl: coverImageUrl || `https://picsum.photos/seed/${slug}/800/450`,
    authorId: req.user._id,
    categoryId: categoryId || null,
    tags: tags || [],
    status: status || 'draft',
    featured: featured || false,
    publishedAt: status === 'published' ? new Date() : null,
  });

  await post.populate(populateOpts);
  res.status(201).json(post);
};

// PUT /api/posts/:id
const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const { title, excerpt, content, coverImageUrl, categoryId, tags, status, featured } = req.body;

  if (title && title !== post.title) {
    let slug = slugify(title, { lower: true, strict: true });
    if (await Post.findOne({ slug, _id: { $ne: post._id } })) slug = `${slug}-${Date.now()}`;
    post.title = title;
    post.slug = slug;
  }
  if (excerpt !== undefined) post.excerpt = excerpt;
  if (content !== undefined) post.content = content;
  if (coverImageUrl !== undefined) post.coverImageUrl = coverImageUrl;
  if (categoryId !== undefined) post.categoryId = categoryId || null;
  if (tags !== undefined) post.tags = tags;
  if (featured !== undefined) post.featured = featured;
  if (status !== undefined && status !== post.status) {
    post.status = status;
    if (status === 'published' && !post.publishedAt) post.publishedAt = new Date();
  }

  const updated = await post.save();
  await updated.populate(populateOpts);
  res.json(updated);
};

// DELETE /api/posts/:id
const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  await post.deleteOne();
  res.json({ message: 'Post deleted' });
};

// PATCH /api/posts/:id/like
const likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  post.likes += 1;
  await post.save();
  res.json({ likes: post.likes });
};

module.exports = { getPosts, getFeaturedPosts, searchPosts, getPostBySlug, getRelatedPosts, createPost, updatePost, deletePost, likePost };
