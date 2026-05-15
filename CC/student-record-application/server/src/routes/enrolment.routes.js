import express from 'express';
import {
  enrolStudent,
  getAllEnrolments,
  assignGrade,
  dropEnrolment,
} from '../controllers/enrolment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/role.middleware.js';

const router = express.Router();
router.get('/', protect, getAllEnrolments);
router.post('/', protect, adminOnly, enrolStudent);
router.put('/:id/grade', protect, assignGrade);
router.put('/:id/drop', protect, adminOnly, dropEnrolment);
export default router;
