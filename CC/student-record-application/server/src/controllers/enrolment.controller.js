import Enrolment from '../models/Enrolment.js';

export const enrolStudent = async (req, res, next) => {
  try {
    const { student, course, semester, academicYear } = req.body;
    const existing = await Enrolment.findOne({ student, course });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Student already enrolled in this course' });
    }
    const enrolment = await Enrolment.create({ student, course, semester, academicYear });
    await enrolment.populate('student', 'firstName lastName studentId avatarSeed');
    await enrolment.populate('course', 'title code credits');
    res.status(201).json({ success: true, data: enrolment });
  } catch (err) {
    next(err);
  }
};

export const getAllEnrolments = async (req, res, next) => {
  try {
    const { student, course, status } = req.query;
    const filter = {};
    if (student) filter.student = student;
    if (course) filter.course = course;
    if (status) filter.status = status;
    const enrolments = await Enrolment.find(filter)
      .populate('student', 'firstName lastName studentId avatarSeed')
      .populate({ path: 'course', populate: { path: 'department', select: 'name code' } })
      .sort({ enrolledAt: -1 });
    res.json({ success: true, data: enrolments });
  } catch (err) {
    next(err);
  }
};

export const assignGrade = async (req, res, next) => {
  try {
    const { grade, gradePoints } = req.body;
    const enrolment = await Enrolment.findByIdAndUpdate(
      req.params.id,
      { grade, gradePoints, status: 'completed' },
      { new: true, runValidators: true }
    )
      .populate('student', 'firstName lastName studentId')
      .populate('course', 'title code');
    if (!enrolment) return res.status(404).json({ success: false, message: 'Enrolment not found' });
    res.json({ success: true, data: enrolment });
  } catch (err) {
    next(err);
  }
};

export const dropEnrolment = async (req, res, next) => {
  try {
    const enrolment = await Enrolment.findByIdAndUpdate(
      req.params.id,
      { status: 'dropped' },
      { new: true }
    );
    if (!enrolment) return res.status(404).json({ success: false, message: 'Enrolment not found' });
    res.json({ success: true, data: enrolment });
  } catch (err) {
    next(err);
  }
};
