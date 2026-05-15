import Course from '../src/models/Course.js';
import Department from '../src/models/Department.js';
import User from '../src/models/User.js';

export const seedCourses = async () => {
  await Course.deleteMany({});
  const depts = await Department.find();
  const users = await User.find({ role: 'faculty' });
  const deptMap = Object.fromEntries(depts.map((d) => [d.code, d._id]));
  const facultyMap = Object.fromEntries(users.map((u) => [u.email.split('.')[0], u._id]));

  const arjun = users.find((u) => u.email.includes('arjun'))?._id;
  const kavitha = users.find((u) => u.email.includes('kavitha'))?._id;
  const ravi = users.find((u) => u.email.includes('ravi'))?._id;
  const deepa = users.find((u) => u.email.includes('deepa'))?._id;

  const courses = [
    // CS
    { title: 'Data Structures & Algorithms', code: 'CS101', department: deptMap['CS'], faculty: arjun, credits: 4, semester: 2, description: 'Arrays, linked lists, trees, graphs, and sorting.' },
    { title: 'Operating Systems', code: 'CS201', department: deptMap['CS'], faculty: arjun, credits: 4, semester: 4, description: 'Process management, memory, file systems.' },
    { title: 'Machine Learning', code: 'CS301', department: deptMap['CS'], faculty: arjun, credits: 3, semester: 6, description: 'Supervised, unsupervised learning and neural networks.' },
    { title: 'Database Management Systems', code: 'CS401', department: deptMap['CS'], faculty: arjun, credits: 4, semester: 3, description: 'SQL, NoSQL, normalization, transactions.' },
    // IT
    { title: 'Computer Networks', code: 'IT101', department: deptMap['IT'], faculty: kavitha, credits: 4, semester: 3, description: 'TCP/IP, OSI model, routing protocols.' },
    { title: 'Web Technologies', code: 'IT201', department: deptMap['IT'], faculty: kavitha, credits: 3, semester: 4, description: 'HTML, CSS, JavaScript, REST APIs.' },
    { title: 'Cloud Computing', code: 'IT301', department: deptMap['IT'], faculty: kavitha, credits: 3, semester: 6, description: 'AWS, Azure, Docker, Kubernetes.' },
    // ECE
    { title: 'Digital Electronics', code: 'ECE101', department: deptMap['ECE'], faculty: ravi, credits: 4, semester: 2, description: 'Logic gates, flip-flops, counters.' },
    { title: 'Microprocessors & Microcontrollers', code: 'ECE201', department: deptMap['ECE'], faculty: ravi, credits: 4, semester: 4, description: '8086, ARM, Arduino programming.' },
    { title: 'Signal & Systems', code: 'ECE301', department: deptMap['ECE'], faculty: ravi, credits: 3, semester: 3, description: 'Fourier transforms, Laplace, z-transform.' },
    // ME
    { title: 'Engineering Mechanics', code: 'ME101', department: deptMap['ME'], faculty: deepa, credits: 4, semester: 1, description: 'Statics, dynamics, and kinematics.' },
    { title: 'Thermodynamics', code: 'ME201', department: deptMap['ME'], faculty: deepa, credits: 4, semester: 3, description: 'Laws of thermodynamics, heat engines.' },
    { title: 'Manufacturing Processes', code: 'ME301', department: deptMap['ME'], faculty: deepa, credits: 3, semester: 5, description: 'Casting, welding, machining.' },
    // CE
    { title: 'Structural Analysis', code: 'CE101', department: deptMap['CE'], faculty: null, credits: 4, semester: 4, description: 'Beams, frames, trusses analysis.' },
    { title: 'Surveying & Geomatics', code: 'CE201', department: deptMap['CE'], faculty: null, credits: 3, semester: 3, description: 'Leveling, traversing, GPS.' },
  ];

  const created = await Course.insertMany(courses);
  console.log(`✅ Courses seeded: ${created.length}`);
  return created;
};
