import express from 'express';
import {
  getStats,
  getEnrolmentsByDept,
  getGradeDistribution,
  getAttendanceRate,
  getRecentStudents,
} from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.get('/stats', protect, getStats);
router.get('/enrolments-by-dept', protect, getEnrolmentsByDept);
router.get('/grade-distribution', protect, getGradeDistribution);
router.get('/attendance-rate', protect, getAttendanceRate);
router.get('/recent-students', protect, getRecentStudents);
export default router;
