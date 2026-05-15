import Student from '../models/Student.js';
import Enrolment from '../models/Enrolment.js';
import Attendance from '../models/Attendance.js';

export const getStudents = async (req, res, next) => {
  try {
    const { search, department, semester, status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ firstName: regex }, { lastName: regex }, { studentId: regex }, { email: regex }];
    }
    if (department) filter.department = department;
    if (semester) filter.semester = Number(semester);
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [students, total] = await Promise.all([
      Student.find(filter)
        .populate('department', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Student.countDocuments(filter),
    ]);
    res.json({ success: true, data: students, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

export const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    await student.populate('department', 'name code');
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email or student ID already exists' });
    }
    next(err);
  }
};

export const getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('department', 'name code');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('department', 'name code');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status: 'suspended' },
      { new: true }
    );
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student suspended (soft-deleted)', data: student });
  } catch (err) {
    next(err);
  }
};

export const getStudentEnrolments = async (req, res, next) => {
  try {
    const enrolments = await Enrolment.find({ student: req.params.id })
      .populate('course', 'title code credits semester')
      .sort({ enrolledAt: -1 });
    res.json({ success: true, data: enrolments });
  } catch (err) {
    next(err);
  }
};

export const getStudentAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find({ student: req.params.id })
      .populate('course', 'title code');
    
    // Group by course and compute percentage
    const courseMap = {};
    records.forEach((rec) => {
      const key = rec.course._id.toString();
      if (!courseMap[key]) {
        courseMap[key] = { course: rec.course, present: 0, absent: 0, late: 0, total: 0 };
      }
      courseMap[key][rec.status]++;
      courseMap[key].total++;
    });
    const summary = Object.values(courseMap).map((c) => ({
      ...c,
      percentage: c.total > 0 ? (((c.present + c.late) / c.total) * 100).toFixed(1) : '0.0',
    }));
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
};
