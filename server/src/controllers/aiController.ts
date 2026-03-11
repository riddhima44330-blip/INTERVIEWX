import { Response, Request } from 'express';

// For MVP, we provide mock AI responses. When adding OpenAI/Gemini, wire logic here.
export const generateQuestions = async (req: Request, res: Response): Promise<void> => {
  const { domain } = req.body;
  try {
    const mockQuestions = [
      `Tell me about a challenging problem you solved in ${domain}.`,
      `How do you handle performance optimization in ${domain}?`,
      `Explain a core concept in ${domain} to a beginner.`,
      `Describe your ideal testing process for a ${domain} project.`,
      `What is an emerging trend in ${domain} you find interesting?`
    ];
    // Delay to simulate API call
    setTimeout(() => res.json({ questions: mockQuestions }), 1500);
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
