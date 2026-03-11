import express from 'express';
import { getQuestions } from '../controllers/questionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/domain/:domain/level/:level', protect, getQuestions);

export default router;
