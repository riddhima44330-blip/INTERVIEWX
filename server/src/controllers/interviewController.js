"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finishInterview = exports.answerQuestion = exports.startInterview = void 0;
const express_1 = require("express");
const Interview_1 = __importDefault(require("../models/Interview"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const startInterview = async (req, res) => {
    const { domain, questions } = req.body;
    try {
        const interview = await Interview_1.default.create({
            userId: req.user._id,
            domain,
            questions,
        });
        res.status(201).json(interview);
    }
    catch (error) {
        res.status(500).json({ message: 'Error starting interview' });
    }
};
exports.startInterview = startInterview;
const answerQuestion = async (req, res) => {
    const { interviewId, answer, transcript } = req.body;
    try {
        const interview = await Interview_1.default.findById(interviewId);
        if (!interview) {
            res.status(404).json({ message: 'Interview not found' });
            return;
        }
        interview.answers.push(answer);
        interview.transcripts.push(transcript);
        await interview.save();
        res.json(interview);
    }
    catch (error) {
        res.status(500).json({ message: 'Error saving answer' });
    }
};
exports.answerQuestion = answerQuestion;
const finishInterview = async (req, res) => {
    const { interviewId, score, feedback } = req.body;
    try {
        const interview = await Interview_1.default.findById(interviewId);
        if (!interview) {
            res.status(404).json({ message: 'Interview not found' });
            return;
        }
        interview.score = score;
        interview.feedback = feedback;
        await interview.save();
        res.json(interview);
    }
    catch (error) {
        res.status(500).json({ message: 'Error finishing interview' });
    }
};
exports.finishInterview = finishInterview;
//# sourceMappingURL=interviewController.js.map