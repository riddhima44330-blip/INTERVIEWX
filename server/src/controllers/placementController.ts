import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import { generatePlacementQuestions } from '../services/ai.service';

export const startPlacementTest = async (req: AuthRequest, res: Response): Promise<void> => {
  const { domain, level } = req.body;
  
  if (!domain) {
    res.status(400).json({ message: 'Domain is required' });
    return;
  }

  try {
    const user = await User.findById(req.user._id);
    const skills = user?.resumeData?.skills || [];
    const targetDomain = domain || user?.detectedDomain || 'Behavioural';
    const targetLevel = level || user?.skillLevel || 'Intermediate';
    const questions = await generatePlacementQuestions(skills, targetDomain, targetLevel);
    res.json({ questions });
  } catch (error) {
    console.error('Error generating placement test:', error);
    res.status(500).json({ message: 'Failed to generate placement test from AI' });
  }
};

export const submitPlacementTest = async (req: AuthRequest, res: Response): Promise<void> => {
  const { score, totalQuestions } = req.body; // e.g., score: 3 out of 5

  if (score === undefined || !totalQuestions) {
    res.status(400).json({ message: 'Score and totalQuestions are required' });
    return;
  }

  try {
    const normalizedTotal = Number(totalQuestions);
    const normalizedScore = Number(score);
    const percentage = (normalizedScore / normalizedTotal) * 100;

    let skillLevel = 'Beginner';
    if (normalizedScore >= 8) {
      skillLevel = 'Advanced';
    } else if (normalizedScore >= 4) {
      skillLevel = 'Intermediate';
    }

    const user = await User.findById(req.user._id);
    if (user) {
      user.placementTestScore = percentage;
      user.skillLevel = skillLevel;
      await user.save();
    }

    res.json({ skillLevel, score: percentage, message: `Placement test complete. You are placed at ${skillLevel} level.` });
  } catch (error) {
    console.error('Error submitting placement test:', error);
    res.status(500).json({ message: 'Error processing placement test results' });
  }
};
