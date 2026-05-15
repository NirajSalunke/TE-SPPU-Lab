import Course from '../models/Course.js';
import Enrolment from '../models/Enrolment.js';

export const getCourses = async (req, res, next) => {
  try {
    const { department, semester } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = Number(semester);
    const courses = await Course.find(filter)
      .populate('department', 'name code')
      .populate('faculty', 'name email')
      .sort({ title: 1 });
    res.json({ success: true, data: courses });
  } catch (err) {
    next(err);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const existing = await Course.findOne({ code: req.body.code?.toUpperCase() });
    if (existing) return res.status(409).json({ success: false, message: 'Course code already exists' });
    const course = await Course.create(req.body);
    await course.populate('department', 'name code');
    await course.populate('faculty', 'name email');
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('department', 'name code')
      .populate('faculty', 'name email');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) {
    next(err);
  }
};

export const getCourseStudents = async (req, res, next) => {
  try {
    const enrolments = await Enrolment.find({ course: req.params.id, status: 'active' })
      .populate({ path: 'student', populate: { path: 'department', select: 'name code' } });
    res.json({ success: true, data: enrolments });
  } catch (err) {
    next(err);
  }
};
