require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const connectDB = require('../config/db');

const seedTasks = [
  {
    title: 'Design UI Mockups',
    description: 'Create low and high-fidelity mockups for the new dashboard features.',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
    category: 'Design',
    tags: ['UI/UX', 'Figma'],
    imageUrl: 'https://picsum.photos/seed/design/400/300',
  },
  {
    title: 'Set up MERN Stack Base',
    description: 'Initialize client and server folders, set up basic Express routing and React Vite app.',
    status: 'completed',
    priority: 'high',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)), // yesterday
    category: 'Development',
    tags: ['MERN', 'Setup'],
    imageUrl: 'https://picsum.photos/seed/dev/400/300',
  },
  {
    title: 'Write Documentation',
    description: 'Draft the README file with clear instructions for AWS EC2 deployment.',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days from now
    category: 'Documentation',
    tags: ['Markdown', 'Deployment'],
    imageUrl: 'https://picsum.photos/seed/docs/400/300',
  },
  {
    title: 'Plan Sprint 2',
    description: 'Organize tasks and resources for the upcoming two-week sprint.',
    status: 'pending',
    priority: 'low',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 days from now
    category: 'Planning',
    tags: ['Agile', 'Scrum'],
    imageUrl: 'https://picsum.photos/seed/plan/400/300',
  }
];

const runSeed = async () => {
  try {
    await connectDB();
    
    console.log('Clearing existing data...');
    await Task.deleteMany({});
    
    console.log('Inserting seed data...');
    await Task.insertMany(seedTasks);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error with seeding data: ${error.message}`);
    process.exit(1);
  }
};

runSeed();
