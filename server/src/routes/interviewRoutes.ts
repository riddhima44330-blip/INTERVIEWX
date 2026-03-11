import express from 'express';
import { startInterview, answerQuestion, finishInterview } from '../controllers/interviewController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/start', protect, startInterview);
router.post('/answer', protect, answerQuestion);
router.post('/finish', protect, finishInterview);

export default router;
