import express from 'express';
import {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} from '../controllers/trainerController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { trainerImageUpload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getTrainers);
router.get('/:id', getTrainerById);
router.post('/', protect, adminOnly, trainerImageUpload.single('photo'), createTrainer);
router.put('/:id', protect, adminOnly, trainerImageUpload.single('photo'), updateTrainer);
router.delete('/:id', protect, adminOnly, deleteTrainer);

export default router;
