import { Response } from 'express';
import CommunityPost from '../models/CommunityPost';
import { AuthRequest } from '../middleware/authMiddleware';

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  const { question, domain, level } = req.body;
  try {
    const post = new CommunityPost({
      userId: req.user._id,
      question,
      domain,
      level,
    });
    const savedPost = await post.save();
    
    // Populate user info before returning
    await savedPost.populate('userId', 'name profileImage');
    
    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating post' });
  }
};

export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  const { sort = 'latest' } = req.query; // 'latest' or 'trending'
  
  try {
    let query = CommunityPost.find()
      .populate('userId', 'name profileImage')
      .populate('comments.userId', 'name profileImage');

    if (sort === 'trending') {
      // Sort by likes array length in descending order, then by date logic would typically require aggregation.
      // For simplicity, let's just sort by createdAt descending, and we'll handle sorting by likes explicitly:
      const posts = await query.exec();
      posts.sort((a, b) => b.likes.length - a.likes.length);
      res.json(posts);
      return;
    } else {
      // default: latest
      query = query.sort({ createdAt: -1 });
    }

    const posts = await query.exec();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

export const likePost = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const post = await CommunityPost.findById(id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const userId = req.user._id;
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      // like
      post.likes.push(userId);
    } else {
      // unlike
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error liking post' });
  }
};

export const commentPost = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const post = await CommunityPost.findById(id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const newComment = {
      userId: req.user._id,
      text
    };

    post.comments.push(newComment as any);
    await post.save();
    
    // Return populated post
    await post.populate('comments.userId', 'name profileImage');

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' });
  }
};
