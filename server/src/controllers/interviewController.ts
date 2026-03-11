import { Response } from 'express';
import Interview from '../models/Interview';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

export const startInterview = async (req: AuthRequest, res: Response): Promise<void> => {
  const { domain, questions, level } = req.body;
  try {
    const interview = await Interview.create({
      userId: req.user._id,
      domain,
      level: level || 'Intermediate',
      questions,
    });
    
    // Add interview to user's history
    const user = await User.findById(req.user._id);
    if (user) {
       user.interviewHistory.push(interview.id);
       await user.save();
    }
    
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Error starting interview' });
  }
};

export const answerQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  const { interviewId, answer, transcript } = req.body;
  try {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
       res.status(404).json({ message: 'Interview not found' });
       return;
    }
    interview.answers.push(answer);
    interview.transcripts.push(transcript);
    await interview.save();
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Error saving answer' });
  }
};

export const finishInterview = async (req: AuthRequest, res: Response): Promise<void> => {
  const { interviewId, score, feedback } = req.body;
  try {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
       res.status(404).json({ message: 'Interview not found' });
       return;
    }
    interview.score = score;
    interview.feedback = feedback;
    await interview.save();

    // Skill adaptation logic
    if (score >= 85) {
        const user = await User.findById(interview.userId);
        if (user && user.skillLevel) {
            if (user.skillLevel === 'Beginner') {
                user.skillLevel = 'Intermediate';
            } else if (user.skillLevel === 'Intermediate') {
                user.skillLevel = 'Advanced';
            }
            await user.save();
        }
    }

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Error finishing interview' });
  }
};
