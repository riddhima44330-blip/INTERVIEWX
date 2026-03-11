import { Response } from 'express';
import User from '../models/User';
import Interview from '../models/Interview';
import { AuthRequest } from '../middleware/authMiddleware';

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const interviews = await Interview.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching history' });
  }
};

export const getUserStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return;
    }
    const stats = {
      xp: user.xp,
      streak: user.streak,
      badges: user.badges,
      level: user.level
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};
