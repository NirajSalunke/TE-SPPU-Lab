require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set. Copy .env.template to .env and fill in your credentials.');
  process.exit(1);
}

const sampleEvents = [
  {
    name: 'TechSpark 2026 — Annual Developer Conference',
    description:
      'Join 500+ developers for a day of talks, workshops, and networking covering AI, Cloud, and DevOps. Industry leaders share insights on the future of software engineering.',
    date: new Date('2026-07-15T09:00:00.000Z'),
    location: 'Bombay Exhibition Centre, Mumbai, India',
    maxCapacity: 500,
    imageUrl: 'https://picsum.photos/seed/techspark/800/450',
    registrationCount: 0,
  },
  {
    name: 'UX Design Summit 2026',
    description:
      'An immersive summit exploring the latest trends in user experience, product design, and accessibility. Hands-on workshops with leading design professionals.',
    date: new Date('2026-08-02T10:00:00.000Z'),
    location: 'The Lalit Hotel, Bengaluru, India',
    maxCapacity: 200,
    imageUrl: 'https://picsum.photos/seed/uxdesign/800/450',
    registrationCount: 0,
  },
  {
    name: 'Cloud & DevOps Bootcamp',
    description:
      'A two-day intensive bootcamp covering AWS, Docker, Kubernetes, and CI/CD pipelines. Perfect for engineers looking to level up their cloud skills with hands-on labs.',
    date: new Date('2026-09-10T08:30:00.000Z'),
    location: 'Hyderabad International Convention Centre, Hyderabad',
    maxCapacity: 150,
    imageUrl: 'https://picsum.photos/seed/devops/800/450',
    registrationCount: 0,
  },
  {
    name: 'Startup Founders Meetup — Pune Chapter',
    description:
      'A vibrant networking evening for startup founders, investors, and aspiring entrepreneurs. Pitch sessions, panel discussions, and open networking with the Pune startup ecosystem.',
    date: new Date('2026-06-25T18:00:00.000Z'),
    location: 'WeWork Magarpatta, Pune, India',
    maxCapacity: 100,
    imageUrl: 'https://picsum.photos/seed/startup/800/450',
    registrationCount: 0,
  },
  {
    name: 'AI & Machine Learning Workshop',
    description:
      'Hands-on workshop covering machine learning fundamentals, neural networks, and real-world AI applications. Bring your laptop and leave with working ML models you built yourself.',
    date: new Date('2026-10-05T09:00:00.000Z'),
    location: 'IIT Bombay, Mumbai, India',
    maxCapacity: 80,
    imageUrl: 'https://picsum.photos/seed/aiml/800/450',
    registrationCount: 0,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    await Event.deleteMany({});
    console.log('🗑️  Cleared existing events');

    const created = await Event.insertMany(sampleEvents);
    console.log(`🌱 Seeded ${created.length} events:`);
    created.forEach((e) => console.log(`   - ${e.name}`));

    console.log('\n✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
