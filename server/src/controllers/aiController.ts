import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import Interview from '../models/Interview';
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
    const { interviewId } = req.body;
    const interview = await Interview.findById(interviewId);
    
    if (!interview) {
      res.status(404).json({ message: 'Interview not found' });
      return;
    }

    let totalTechnical = 0;
    let totalConfidence = 0;
    let totalClarity = 0;
    const answerCount = interview.answers.length || 1;

    interview.answers.forEach((ans: string) => {
      const answerLower = ans.toLowerCase();

      // 1. Keywords Match (Technical)
      let keywords: string[] = [];
      if (interview.domain === 'frontend') keywords = ['ui', 'component', 'react', 'dom', 'state', 'props', 'render', 'html', 'css', 'javascript'];
      else if (interview.domain === 'backend') keywords = ['server', 'api', 'database', 'middleware', 'request', 'response', 'node', 'express', 'rest'];
      else if (interview.domain === 'data-science') keywords = ['data', 'model', 'analysis', 'python', 'set', 'feature', 'pandas', 'regression'];
      else if (interview.domain === 'ai-ml') keywords = ['model', 'train', 'network', 'learning', 'data', 'algorithm', 'neural', 'deep'];
      else if (interview.domain === 'system-design') keywords = ['scale', 'load', 'server', 'database', 'cache', 'balance', 'cdn', 'latency'];
      else keywords = ['experience', 'team', 'challenge', 'project', 'goal', 'achieve', 'resolve', 'conflict'];

      let keywordScore = 40; // Base score
      keywords.forEach(kw => {
        if (answerLower.includes(kw)) keywordScore += 15;
      });
      totalTechnical += Math.min(100, keywordScore);

      // 2. Confidence Tone
      const weakWords = ['maybe', 'not sure', 'i think', 'probably', 'guess', 'umm', 'uh'];
      const strongWords = ['definitely', 'absolutely', 'crucial', 'important', 'always', 'exactly', 'confident'];
      
      let confidenceScore = 70; // Base score
      weakWords.forEach(w => {
        if (answerLower.includes(` ${w} `)) confidenceScore -= 10;
      });
      strongWords.forEach(w => {
        if (answerLower.includes(` ${w} `)) confidenceScore += 10;
      });
      totalConfidence += Math.max(0, Math.min(100, confidenceScore));

      // 3. Clarity of explanation (Length & generic filler check)
      let clarityScore = ans.length > 50 ? 80 : 50;
      if (ans.length > 150) clarityScore += 10;
      const fillers = ['like', 'you know'];
      fillers.forEach(f => {
        if (answerLower.includes(` ${f} `)) clarityScore -= 5;
      });
      totalClarity += Math.max(0, Math.min(100, clarityScore));
    });

    const avgTechnical = Math.round(totalTechnical / answerCount) || 50;
    const avgConfidence = Math.round(totalConfidence / answerCount) || 50;
    const avgClarity = Math.round(totalClarity / answerCount) || 50;
    const communication = Math.round((avgConfidence + avgClarity) / 2);
    const overallScore = Math.round((avgTechnical + avgConfidence + avgClarity) / 3);

    const suggestions: string[] = [];
    if (avgTechnical < 70) suggestions.push("Try to use more domain-specific technical terms to demonstrate expertise.");
    if (avgConfidence < 70) suggestions.push("Avoid using filler words like 'umm' or 'maybe' to sound more confident.");
    if (avgClarity < 70) suggestions.push("Provide more detailed and structured explanations.");
    if (suggestions.length === 0) suggestions.push("Great job! Keep up the concise and confident explanations.");

    const finalFeedback = {
      confidence: avgConfidence,
      communication,
      technical: avgTechnical,
      clarity: avgClarity,
      suggestions
    };

    res.json({ score: overallScore, feedback: finalFeedback });
  } catch (error) {
    res.status(500).json({ message: 'Error Generating Feedback' });
  }
};
