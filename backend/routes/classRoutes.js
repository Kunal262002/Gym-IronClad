import express from 'express';
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  bookClass,
} from '../controllers/classController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getClasses);
router.post('/', protect, adminOnly, createClass);
router.put('/:id', protect, adminOnly, updateClass);
router.delete('/:id', protect, adminOnly, deleteClass);
router.post('/:id/book', protect, bookClass);

export default router;
