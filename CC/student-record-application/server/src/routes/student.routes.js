import express from 'express';
import {
  getStudents,
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  getStudentEnrolments,
  getStudentAttendance,
} from '../controllers/student.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/role.middleware.js';

const router = express.Router();
router.get('/', protect, getStudents);
router.post('/', protect, adminOnly, createStudent);
router.get('/:id', protect, getStudent);
router.put('/:id', protect, adminOnly, updateStudent);
router.delete('/:id', protect, adminOnly, deleteStudent);
router.get('/:id/enrolments', protect, getStudentEnrolments);
router.get('/:id/attendance', protect, getStudentAttendance);
export default router;
