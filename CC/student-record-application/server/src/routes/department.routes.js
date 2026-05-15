import express from 'express';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/department.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/role.middleware.js';

const router = express.Router();
router.get('/', protect, getDepartments);
router.post('/', protect, adminOnly, createDepartment);
router.put('/:id', protect, adminOnly, updateDepartment);
router.delete('/:id', protect, adminOnly, deleteDepartment);
export default router;
