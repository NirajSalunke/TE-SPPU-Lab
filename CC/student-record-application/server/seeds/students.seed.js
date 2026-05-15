import Student from '../src/models/Student.js';
import Department from '../src/models/Department.js';

const firstNames = ['Aarav','Aditya','Akash','Ananya','Arjun','Deepika','Divya','Gaurav','Ishaan','Kiran','Lakshmi','Manish','Meera','Mohan','Neeraj','Neha','Nikhil','Pallavi','Pooja','Priya','Rahul','Raj','Riya','Rohan','Sakshi','Sanjay','Sara','Shreya','Siddharth','Sneha','Suresh','Tanvi','Uma','Varun','Vijay','Vinay','Vishal','Yash','Zara','Amit'];
const lastNames = ['Ahuja','Banerjee','Chaudhary','Chopra','Das','Desai','Dube','Gandhi','Ghosh','Gupta','Iyer','Jain','Joshi','Kapoor','Khan','Kumar','Malhotra','Mehta','Mishra','Nair','Patel','Pillai','Rai','Reddy','Roy','Sharma','Singh','Sinha','Srivastava','Tiwari','Verma','Yadav','Bose','Shah','Saxena','Pandey','Menon','Krishnan','Mukherjee','Choudhary'];
const bloodGroups = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];
const genders = ['male','female','male','female','male','female','other'];
const statuses = ['active','active','active','active','active','active','alumni','suspended'];

export const seedStudents = async () => {
  await Student.deleteMany({});
  const depts = await Department.find();
  const year = new Date().getFullYear();

  const students = [];
  for (let i = 0; i < 40; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const dept = depts[i % depts.length];
    const sem = (i % 8) + 1;
    const gender = genders[i % genders.length];
    const dob = new Date(2000 + (i % 5), (i * 3) % 12, (i % 28) + 1);
    students.push({
      studentId: `STU-${year}-${String(i + 1).padStart(4, '0')}`,
      firstName: fn,
      lastName: ln,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@student.srms.edu`,
      phone: `98${String(Math.floor(10000000 + i * 333333)).slice(0, 8)}`,
      dob,
      gender,
      department: dept._id,
      semester: sem,
      avatarSeed: `${fn} ${ln}`,
      address: `${i + 1}, Example Street, City, India`,
      bloodGroup: bloodGroups[i % bloodGroups.length],
      guardianName: `${lastNames[(i + 5) % lastNames.length]} ${fn}`,
      guardianPhone: `97${String(Math.floor(10000000 + i * 222222)).slice(0, 8)}`,
      status: statuses[i % statuses.length],
      enrolledAt: new Date(year - (sem > 4 ? 2 : 1), 6, 1),
    });
  }

  const created = await Student.insertMany(students);
  console.log(`✅ Students seeded: ${created.length}`);
  return created;
};
