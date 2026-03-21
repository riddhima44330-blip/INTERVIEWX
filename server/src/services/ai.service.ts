import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env';
import fallbackQuestions from '../data/questions.json';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
type DifficultyBand = 'Easy' | 'Medium' | 'Hard';

interface ResumeDataForLevel {
  skills: string[];
  projects: string[];
  experienceYears: number;
  technologies: string[];
  educationLevel: string;
}

export interface ResumeAnalysisResult {
  skills: string[];
  projects: string[];
  experienceYears: number;
  educationLevel: string;
  technologies: string[];
  experienceKeywords: string[];
  skillLevel: SkillLevel;
}

export interface PlacementQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  correctAnswerIndex: number;
  difficulty: SkillLevel;
}

interface FallbackQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  expectedAnswerPoints: string[];
  difficulty: SkillLevel;
}

const ai = env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: env.GEMINI_API_KEY }) : null;
const fallbackByDomain = fallbackQuestions as Record<string, Record<SkillLevel, FallbackQuestion[]>>;

const normalizeSkillLevel = (level?: string): SkillLevel => {
  if (level === 'Advanced' || level === 'Beginner' || level === 'Intermediate') return level;
  return 'Intermediate';
};

const parseJsonBlock = <T>(input: string): T => {
  let text = input.trim();
  if (text.includes('```json')) {
    text = text.split('```json')[1].split('```')[0].trim();
  } else if (text.includes('```')) {
    text = text.split('```')[1].split('```')[0].trim();
  }
  return JSON.parse(text) as T;
};

const getAiText = async (prompt: string): Promise<string | null> => {
  if (!ai) return null;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text || null;
};

export const analyzeResumeWithAI = async (resumeText: string): Promise<ResumeAnalysisResult> => {
  const skills = await extractSkillsFromResume(resumeText);
  const projects = extractProjectsFromResumeText(resumeText);
  const experienceYears = extractExperienceYears(resumeText);
  const educationLevel = extractEducationLevel(resumeText);
  const domain = detectDomain(skills);
  const skillLevel = calculateUserLevel({ skills, projects, experienceYears, technologies: skills, educationLevel });
  return {
    skills,
    projects,
    experienceYears,
    educationLevel,
    technologies: skills.slice(0, 8),
    experienceKeywords: [domain, 'Software Engineering'],
    skillLevel,
  };
};

export const extractSkillsFromResume = async (resumeText: string): Promise<string[]> => {
  const prompt = `Extract technical skills from the resume text.
Return ONLY a JSON array like:
["React", "Node.js", "MongoDB"]
Resume:
${resumeText}`;

  try {
    const raw = await getAiText(prompt);
    if (!raw) return ['JavaScript', 'TypeScript', 'Node.js'];
    const parsed = parseJsonBlock<string[]>(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return ['JavaScript', 'TypeScript', 'Node.js'];
    }
    return parsed.slice(0, 12);
  } catch {
    return ['JavaScript', 'TypeScript', 'Node.js'];
  }
};

export const detectDomain = (skills: string[]): string => {
  const s = skills.map((item) => item.toLowerCase());
  if (s.some((x) => ['react', 'vue', 'angular', 'html', 'css', 'frontend'].some((k) => x.includes(k)))) return 'Frontend';
  if (s.some((x) => ['node', 'express', 'java', 'spring', 'backend', 'api'].some((k) => x.includes(k)))) return 'Backend';
  if (s.some((x) => ['sql', 'postgres', 'mysql', 'mongodb', 'database'].some((k) => x.includes(k)))) return 'Database';
  if (s.some((x) => ['pandas', 'numpy', 'statistics', 'data analysis'].some((k) => x.includes(k)))) return 'Data Science';
  if (s.some((x) => ['python', 'tensorflow', 'pytorch', 'machine learning', 'ai'].some((k) => x.includes(k)))) return 'AI/ML';
  if (s.some((x) => ['system design', 'scalability', 'distributed systems'].some((k) => x.includes(k)))) return 'System Design';
  return 'General';
};

const answerLetterToIndex = (letter: string): number => {
  const mapping: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
  return mapping[(letter || '').trim().toUpperCase()] ?? 0;
};

export const generateTestQuestions = async (skills: string[], domain: string, level?: SkillLevel): Promise<PlacementQuestion[]> => {
  const prompt = `Generate exactly 10 MCQs for skill assessment.
Context:
- Domain: ${domain}
- Skills: ${skills.join(', ') || 'General Software Engineering'}
- Preferred level: ${level || 'Intermediate'}
Rules:
- Return strict JSON: { "questions": [{ "question": "...", "options": ["A. ...","B. ...","C. ...","D. ..."], "correctAnswer": "A|B|C|D", "difficulty": "Easy|Medium|Hard" }] }
- Exactly 10 questions
- Mix: 4 easy, 4 medium, 2 hard`;

  const validDomain = fallbackByDomain[domain] ? domain : 'Frontend';
  const fallbackPool = [
    ...(fallbackByDomain[validDomain]?.Beginner || []),
    ...(fallbackByDomain[validDomain]?.Intermediate || []),
    ...(fallbackByDomain[validDomain]?.Advanced || []),
  ];
  const fallback: PlacementQuestion[] = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    text: fallbackPool[index % Math.max(fallbackPool.length, 1)]?.question || `MCQ ${index + 1}`,
    options: fallbackPool[index % Math.max(fallbackPool.length, 1)]?.options || ['A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'],
    correctAnswer: fallbackPool[index % Math.max(fallbackPool.length, 1)]?.correctAnswer || 'A',
    correctAnswerIndex: answerLetterToIndex(fallbackPool[index % Math.max(fallbackPool.length, 1)]?.correctAnswer || 'A'),
    difficulty: index < 4 ? 'Beginner' : index < 8 ? 'Intermediate' : 'Advanced',
  }));

  try {
    const raw = await getAiText(prompt);
    if (!raw) return fallback;
    const parsed = parseJsonBlock<{ questions: Array<{ question: string; options: string[]; correctAnswer: string; difficulty: DifficultyBand }> }>(raw);
    if (!Array.isArray(parsed.questions) || parsed.questions.length !== 10) return fallback;
    const bandMap: Record<DifficultyBand, SkillLevel> = { Easy: 'Beginner', Medium: 'Intermediate', Hard: 'Advanced' };
    return parsed.questions.map((q, i) => ({
      id: i + 1,
      text: q.question || fallback[i].text,
      options: q.options?.slice(0, 4) || fallback[i].options,
      correctAnswer: q.correctAnswer || fallback[i].correctAnswer,
      correctAnswerIndex: answerLetterToIndex(q.correctAnswer || fallback[i].correctAnswer),
      difficulty: bandMap[q.difficulty] || fallback[i].difficulty,
    }));
  } catch {
    return fallback;
  }
};

export const generateInterviewQuestions = async (
  skills: string[],
  level: SkillLevel,
  previousAnswers: string[],
  domain: string
): Promise<string[]> => {
  const prompt = `Generate exactly 5 interview questions (non-MCQ) in strict JSON:
{ "questions": [{ "question": "...", "expectedAnswerPoints": ["..."], "difficulty": "${level}" }] }
Inputs:
- Domain: ${domain}
- Skills: ${skills.join(', ') || 'General Software Engineering'}
- Current level: ${level}
- Previous answers summary: ${previousAnswers.join(' || ') || 'No previous answers yet'}
Rules:
- Questions must adapt to performance trends in previous answers
- Real interview style only, no options`;

  try {
    const raw = await getAiText(prompt);
    if (!raw) {
      return getFallbackInterviewQuestions(domain, level).map((q) => q.question);
    }
    const parsed = parseJsonBlock<{ questions: Array<{ question: string }> }>(raw);
    if (!Array.isArray(parsed.questions) || parsed.questions.length < 5) {
      return getFallbackInterviewQuestions(domain, level).map((q) => q.question);
    }
    return parsed.questions.slice(0, 5).map((q) => q.question);
  } catch {
    return getFallbackInterviewQuestions(domain, level).map((q) => q.question);
  }
};

export const generatePlacementQuestions = generateTestQuestions;
export const generateDynamicInterviewQuestions = generateInterviewQuestions;

export const evaluateAnswer = async (question: string, userAnswer: string, expectedPoints: string[]) => {
  const fallback = evaluateAnswerFallback(userAnswer, expectedPoints);
  const prompt = `Evaluate the candidate's answer.
Question: ${question}
User Answer: ${userAnswer}
Expected Points: ${expectedPoints.join(', ')}
Score based on:
* Technical Accuracy
* Concept Clarity
* Depth
* Examples
* Communication
Return JSON:
{
  "technicalAccuracy": number,
  "clarity": number,
  "depth": number,
  "examples": number,
  "communication": number,
  "totalScore": number,
  "feedback": ""
}`;
  try {
    const raw = await getAiText(prompt);
    if (!raw) return fallback;
    const parsed = parseJsonBlock<{
      technicalAccuracy: number;
      clarity: number;
      depth: number;
      examples: number;
      communication: number;
      totalScore: number;
      feedback: string;
    }>(raw);
    return {
      technicalAccuracy: clamp(parsed.technicalAccuracy, 0, 5),
      clarity: clamp(parsed.clarity, 0, 5),
      depth: clamp(parsed.depth, 0, 5),
      examples: clamp(parsed.examples, 0, 5),
      communication: clamp(parsed.communication, 0, 5),
      totalScore: clamp(parsed.totalScore, 0, 25),
      feedback: parsed.feedback || fallback.feedback,
    };
  } catch {
    return fallback;
  }
};

export const evaluateAnswerQuality = (totalScore: number): boolean => totalScore > 18;

export const getNextLevel = (current: SkillLevel, isCorrect: boolean): SkillLevel => {
  if (isCorrect) {
    if (current === 'Beginner') return 'Intermediate';
    if (current === 'Intermediate') return 'Advanced';
    return 'Advanced';
  }
  if (current === 'Advanced') return 'Intermediate';
  if (current === 'Intermediate') return 'Beginner';
  return 'Beginner';
};

export const calculateUserLevel = (resumeData: ResumeDataForLevel): SkillLevel => {
  const skillScore = scoreSkillsStrength(resumeData.skills);
  const projectScore = scoreProjectComplexity(resumeData.projects);
  const experienceScore = scoreExperience(resumeData.experienceYears);
  const qualityScore = scoreResumeQuality(resumeData.skills, resumeData.technologies);
  const total = skillScore + projectScore + experienceScore + qualityScore;

  if (total >= 14) return 'Advanced';
  if (total >= 8) return 'Intermediate';
  return 'Beginner';
};

export const getFallbackInterviewQuestions = (domain: string, level: SkillLevel): FallbackQuestion[] => {
  const selectedDomain = fallbackByDomain[domain] ? domain : 'Behavioural';
  const questions = fallbackByDomain[selectedDomain]?.[level] || [];
  return questions.slice(0, 5);
};

export const getExpectedPointsForQuestion = (domain: string, level: SkillLevel, question: string): string[] => {
  const questions = getFallbackInterviewQuestions(domain, level);
  const matched = questions.find((q) => q.question === question);
  return matched?.expectedAnswerPoints || ['core concepts', 'technical depth', 'example'];
};

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, Number(value) || 0));

const extractProjectsFromResumeText = (text: string): string[] => {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  return lines.filter((line) => /(project|built|developed|implemented|deployed)/i.test(line)).slice(0, 8);
};

const extractExperienceYears = (text: string): number => {
  const yearsMatch = text.match(/(\d+)\+?\s*(years|yrs)/i);
  if (yearsMatch?.[1]) return Number(yearsMatch[1]);
  const internships = (text.match(/intern(ship)?/gi) || []).length;
  return internships > 0 ? 1 : 0;
};

const extractEducationLevel = (text: string): string => {
  if (/phd|doctorate/i.test(text)) return 'PhD';
  if (/master|m\.tech|m\.s/i.test(text)) return 'Masters';
  if (/bachelor|b\.tech|b\.e/i.test(text)) return 'Bachelors';
  return 'Unknown';
};

const scoreSkillsStrength = (skills: string[]): number => {
  const lower = skills.map((skill) => skill.toLowerCase());
  if (lower.some((s) => ['system design', 'microservices', 'multi-stack'].some((k) => s.includes(k)))) return 5;
  if (lower.some((s) => ['react', 'node', 'spring', 'express'].some((k) => s.includes(k)))) return 3;
  return 1;
};

const scoreProjectComplexity = (projects: string[]): number => {
  const text = projects.join(' ').toLowerCase();
  if (/(scalable|real[- ]world|production|distributed)/.test(text)) return 5;
  if (/(full[- ]stack|auth|payment|deployment|api)/.test(text)) return 3;
  return 1;
};

const scoreExperience = (years: number): number => {
  if (years >= 3) return 5;
  if (years >= 1) return 3;
  return 1;
};

const scoreResumeQuality = (skills: string[], technologies: string[]): number => {
  const depth = Math.min(3, Math.floor((skills.length + technologies.length) / 4));
  const technicalKeywords = ['architecture', 'performance', 'security', 'scalability'];
  const keywordScore = skills.some((s) => technicalKeywords.some((k) => s.toLowerCase().includes(k))) ? 2 : 1;
  return depth + keywordScore;
};

const evaluateAnswerFallback = (userAnswer: string, expectedPoints: string[]) => {
  const lower = userAnswer.toLowerCase();
  const pointHits = expectedPoints.filter((point) => lower.includes(point.toLowerCase())).length;
  const words = userAnswer.trim().split(/\s+/).filter(Boolean).length;
  const technicalAccuracy = clamp(pointHits + (words > 20 ? 1 : 0), 0, 5);
  const clarity = clamp(words > 12 ? 4 : 2, 0, 5);
  const depth = clamp(words > 35 ? 4 : words > 20 ? 3 : 2, 0, 5);
  const examples = clamp(/for example|for instance|such as|e\.g\./i.test(userAnswer) ? 4 : 2, 0, 5);
  const communication = clamp(/[.?!]/.test(userAnswer) ? 4 : 3, 0, 5);
  const totalScore = technicalAccuracy + clarity + depth + examples + communication;
  return {
    technicalAccuracy,
    clarity,
    depth,
    examples,
    communication,
    totalScore,
    feedback: totalScore > 18 ? 'Strong and technically clear response.' : totalScore < 10 ? 'Improve technical depth and include examples.' : 'Good baseline answer; add sharper technical details.',
  };
};
