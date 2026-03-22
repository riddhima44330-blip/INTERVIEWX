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
exports.finishInterview = exports.answerQuestion = exports.startInterview = void 0;
const Interview_1 = __importDefault(require("../models/Interview"));
const User_1 = __importDefault(require("../models/User"));
const startInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { domain, questions, level } = req.body;
    try {
        const interview = yield Interview_1.default.create({
            userId: req.user._id,
            domain,
            level: level || 'Intermediate',
            questions,
        });
        // Add interview to user's history
        const user = yield User_1.default.findById(req.user._id);
        if (user) {
            user.interviewHistory.push(interview.id);
            yield user.save();
        }
        res.status(201).json(interview);
    }
    catch (error) {
        res.status(500).json({ message: 'Error starting interview' });
    }
});
exports.startInterview = startInterview;
const answerQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { interviewId, answer, transcript } = req.body;
    try {
        const interview = yield Interview_1.default.findById(interviewId);
        if (!interview) {
            res.status(404).json({ message: 'Interview not found' });
            return;
        }
        interview.answers.push(answer);
        interview.transcripts.push(transcript);
        yield interview.save();
        res.json(interview);
    }
    catch (error) {
        res.status(500).json({ message: 'Error saving answer' });
    }
});
exports.answerQuestion = answerQuestion;
const finishInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { interviewId, score, feedback } = req.body;
    try {
        const interview = yield Interview_1.default.findById(interviewId);
        if (!interview) {
            res.status(404).json({ message: 'Interview not found' });
            return;
        }
        interview.score = score;
        interview.feedback = feedback;
        yield interview.save();
        // Gamification & Badges logic
        const user = yield User_1.default.findById(interview.userId);
        if (user) {
            // XP logic
            user.xp = (user.xp || 0) + score;
            // Streak logic (simplified: +1 per interview completed)
            user.streak = (user.streak || 0) + 1;
            // Badge logic
            const newBadges = [];
            if (user.interviewHistory.length === 1 && !user.badges.includes('First Interview')) {
                newBadges.push('First Interview');
            }
            if (user.streak === 5 && !user.badges.includes('5 Interview Streak')) {
                newBadges.push('5 Interview Streak');
            }
            if (user.streak === 10 && !user.badges.includes('10 Interview Streak')) {
                newBadges.push('10 Interview Streak');
            }
            if (score >= 80 && !user.badges.includes('Expert')) {
                newBadges.push('Expert');
            }
            if (user.interviewHistory.length >= 5 && score >= 70 && !user.badges.includes('Consistent Performer')) {
                newBadges.push('Consistent Performer');
            }
            if (newBadges.length > 0) {
                user.badges = [...user.badges, ...newBadges];
            }
            // Skill adaptation logic
            if (score >= 85 && user.skillLevel) {
                if (user.skillLevel === 'Beginner') {
                    user.skillLevel = 'Intermediate';
                }
                else if (user.skillLevel === 'Intermediate') {
                    user.skillLevel = 'Advanced';
                }
            }
            // Level up logic (every 500 XP = 1 level)
            const newLevel = Math.floor(user.xp / 500) + 1;
            if (newLevel > user.level) {
                user.level = newLevel;
            }
            yield user.save();
        }
        res.json(interview);
    }
    catch (error) {
        res.status(500).json({ message: 'Error finishing interview' });
    }
});
exports.finishInterview = finishInterview;
