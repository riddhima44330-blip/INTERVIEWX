import { Router } from 'express';
import { startTest, submitTest } from '../controllers/testController';

const router = Router();

router.post('/start', startTest);
router.post('/submit', submitTest);

export default router;
