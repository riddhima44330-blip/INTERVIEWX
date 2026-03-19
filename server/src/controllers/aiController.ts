import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';

// For MVP, we provide mock AI responses. When adding OpenAI/Gemini, wire logic here.
export const generateQuestions = async (req: AuthRequest, res: Response): Promise<void> => {
  const { domain } = req.body;
  try {
    const questionPool = [
      `Tell me about a challenging problem you solved in ${domain}.`,
      `How do you handle performance optimization in ${domain}?`,
      `Explain a core concept in ${domain} to a beginner.`,
      `Describe your ideal testing process for a ${domain} project.`,
      `What is an emerging trend in ${domain} you find interesting?`,
      `Walk me through your process of debugging a complex issue in ${domain}.`,
      `How do you ensure your ${domain} code is scalable and maintainable?`,
      `Describe a time you had to compromise on technical debt in a ${domain} project.`,
      `What security considerations do you prioritize when working in ${domain}?`,
      `How do you stay updated with the latest advancements in ${domain}?`,
      `Can you explain a design pattern you frequently use in ${domain} and why?`,
      `What metrics do you use to measure the success of a ${domain} implementation?`
    ];

    // Shuffle and pick 5
    const shuffled = questionPool.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 5);

    const user = await User.findById(req.user._id);
    if (user && user.resumeData && user.resumeData.skills && user.resumeData.skills.length > 0) {
        const skillsSnippet = user.resumeData.skills.join(', ');
        // Inject personalization into the first and third questions
        selectedQuestions[0] = `I see from your resume you have experience with ${skillsSnippet}. Can you describe a challenging problem you solved using these skills in ${domain}?`;
        selectedQuestions[2] = `How do your existing skills like ${skillsSnippet} translate to core concepts in ${domain}?`;
    }

    // Delay to simulate API call
    setTimeout(() => res.json({ questions: selectedQuestions }), 1500);
  } catch (error) {
    res.status(500).json({ message: 'AI Error Generating Questions' });
  }
};

export const analyzeResponse = async (req: Request, res: Response): Promise<void> => {
  try {
    // Dummy response analyzer
    res.json({ analysis: "Good answer, could be more concise." });
  } catch (error) {
    res.status(500).json({ message: 'Error Analyzing Response' });
  }
};

export const generateFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    // Generate dummy score based on simple math for MVP
    const mockFeedback = {
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100
      communication: Math.floor(Math.random() * 30) + 65,
      technical: Math.floor(Math.random() * 30) + 70,
      clarity: Math.floor(Math.random() * 30) + 65,
      suggestions: [
        "Include more concrete examples",
        "Pace yourself during difficult concepts"
      ]
    };
    
    setTimeout(() => res.json({ score: (mockFeedback.confidence + mockFeedback.technical) / 2, feedback: mockFeedback }), 2000);
  } catch (error) {
    res.status(500).json({ message: 'AI Error Generating Feedback' });
  }
};
