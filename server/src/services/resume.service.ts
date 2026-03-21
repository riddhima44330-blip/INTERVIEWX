import pdfParse = require('pdf-parse');
import fs from 'fs/promises';
import User from '../models/User';
import { analyzeResumeWithAI, detectDomain, extractSkillsFromResume, calculateUserLevel } from './ai.service';

export const extractResumeText = async (filePath: string): Promise<string> => {
  const buffer = await fs.readFile(filePath);
  const parsePdf = pdfParse as any;
  const parsed = await parsePdf(buffer);
  return parsed.text || '';
};

export const analyzeAndSaveResume = async (userId: string, text: string) => {
  const baseAnalysis = await analyzeResumeWithAI(text);
  const extractedSkills = await extractSkillsFromResume(text);
  const domain = detectDomain(extractedSkills);
  const analysis = {
    ...baseAnalysis,
    skills: extractedSkills,
    projects: baseAnalysis.projects || [],
    experienceYears: baseAnalysis.experienceYears || 0,
    educationLevel: baseAnalysis.educationLevel || 'Unknown',
    technologies: extractedSkills.slice(0, 6),
    experienceKeywords: [domain, ...baseAnalysis.experienceKeywords].slice(0, 8),
    skillLevel: calculateUserLevel({
      skills: extractedSkills,
      projects: baseAnalysis.projects || [],
      experienceYears: baseAnalysis.experienceYears || 0,
      technologies: extractedSkills.slice(0, 6),
      educationLevel: baseAnalysis.educationLevel || 'Unknown',
    }),
  };
  const user = await User.findById(userId);

  if (user) {
    user.resumeData = {
      skills: analysis.skills,
      projects: analysis.projects,
      experienceYears: analysis.experienceYears,
      educationLevel: analysis.educationLevel,
      technologies: analysis.technologies,
      experienceKeywords: analysis.experienceKeywords,
    };
    user.resumeAnalyzed = true;
    user.skillLevel = analysis.skillLevel;
    user.detectedDomain = domain;
    await user.save();
  }

  return { ...analysis, domain };
};
