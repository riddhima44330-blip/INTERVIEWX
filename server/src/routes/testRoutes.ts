import express from 'express';
import { startPlacementTest, submitPlacementTest } from '../controllers/placementController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/start', protect, startPlacementTest);
router.post('/submit', protect, submitPlacementTest);

export default router;
