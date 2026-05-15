import Department from '../models/Department.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';

export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    // Attach counts
    const result = await Promise.all(
      departments.map(async (dept) => {
        const studentCount = await Student.countDocuments({ department: dept._id });
        const courseCount = await Course.countDocuments({ department: dept._id });
        return { ...dept.toJSON(), studentCount, courseCount };
      })
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const createDepartment = async (req, res, next) => {
  try {
    const { name, code, hodName, description } = req.body;
    const existing = await Department.findOne({ code: code?.toUpperCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Department code already exists' });
    }
    const dept = await Department.create({ name, code, hodName, description });
    res.status(201).json({ success: true, data: dept });
  } catch (err) {
    next(err);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    res.json({ success: true, data: dept });
  } catch (err) {
    next(err);
  }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    res.json({ success: true, message: 'Department deleted' });
  } catch (err) {
    next(err);
  }
};
