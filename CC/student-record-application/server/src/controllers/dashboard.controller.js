import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Department from '../models/Department.js';
import Enrolment from '../models/Enrolment.js';
import Attendance from '../models/Attendance.js';

export const getStats = async (req, res, next) => {
  try {
    const [totalStudents, totalCourses, totalDepartments, activeEnrolments] = await Promise.all([
      Student.countDocuments({ status: 'active' }),
      Course.countDocuments(),
      Department.countDocuments(),
      Enrolment.countDocuments({ status: 'active' }),
    ]);
    res.json({ success: true, data: { totalStudents, totalCourses, totalDepartments, activeEnrolments } });
  } catch (err) {
    next(err);
  }
};

export const getEnrolmentsByDept = async (req, res, next) => {
  try {
    const data = await Enrolment.aggregate([
      { $match: { status: 'active' } },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentData',
        },
      },
      { $unwind: '$studentData' },
      {
        $lookup: {
          from: 'departments',
          localField: 'studentData.department',
          foreignField: '_id',
          as: 'deptData',
        },
      },
      { $unwind: '$deptData' },
      { $group: { _id: '$deptData._id', name: { $first: '$deptData.name' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getGradeDistribution = async (req, res, next) => {
  try {
    const data = await Enrolment.aggregate([
      { $match: { grade: { $ne: null } } },
      { $group: { _id: '$grade', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json({ success: true, data: data.map((d) => ({ grade: d._id, count: d.count })) });
  } catch (err) {
    next(err);
  }
};

export const getAttendanceRate = async (req, res, next) => {
  try {
    const data = await Attendance.aggregate([
      {
        $group: {
          _id: '$course',
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0] } },
        },
      },
      {
        $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' },
      },
      { $unwind: '$course' },
      {
        $project: {
          courseName: '$course.title',
          courseCode: '$course.code',
          rate: { $multiply: [{ $divide: ['$present', '$total'] }, 100] },
        },
      },
      { $sort: { rate: -1 } },
      { $limit: 10 },
    ]);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getRecentStudents = async (req, res, next) => {
  try {
    const students = await Student.find()
      .populate('department', 'name code')
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({ success: true, data: students });
  } catch (err) {
    next(err);
  }
};
