const Category = require('../models/Category');
const slugify = require('slugify');

const getCategories = async (req, res) => {
  const cats = await Category.find().sort({ name: 1 });
  res.json(cats);
};

const createCategory = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  const slug = slugify(name, { lower: true, strict: true });
  const existing = await Category.findOne({ slug });
  if (existing) return res.status(400).json({ message: 'Category already exists' });

  const cat = await Category.create({ name, slug, description: description || '' });
  res.status(201).json(cat);
};

const updateCategory = async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });

  const { name, description } = req.body;
  if (name) {
    cat.name = name;
    cat.slug = slugify(name, { lower: true, strict: true });
  }
  if (description !== undefined) cat.description = description;

  const updated = await cat.save();
  res.json(updated);
};

const deleteCategory = async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  await cat.deleteOne();
  res.json({ message: 'Category deleted' });
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
