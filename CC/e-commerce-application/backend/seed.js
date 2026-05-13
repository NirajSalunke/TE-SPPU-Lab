require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('MONGO_URI is missing in environment variables');
  process.exit(1);
}

const seedProducts = [
  {
    name: 'Wireless Noise-Canceling Headphones',
    price: 299.99,
    description: 'Experience premium sound quality with industry-leading noise cancellation. Perfect for travel or focused work sessions.',
    imageUrl: 'https://picsum.photos/seed/headphones/400/300',
    stock: 50
  },
  {
    name: 'Smart Home Hub Display',
    price: 129.50,
    description: 'Control your smart home devices, watch videos, and get answers from voice assistant with this sleek 7-inch display.',
    imageUrl: 'https://picsum.photos/seed/smarthome/400/300',
    stock: 25
  },
  {
    name: 'Ergonomic Office Chair',
    price: 199.00,
    description: 'Comfortable mesh office chair with lumbar support and adjustable armrests. Designed for long working hours.',
    imageUrl: 'https://picsum.photos/seed/chair/400/300',
    stock: 15
  },
  {
    name: '4K Ultra HD Action Camera',
    price: 149.99,
    description: 'Waterproof action camera capable of recording in 4K at 60fps. Comes with mounting accessories.',
    imageUrl: 'https://picsum.photos/seed/camera/400/300',
    stock: 40
  },
  {
    name: 'Mechanical Gaming Keyboard',
    price: 89.99,
    description: 'RGB backlit mechanical keyboard with tactile switches for fast and satisfying typing or gaming.',
    imageUrl: 'https://picsum.photos/seed/keyboard/400/300',
    stock: 100
  },
  {
    name: 'Portable Power Bank 20000mAh',
    price: 49.99,
    description: 'High-capacity power bank with fast charging capabilities to keep your devices powered all day.',
    imageUrl: 'https://picsum.photos/seed/powerbank/400/300',
    stock: 200
  },
  {
    name: 'Wireless Charging Pad',
    price: 29.99,
    description: 'Qi-certified wireless charger compatible with all enabled smartphones and earbuds.',
    imageUrl: 'https://picsum.photos/seed/charger/400/300',
    stock: 75
  },
  {
    name: 'Bluetooth Portable Speaker',
    price: 59.99,
    description: 'Water-resistant portable speaker with 12 hours of battery life and deep bass.',
    imageUrl: 'https://picsum.photos/seed/speaker/400/300',
    stock: 60
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(seedProducts);
    console.log('Successfully seeded database with dummy products');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
