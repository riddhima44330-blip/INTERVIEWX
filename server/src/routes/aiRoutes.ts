import express from 'express';
import { generateQuestions, analyzeResponse, generateFeedback } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/generate-questions', protect, generateQuestions);
router.post('/analyze-response', protect, analyzeResponse);
router.post('/generate-feedback', protect, generateFeedback);

export default router;
