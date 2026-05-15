import express from 'express';
import {
  markAttendance,
  getAttendance,
  updateAttendance,
} from '../controllers/attendance.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/', protect, markAttendance);
router.get('/', protect, getAttendance);
router.put('/:id', protect, updateAttendance);
export default router;
