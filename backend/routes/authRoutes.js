import express from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword, getMe, getUsers } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.get('/users', protect, adminOnly, getUsers);

export default router;
