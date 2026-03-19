import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import pdfParse = require('pdf-parse');

export const uploadResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const { mimetype, buffer } = req.file;
    let extractedText = "";

    if (mimetype === 'application/pdf') {
      const parsePdf = pdfParse as any;
      const parsed = await parsePdf(buffer);
      extractedText = parsed.text;
    } else {
        // Assume DOCX or plain text handling could be here.
        // For now, accept non-pdf as raw text (or mock extraction).
        extractedText = buffer.toString('utf-8');
    }

    // Save initial raw text or proceed to analyze. Let's send the text back, then the client calls analyze.
    res.json({ message: 'Resume uploaded successfully', text: extractedText });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing resume' });
  }
};

export const analyzeResume = async (req: AuthRequest, res: Response): Promise<void> => {
    const { text } = req.body;
    try {
        const lowerText = text.toLowerCase();
        
        const possibleSkills = ['javascript', 'react', 'node', 'mongodb', 'typescript', 'express', 'python', 'java', 'c++', 'sql', 'aws', 'docker', 'machine learning', 'data science'];
        const possibleTech = ['html', 'css', 'tailwindcss', 'git', 'linux', 'kubernetes', 'redis', 'graphql', 'figma'];
        const possibleExp = ['frontend', 'backend', 'fullstack', 'api', 'ui', 'ux', 'system design', 'agile', 'scrum'];
        
        const foundSkills = possibleSkills.filter(s => lowerText.includes(s)).map(s => s.charAt(0).toUpperCase() + s.slice(1));
        const foundTech = possibleTech.filter(s => lowerText.includes(s)).map(s => s.charAt(0).toUpperCase() + s.slice(1));
        const foundExp = possibleExp.filter(s => lowerText.includes(s)).map(s => s.charAt(0).toUpperCase() + s.slice(1));

        const resumeData = {
            skills: foundSkills.length > 0 ? foundSkills : ['JavaScript', 'React'],
            technologies: foundTech.length > 0 ? foundTech : ['Git', 'HTML/CSS'],
            experienceKeywords: foundExp.length > 0 ? foundExp : ['Software Development']
        };

        const user = await User.findById(req.user._id);
        if (user) {
            user.resumeData = resumeData;
            await user.save();
        }

        res.json({ resumeData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error analyzing resume' });
    }
}
