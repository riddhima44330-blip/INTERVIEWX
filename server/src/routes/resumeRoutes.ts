import express from 'express';
import multer from 'multer';
import { uploadResume, analyzeResume } from '../controllers/resumeController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Memory storage to process without writing to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.post('/analyze', protect, analyzeResume);

export default router;
