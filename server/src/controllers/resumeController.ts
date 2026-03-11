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
        // Mocking AI analysis extraction
        const mockSkills = ['JavaScript', 'React', 'Node.js', 'MongoDB'];
        const mockTech = ['TypeScript', 'Express', 'TailwindCSS'];
        const mockExperience = ['Frontend Development', 'Web Applications'];

        const resumeData = {
            skills: mockSkills,
            technologies: mockTech,
            experienceKeywords: mockExperience
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
