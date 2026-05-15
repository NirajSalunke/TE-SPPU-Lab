import User from '../src/models/User.js';
import Department from '../src/models/Department.js';

export const seedUsers = async () => {
  await User.deleteMany({});
  const depts = await Department.find();
  const deptMap = Object.fromEntries(depts.map((d) => [d.code, d._id]));

  const users = [
    {
      name: 'Admin User',
      email: 'admin@srms.edu',
      password: 'Admin@1234',
      role: 'admin',
      department: null,
    },
    {
      name: 'Prof. Arjun Mehta',
      email: 'arjun.mehta@srms.edu',
      password: 'Faculty@1234',
      role: 'faculty',
      department: deptMap['CS'],
    },
    {
      name: 'Prof. Kavitha Rao',
      email: 'kavitha.rao@srms.edu',
      password: 'Faculty@1234',
      role: 'faculty',
      department: deptMap['IT'],
    },
    {
      name: 'Prof. Ravi Shankar',
      email: 'ravi.shankar@srms.edu',
      password: 'Faculty@1234',
      role: 'faculty',
      department: deptMap['ECE'],
    },
    {
      name: 'Prof. Deepa Iyer',
      email: 'deepa.iyer@srms.edu',
      password: 'Faculty@1234',
      role: 'faculty',
      department: deptMap['ME'],
    },
  ];

  // Use insertMany won't trigger pre-save hook; create one by one for bcrypt
  const created = [];
  for (const u of users) {
    created.push(await User.create(u));
  }
  console.log(`✅ Users seeded: ${created.length} (1 admin + ${created.length - 1} faculty)`);
  return created;
};
