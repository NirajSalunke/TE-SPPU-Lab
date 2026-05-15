import Department from '../src/models/Department.js';

const departments = [
  { name: 'Computer Science', code: 'CS', hodName: 'Dr. Rajesh Kumar', description: 'Covers algorithms, software engineering, and AI.' },
  { name: 'Information Technology', code: 'IT', hodName: 'Dr. Priya Sharma', description: 'Focuses on networking, databases, and systems.' },
  { name: 'Electronics & Communication', code: 'ECE', hodName: 'Dr. Anita Patel', description: 'Signal processing, VLSI, and embedded systems.' },
  { name: 'Mechanical Engineering', code: 'ME', hodName: 'Dr. Suresh Reddy', description: 'Thermodynamics, manufacturing, and design.' },
  { name: 'Civil Engineering', code: 'CE', hodName: 'Dr. Meera Nair', description: 'Structural design, construction, and surveying.' },
];

export const seedDepartments = async () => {
  await Department.deleteMany({});
  const created = await Department.insertMany(departments);
  console.log(`✅ Departments seeded: ${created.length}`);
  return created;
};
