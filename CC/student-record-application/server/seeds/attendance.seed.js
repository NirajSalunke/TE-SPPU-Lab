import Attendance from '../src/models/Attendance.js';
import Enrolment from '../src/models/Enrolment.js';
import User from '../src/models/User.js';

const STATUSES = ['present', 'present', 'present', 'present', 'absent', 'late'];

export const seedAttendance = async () => {
  await Attendance.deleteMany({});
  const enrolments = await Enrolment.find().limit(80);
  const admin = await User.findOne({ role: 'admin' });

  const records = [];
  const seen = new Set();
  const today = new Date();

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(today);
    date.setDate(today.getDate() - dayOffset);
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    date.setHours(0, 0, 0, 0);

    for (let i = 0; i < enrolments.length; i++) {
      const e = enrolments[i];
      const key = `${e.student}-${e.course}-${date.toISOString().slice(0, 10)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      records.push({
        student: e.student,
        course: e.course,
        date,
        status: STATUSES[(i + dayOffset) % STATUSES.length],
        markedBy: admin._id,
        remarks: '',
      });
    }
  }

  const created = await Attendance.insertMany(records);
  console.log(`✅ Attendance seeded: ${created.length} records (30 days)`);
  return created;
};
