import express from 'express';
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  subscribeToPlan,
} from '../controllers/membershipController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPlans);
router.post('/', protect, adminOnly, createPlan);
router.put('/:id', protect, adminOnly, updatePlan);
router.delete('/:id', protect, adminOnly, deletePlan);
router.post('/:id/subscribe', protect, subscribeToPlan);

export default router;
