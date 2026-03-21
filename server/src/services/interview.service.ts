import Interview from '../models/Interview';
import User from '../models/User';
import {
  evaluateAnswer,
  getExpectedPointsForQuestion,
  SkillLevel,
  evaluateAnswerQuality,
  generateDynamicInterviewQuestions,
  getNextLevel,
} from './ai.service';
const questions = require('../data/questions.json') as any[];

interface StartInterviewInput {
  userId: string;
  domain: string;
  level: SkillLevel;
  skills: string[];
}

export const startAdaptiveInterview = async ({ userId, domain, level, skills }: StartInterviewInput) => {
  const questions = await generateDynamicInterviewQuestions(skills, level, [], domain);

  const interview = await Interview.create({
    userId,
    domain,
    level,
    skills,
    questions,
    currentRound: 1,
  });

  const user = await User.findById(userId);
  if (user) {
    user.interviewHistory.push(interview.id);
    await user.save();
  }

  return interview;
};

export const submitAdaptiveAnswer = async (interviewId: string, answer: string, transcript: string) => {
  const interview = await Interview.findById(interviewId);
  if (!interview) return null;

  const currentQuestion = interview.questions[interview.answers.length] || '';
  const expectedPoints = getExpectedPointsForQuestion(interview.domain, interview.level as SkillLevel, currentQuestion);
  const evaluation = await evaluateAnswer(currentQuestion, answer, expectedPoints);

  interview.answers.push(answer);
  interview.transcripts.push(transcript);
  interview.scores.push(evaluation.totalScore);
  interview.answerFeedback.push(evaluation.feedback);

  const isCorrect = evaluateAnswerQuality(evaluation.totalScore);
  interview.level = getNextLevel(interview.level as SkillLevel, isCorrect);
  if (evaluation.totalScore < 10) {
    interview.level = getNextLevel(interview.level as SkillLevel, false);
  }

  const answeredCount = interview.answers.length;
  if (answeredCount >= interview.questions.length) {
    const nextBatch = await generateDynamicInterviewQuestions(
      interview.skills || [],
      interview.level as SkillLevel,
      interview.answers,
      interview.domain
    );
    const nextQuestion = nextBatch[0];
    if (nextQuestion) {
      interview.questions.push(nextQuestion);
    }
  }

  if (answeredCount > 0 && answeredCount % 5 === 0) {
    interview.currentRound += 1;
  }

  await interview.save();
  return { interview, evaluation };
};

export const finalizeInterview = async (interviewId: string, score: number, feedback: any) => {
  const interview = await Interview.findById(interviewId);
  if (!interview) return null;

  interview.score = score;
  interview.feedback = feedback;
  await interview.save();
  return interview;
};

export const getRandomQuestions = (pool: any[], used: string[], count: number): any[] => {
  let available = pool.filter(q => !used.includes(q.id));

  if (available.length < count) {
    used.length = 0; // reset used array
    available = pool.filter(q => !used.includes(q.id));
  }

  // Shuffle randomly
  const shuffled = available.sort(() => Math.random() - 0.5);

  // Return required number
  const selected = shuffled.slice(0, count);

  // Add to used
  selected.forEach(q => used.push(q.id));

  return selected;
};

export const getInterviewQuestions = (domain: string, level: string, user: any): any[] => {
  const domainMap: { [key: string]: string } = {
    'Frontend development': 'FD',
    'Backend development': 'BD',
    'Data Science': 'DS',
    'AI/Machine learning': 'AI',
    'System Design': 'SD',
    'Behavioural interviews': 'BI'
  };

  const levelMap: { [key: string]: string } = {
    'Beginner': 'B',
    'Intermediate': 'I',
    'Advanced': 'A'
  };

  const domainCode = domainMap[domain];
  const levelCode = levelMap[level];

  if (!domainCode || !levelCode) {
    throw new Error('Invalid domain or level');
  }

  const pool = questions.filter(q => q.id.startsWith(`${domainCode}-${levelCode}-`));

  if (!user.usedQuestions) {
    user.usedQuestions = [];
  }

  return getRandomQuestions(pool, user.usedQuestions, 5);
};

export const getTestQuestions = (domain: string): any[] => {
  const domainMap: { [key: string]: string } = {
    'Frontend development': 'FD',
    'Backend development': 'BD',
    'Data Science': 'DS',
    'AI/Machine learning': 'AI',
    'System Design': 'SD',
    'Behavioural interviews': 'BI'
  };

  const domainCode = domainMap[domain];

  if (!domainCode) {
    throw new Error('Invalid domain');
  }

  // Combine Beginner + Intermediate + Advanced
  const pool = questions.filter(q => q.id.startsWith(`${domainCode}-`));

  // Shuffle questions
  const shuffled = pool.sort(() => Math.random() - 0.5);

  // Return 10 random MCQs
  return shuffled.slice(0, 10);
};
