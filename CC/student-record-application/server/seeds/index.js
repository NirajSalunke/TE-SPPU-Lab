import 'dotenv/config';
import mongoose from 'mongoose';
import { seedDepartments } from './departments.seed.js';
import { seedUsers } from './users.seed.js';
import { seedCourses } from './courses.seed.js';
import { seedStudents } from './students.seed.js';
import { seedEnrolments } from './enrolments.seed.js';
import { seedAttendance } from './attendance.seed.js';

const isFresh = process.argv.includes('--fresh');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB Atlas');

  if (isFresh) {
    console.log('🗑️  Dropping all collections...');
    const collections = Object.keys(mongoose.connection.collections);
    for (const name of collections) {
      await mongoose.connection.collections[name].drop().catch(() => {});
    }
    console.log('✅ Collections dropped');
  }

  console.log('\n🌱 Starting seed...');
  await seedDepartments();
  await seedUsers();
  await seedCourses();
  await seedStudents();
  await seedEnrolments();
  await seedAttendance();
  console.log('\n🎉 Seed complete! Default admin: admin@srms.edu / Admin@1234\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
