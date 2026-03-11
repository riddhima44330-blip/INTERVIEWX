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
const startInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { domain, questions } = req.body;
    try {
        const interview = yield Interview_1.default.create({
            userId: req.user._id,
            domain,
            questions,
        });
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
        res.json(interview);
    }
    catch (error) {
        res.status(500).json({ message: 'Error finishing interview' });
    }
});
exports.finishInterview = finishInterview;
