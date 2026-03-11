import { Request, Response } from 'express';
import Leaderboard from '../models/Leaderboard';

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const leaderboard = await Leaderboard.find().sort({ xp: -1 }).limit(10).populate('userId', 'name level badges');
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};
