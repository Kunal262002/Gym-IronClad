import express from 'express';
import { submitContactForm, getContactMessages } from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContactForm);
router.get('/', protect, adminOnly, getContactMessages);

export default router;
