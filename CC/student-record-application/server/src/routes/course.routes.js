import express from 'express';
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStudents,
} from '../controllers/course.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/role.middleware.js';

const router = express.Router();
router.get('/', protect, getCourses);
router.post('/', protect, adminOnly, createCourse);
router.put('/:id', protect, adminOnly, updateCourse);
router.delete('/:id', protect, adminOnly, deleteCourse);
router.get('/:id/students', protect, getCourseStudents);
export default router;
