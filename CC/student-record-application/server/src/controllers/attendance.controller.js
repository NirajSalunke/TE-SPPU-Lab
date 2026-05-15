import Attendance from '../models/Attendance.js';

export const markAttendance = async (req, res, next) => {
  try {
    // Expects: { records: [{ student, course, date, status, remarks }] }
    const { records } = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'records array is required' });
    }
    const ops = records.map((rec) => ({
      updateOne: {
        filter: { student: rec.student, course: rec.course, date: new Date(rec.date) },
        update: { $set: { status: rec.status, markedBy: req.user._id, remarks: rec.remarks || '' } },
        upsert: true,
      },
    }));
    await Attendance.bulkWrite(ops);
    res.status(200).json({ success: true, message: `${records.length} attendance records saved` });
  } catch (err) {
    next(err);
  }
};

export const getAttendance = async (req, res, next) => {
  try {
    const { course, startDate, endDate, student } = req.query;
    const filter = {};
    if (course) filter.course = course;
    if (student) filter.student = student;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const records = await Attendance.find(filter)
      .populate('student', 'firstName lastName studentId avatarSeed')
      .populate('course', 'title code')
      .populate('markedBy', 'name')
      .sort({ date: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
};

export const updateAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found' });
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};
