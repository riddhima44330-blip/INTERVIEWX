import { Router } from 'express';
import { startInterview, answerQuestion, finishInterview } from '../controllers/interviewController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.post('/start', startInterview);
router.post('/answer', answerQuestion);
router.post('/finish', finishInterview);

export default router;
