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

    // Gamification & Badges logic
    const user = await User.findById(interview.userId);
    if (user) {
        // XP logic
        user.xp = (user.xp || 0) + score;
        
        // Streak logic (simplified: +1 per interview completed)
        user.streak = (user.streak || 0) + 1;

        // Badge logic
        const newBadges: string[] = [];
        
        if (user.interviewHistory.length === 1 && !user.badges.includes('First Interview')) {
            newBadges.push('First Interview');
        }
        
        if (user.streak === 5 && !user.badges.includes('5 Interview Streak')) {
            newBadges.push('5 Interview Streak');
        }

        if (user.streak === 10 && !user.badges.includes('10 Interview Streak')) {
            newBadges.push('10 Interview Streak');
        }

        if (score >= 80 && !user.badges.includes('Expert')) {
            newBadges.push('Expert');
        }

        if (user.interviewHistory.length >= 5 && score >= 70 && !user.badges.includes('Consistent Performer')) {
             newBadges.push('Consistent Performer');
        }

        if (newBadges.length > 0) {
            user.badges = [...user.badges, ...newBadges];
        }

        // Skill adaptation logic
        if (score >= 85 && user.skillLevel) {
            if (user.skillLevel === 'Beginner') {
                user.skillLevel = 'Intermediate';
            } else if (user.skillLevel === 'Intermediate') {
                user.skillLevel = 'Advanced';
            }
        }
        
        // Level up logic (every 500 XP = 1 level)
        const newLevel = Math.floor(user.xp / 500) + 1;
        if (newLevel > user.level) {
            user.level = newLevel;
        }

        await user.save();
    }

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Error finishing interview' });
  }
};
