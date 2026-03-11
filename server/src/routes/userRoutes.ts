import express from 'express';
import { getUserProfile, getUserHistory, getUserStats, setSkillLevel } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.get('/history', protect, getUserHistory);
router.get('/stats', protect, getUserStats);
router.post('/set-skill-level', protect, setSkillLevel);

export default router;
