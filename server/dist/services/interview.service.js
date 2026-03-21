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
exports.getTestQuestions = exports.getInterviewQuestions = exports.getRandomQuestions = exports.finalizeInterview = exports.submitAdaptiveAnswer = exports.startAdaptiveInterview = void 0;
const Interview_1 = __importDefault(require("../models/Interview"));
const User_1 = __importDefault(require("../models/User"));
const ai_service_1 = require("./ai.service");
const questions = require('../data/questions.json');
const startAdaptiveInterview = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, domain, level, skills }) {
    const questions = yield (0, ai_service_1.generateDynamicInterviewQuestions)(skills, level, [], domain);
    const interview = yield Interview_1.default.create({
        userId,
        domain,
        level,
        skills,
        questions,
        currentRound: 1,
    });
    const user = yield User_1.default.findById(userId);
    if (user) {
        user.interviewHistory.push(interview.id);
        yield user.save();
    }
    return interview;
});
exports.startAdaptiveInterview = startAdaptiveInterview;
const submitAdaptiveAnswer = (interviewId, answer, transcript) => __awaiter(void 0, void 0, void 0, function* () {
    const interview = yield Interview_1.default.findById(interviewId);
    if (!interview)
        return null;
    const currentQuestion = interview.questions[interview.answers.length] || '';
    const expectedPoints = (0, ai_service_1.getExpectedPointsForQuestion)(interview.domain, interview.level, currentQuestion);
    const evaluation = yield (0, ai_service_1.evaluateAnswer)(currentQuestion, answer, expectedPoints);
    interview.answers.push(answer);
    interview.transcripts.push(transcript);
    interview.scores.push(evaluation.totalScore);
    interview.answerFeedback.push(evaluation.feedback);
    const isCorrect = (0, ai_service_1.evaluateAnswerQuality)(evaluation.totalScore);
    interview.level = (0, ai_service_1.getNextLevel)(interview.level, isCorrect);
    if (evaluation.totalScore < 10) {
        interview.level = (0, ai_service_1.getNextLevel)(interview.level, false);
    }
    const answeredCount = interview.answers.length;
    if (answeredCount >= interview.questions.length) {
        const nextBatch = yield (0, ai_service_1.generateDynamicInterviewQuestions)(interview.skills || [], interview.level, interview.answers, interview.domain);
        const nextQuestion = nextBatch[0];
        if (nextQuestion) {
            interview.questions.push(nextQuestion);
        }
    }
    if (answeredCount > 0 && answeredCount % 5 === 0) {
        interview.currentRound += 1;
    }
    yield interview.save();
    return { interview, evaluation };
});
exports.submitAdaptiveAnswer = submitAdaptiveAnswer;
const finalizeInterview = (interviewId, score, feedback) => __awaiter(void 0, void 0, void 0, function* () {
    const interview = yield Interview_1.default.findById(interviewId);
    if (!interview)
        return null;
    interview.score = score;
    interview.feedback = feedback;
    yield interview.save();
    return interview;
});
exports.finalizeInterview = finalizeInterview;
const getRandomQuestions = (pool, used, count) => {
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
exports.getRandomQuestions = getRandomQuestions;
const getInterviewQuestions = (domain, level, user) => {
    const domainMap = {
        'Frontend development': 'FD',
        'Backend development': 'BD',
        'Data Science': 'DS',
        'AI/Machine learning': 'AI',
        'System Design': 'SD',
        'Behavioural interviews': 'BI'
    };
    const levelMap = {
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
    return (0, exports.getRandomQuestions)(pool, user.usedQuestions, 5);
};
exports.getInterviewQuestions = getInterviewQuestions;
const getTestQuestions = (domain) => {
    const domainMap = {
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
exports.getTestQuestions = getTestQuestions;
