import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import QuestionBank from '../models/QuestionBank';
import User from '../models/User';
import Interview from '../models/Interview';

export const getQuestions = async (req: AuthRequest, res: Response): Promise<void> => {
  const { domain, level } = req.params;
  try {
    const user = await User.findById(req.user._id).populate('interviewHistory');
    
    // Find questions for the domain and level
    const bank = await QuestionBank.findOne({ domain, level });
    
    if (!bank || !bank.questionList || bank.questionList.length === 0) {
       // Fallback: Generate dummy questions if bank is empty
       const mockQs = Array.from({ length: 5 }, (_, i) => `${level} ${domain} Question ${i + 1}`);
       res.json({ questions: mockQs });
       return;
    }

    // Get recently asked questions to avoid repetition
    const recentQuestions = new Set<string>();
    if (user && user.interviewHistory) {
        // Collect questions from past interviews
        // Note: interviewHistory contains Interview objects since we populated it.
        // But let's safely handle it.
        const history = user.interviewHistory as any[];
        history.forEach((interview: any) => {
           if (interview && interview.domain === domain && interview.level === level && interview.questions) {
               interview.questions.forEach((q: string) => recentQuestions.add(q));
           }
        });
    }

    // Filter available
    let availableQuestions = bank.questionList.filter(q => !recentQuestions.has(q));
    
    // If we exhausted the pool, use the full pool again
    if (availableQuestions.length < 5) {
        availableQuestions = bank.questionList;
    }

    // Randomly pick 5
    const selected: string[] = [];
    const pool = [...availableQuestions];
    while (selected.length < 5 && pool.length > 0) {
        const idx = Math.floor(Math.random() * pool.length);
        selected.push(pool[idx]);
        pool.splice(idx, 1);
    }
    
    // If still less than 5, supplement with mocks
    let i = 1;
    while (selected.length < 5) {
       selected.push(`${level} ${domain} Backup Question ${i++}`);
    }

    res.json({ questions: selected });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
};
