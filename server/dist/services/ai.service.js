"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpectedPointsForQuestion = exports.getFallbackInterviewQuestions = exports.calculateUserLevel = exports.getNextLevel = exports.evaluateAnswerQuality = exports.evaluateAnswer = exports.generateDynamicInterviewQuestions = exports.generatePlacementQuestions = exports.generateInterviewQuestions = exports.generateTestQuestions = exports.detectDomain = exports.extractSkillsFromResume = exports.analyzeResumeWithAI = void 0;
const genai_1 = require("@google/genai");
const env_1 = require("../config/env");
const questions_json_1 = __importDefault(require("../data/questions.json"));
const ai = env_1.env.GEMINI_API_KEY ? new genai_1.GoogleGenAI({ apiKey: env_1.env.GEMINI_API_KEY }) : null;
const fallbackByDomain = questions_json_1.default;
const normalizeSkillLevel = (level) => {
    if (level === 'Advanced' || level === 'Beginner' || level === 'Intermediate')
        return level;
    return 'Intermediate';
};
const parseJsonBlock = (input) => {
    let text = input.trim();
    if (text.includes('```json')) {
        text = text.split('```json')[1].split('```')[0].trim();
    }
    else if (text.includes('```')) {
        text = text.split('```')[1].split('```')[0].trim();
    }
    return JSON.parse(text);
};
const getAiText = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ai)
        return null;
    const response = yield ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text || null;
});
const analyzeResumeWithAI = (resumeText) => __awaiter(void 0, void 0, void 0, function* () {
    const skills = yield (0, exports.extractSkillsFromResume)(resumeText);
    const projects = extractProjectsFromResumeText(resumeText);
    const experienceYears = extractExperienceYears(resumeText);
    const educationLevel = extractEducationLevel(resumeText);
    const domain = (0, exports.detectDomain)(skills);
    const skillLevel = (0, exports.calculateUserLevel)({ skills, projects, experienceYears, technologies: skills, educationLevel });
    return {
        skills,
        projects,
        experienceYears,
        educationLevel,
        technologies: skills.slice(0, 8),
        experienceKeywords: [domain, 'Software Engineering'],
        skillLevel,
    };
});
exports.analyzeResumeWithAI = analyzeResumeWithAI;
const extractSkillsFromResume = (resumeText) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = `Extract technical skills from the resume text.
Return ONLY a JSON array like:
["React", "Node.js", "MongoDB"]
Resume:
${resumeText}`;
    try {
        const raw = yield getAiText(prompt);
        if (!raw)
            return ['JavaScript', 'TypeScript', 'Node.js'];
        const parsed = parseJsonBlock(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) {
            return ['JavaScript', 'TypeScript', 'Node.js'];
        }
        return parsed.slice(0, 12);
    }
    catch (_a) {
        return ['JavaScript', 'TypeScript', 'Node.js'];
    }
});
exports.extractSkillsFromResume = extractSkillsFromResume;
const detectDomain = (skills) => {
    const s = skills.map((item) => item.toLowerCase());
    if (s.some((x) => ['react', 'vue', 'angular', 'html', 'css', 'frontend'].some((k) => x.includes(k))))
        return 'Frontend';
    if (s.some((x) => ['node', 'express', 'java', 'spring', 'backend', 'api'].some((k) => x.includes(k))))
        return 'Backend';
    if (s.some((x) => ['sql', 'postgres', 'mysql', 'mongodb', 'database'].some((k) => x.includes(k))))
        return 'Database';
    if (s.some((x) => ['pandas', 'numpy', 'statistics', 'data analysis'].some((k) => x.includes(k))))
        return 'Data Science';
    if (s.some((x) => ['python', 'tensorflow', 'pytorch', 'machine learning', 'ai'].some((k) => x.includes(k))))
        return 'AI/ML';
    if (s.some((x) => ['system design', 'scalability', 'distributed systems'].some((k) => x.includes(k))))
        return 'System Design';
    return 'General';
};
exports.detectDomain = detectDomain;
const answerLetterToIndex = (letter) => {
    var _a;
    const mapping = { A: 0, B: 1, C: 2, D: 3 };
    return (_a = mapping[(letter || '').trim().toUpperCase()]) !== null && _a !== void 0 ? _a : 0;
};
const generateTestQuestions = (skills, domain, level) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
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
        ...(((_a = fallbackByDomain[validDomain]) === null || _a === void 0 ? void 0 : _a.Beginner) || []),
        ...(((_b = fallbackByDomain[validDomain]) === null || _b === void 0 ? void 0 : _b.Intermediate) || []),
        ...(((_c = fallbackByDomain[validDomain]) === null || _c === void 0 ? void 0 : _c.Advanced) || []),
    ];
    const fallback = Array.from({ length: 10 }, (_, index) => {
        var _a, _b, _c, _d;
        return ({
            id: index + 1,
            text: ((_a = fallbackPool[index % Math.max(fallbackPool.length, 1)]) === null || _a === void 0 ? void 0 : _a.question) || `MCQ ${index + 1}`,
            options: ((_b = fallbackPool[index % Math.max(fallbackPool.length, 1)]) === null || _b === void 0 ? void 0 : _b.options) || ['A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'],
            correctAnswer: ((_c = fallbackPool[index % Math.max(fallbackPool.length, 1)]) === null || _c === void 0 ? void 0 : _c.correctAnswer) || 'A',
            correctAnswerIndex: answerLetterToIndex(((_d = fallbackPool[index % Math.max(fallbackPool.length, 1)]) === null || _d === void 0 ? void 0 : _d.correctAnswer) || 'A'),
            difficulty: index < 4 ? 'Beginner' : index < 8 ? 'Intermediate' : 'Advanced',
        });
    });
    try {
        const raw = yield getAiText(prompt);
        if (!raw)
            return fallback;
        const parsed = parseJsonBlock(raw);
        if (!Array.isArray(parsed.questions) || parsed.questions.length !== 10)
            return fallback;
        const bandMap = { Easy: 'Beginner', Medium: 'Intermediate', Hard: 'Advanced' };
        return parsed.questions.map((q, i) => {
            var _a;
            return ({
                id: i + 1,
                text: q.question || fallback[i].text,
                options: ((_a = q.options) === null || _a === void 0 ? void 0 : _a.slice(0, 4)) || fallback[i].options,
                correctAnswer: q.correctAnswer || fallback[i].correctAnswer,
                correctAnswerIndex: answerLetterToIndex(q.correctAnswer || fallback[i].correctAnswer),
                difficulty: bandMap[q.difficulty] || fallback[i].difficulty,
            });
        });
    }
    catch (_d) {
        return fallback;
    }
});
exports.generateTestQuestions = generateTestQuestions;
const generateInterviewQuestions = (skills, level, previousAnswers, domain) => __awaiter(void 0, void 0, void 0, function* () {
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
        const raw = yield getAiText(prompt);
        if (!raw) {
            return (0, exports.getFallbackInterviewQuestions)(domain, level).map((q) => q.question);
        }
        const parsed = parseJsonBlock(raw);
        if (!Array.isArray(parsed.questions) || parsed.questions.length < 5) {
            return (0, exports.getFallbackInterviewQuestions)(domain, level).map((q) => q.question);
        }
        return parsed.questions.slice(0, 5).map((q) => q.question);
    }
    catch (_a) {
        return (0, exports.getFallbackInterviewQuestions)(domain, level).map((q) => q.question);
    }
});
exports.generateInterviewQuestions = generateInterviewQuestions;
exports.generatePlacementQuestions = exports.generateTestQuestions;
exports.generateDynamicInterviewQuestions = exports.generateInterviewQuestions;
const evaluateAnswer = (question, userAnswer, expectedPoints) => __awaiter(void 0, void 0, void 0, function* () {
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
        const raw = yield getAiText(prompt);
        if (!raw)
            return fallback;
        const parsed = parseJsonBlock(raw);
        return {
            technicalAccuracy: clamp(parsed.technicalAccuracy, 0, 5),
            clarity: clamp(parsed.clarity, 0, 5),
            depth: clamp(parsed.depth, 0, 5),
            examples: clamp(parsed.examples, 0, 5),
            communication: clamp(parsed.communication, 0, 5),
            totalScore: clamp(parsed.totalScore, 0, 25),
            feedback: parsed.feedback || fallback.feedback,
        };
    }
    catch (_a) {
        return fallback;
    }
});
exports.evaluateAnswer = evaluateAnswer;
const evaluateAnswerQuality = (totalScore) => totalScore > 18;
exports.evaluateAnswerQuality = evaluateAnswerQuality;
const getNextLevel = (current, isCorrect) => {
    if (isCorrect) {
        if (current === 'Beginner')
            return 'Intermediate';
        if (current === 'Intermediate')
            return 'Advanced';
        return 'Advanced';
    }
    if (current === 'Advanced')
        return 'Intermediate';
    if (current === 'Intermediate')
        return 'Beginner';
    return 'Beginner';
};
exports.getNextLevel = getNextLevel;
const calculateUserLevel = (resumeData) => {
    const skillScore = scoreSkillsStrength(resumeData.skills);
    const projectScore = scoreProjectComplexity(resumeData.projects);
    const experienceScore = scoreExperience(resumeData.experienceYears);
    const qualityScore = scoreResumeQuality(resumeData.skills, resumeData.technologies);
    const total = skillScore + projectScore + experienceScore + qualityScore;
    if (total >= 14)
        return 'Advanced';
    if (total >= 8)
        return 'Intermediate';
    return 'Beginner';
};
exports.calculateUserLevel = calculateUserLevel;
const getFallbackInterviewQuestions = (domain, level) => {
    var _a;
    const selectedDomain = fallbackByDomain[domain] ? domain : 'Behavioural';
    const questions = ((_a = fallbackByDomain[selectedDomain]) === null || _a === void 0 ? void 0 : _a[level]) || [];
    return questions.slice(0, 5);
};
exports.getFallbackInterviewQuestions = getFallbackInterviewQuestions;
const getExpectedPointsForQuestion = (domain, level, question) => {
    const questions = (0, exports.getFallbackInterviewQuestions)(domain, level);
    const matched = questions.find((q) => q.question === question);
    return (matched === null || matched === void 0 ? void 0 : matched.expectedAnswerPoints) || ['core concepts', 'technical depth', 'example'];
};
exports.getExpectedPointsForQuestion = getExpectedPointsForQuestion;
const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));
const extractProjectsFromResumeText = (text) => {
    const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
    return lines.filter((line) => /(project|built|developed|implemented|deployed)/i.test(line)).slice(0, 8);
};
const extractExperienceYears = (text) => {
    const yearsMatch = text.match(/(\d+)\+?\s*(years|yrs)/i);
    if (yearsMatch === null || yearsMatch === void 0 ? void 0 : yearsMatch[1])
        return Number(yearsMatch[1]);
    const internships = (text.match(/intern(ship)?/gi) || []).length;
    return internships > 0 ? 1 : 0;
};
const extractEducationLevel = (text) => {
    if (/phd|doctorate/i.test(text))
        return 'PhD';
    if (/master|m\.tech|m\.s/i.test(text))
        return 'Masters';
    if (/bachelor|b\.tech|b\.e/i.test(text))
        return 'Bachelors';
    return 'Unknown';
};
const scoreSkillsStrength = (skills) => {
    const lower = skills.map((skill) => skill.toLowerCase());
    if (lower.some((s) => ['system design', 'microservices', 'multi-stack'].some((k) => s.includes(k))))
        return 5;
    if (lower.some((s) => ['react', 'node', 'spring', 'express'].some((k) => s.includes(k))))
        return 3;
    return 1;
};
const scoreProjectComplexity = (projects) => {
    const text = projects.join(' ').toLowerCase();
    if (/(scalable|real[- ]world|production|distributed)/.test(text))
        return 5;
    if (/(full[- ]stack|auth|payment|deployment|api)/.test(text))
        return 3;
    return 1;
};
const scoreExperience = (years) => {
    if (years >= 3)
        return 5;
    if (years >= 1)
        return 3;
    return 1;
};
const scoreResumeQuality = (skills, technologies) => {
    const depth = Math.min(3, Math.floor((skills.length + technologies.length) / 4));
    const technicalKeywords = ['architecture', 'performance', 'security', 'scalability'];
    const keywordScore = skills.some((s) => technicalKeywords.some((k) => s.toLowerCase().includes(k))) ? 2 : 1;
    return depth + keywordScore;
};
const evaluateAnswerFallback = (userAnswer, expectedPoints) => {
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
