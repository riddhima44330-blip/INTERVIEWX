import express from 'express';
import { createPost, getPosts, likePost, commentPost } from '../controllers/communityController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createPost);
router.get('/', protect, getPosts);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentPost);

export default router;
