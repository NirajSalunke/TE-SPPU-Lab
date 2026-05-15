import Enrolment from '../src/models/Enrolment.js';
import Student from '../src/models/Student.js';
import Course from '../src/models/Course.js';

const GRADES = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F', null, null];
const GRADE_POINTS = { 'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C': 6, 'D': 5, 'F': 0 };
const ACADEMIC_YEAR = '2024-25';

export const seedEnrolments = async () => {
  await Enrolment.deleteMany({});
  const students = await Student.find();
  const courses = await Course.find();

  const enrolments = [];
  const seen = new Set();

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    // Enrol each student in 3 courses that match or are close to their semester
    const eligible = courses.filter(
      (c) => c.department.toString() === student.department.toString() || Math.abs(c.semester - student.semester) <= 1
    ).slice(0, 4);

    for (let j = 0; j < eligible.length; j++) {
      const course = eligible[j];
      const key = `${student._id}-${course._id}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const gradeRaw = GRADES[(i + j) % GRADES.length];
      enrolments.push({
        student: student._id,
        course: course._id,
        semester: student.semester,
        academicYear: ACADEMIC_YEAR,
        grade: gradeRaw,
        gradePoints: gradeRaw ? GRADE_POINTS[gradeRaw] : null,
        status: gradeRaw ? 'completed' : 'active',
        enrolledAt: student.enrolledAt,
      });
    }
  }

  const created = await Enrolment.insertMany(enrolments);
  console.log(`✅ Enrolments seeded: ${created.length}`);
  return created;
};
