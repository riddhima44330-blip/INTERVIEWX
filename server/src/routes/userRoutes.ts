import express from 'express';
import { getUserProfile, getUserHistory, getUserStats } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.get('/history', protect, getUserHistory);
router.get('/stats', protect, getUserStats);

export default router;
