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
exports.getQuestions = void 0;
const QuestionBank_1 = __importDefault(require("../models/QuestionBank"));
const User_1 = __importDefault(require("../models/User"));
const getQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { domain, level } = req.params;
    try {
        const user = yield User_1.default.findById(req.user._id).populate('interviewHistory');
        // Find questions for the domain and level
        const bank = yield QuestionBank_1.default.findOne({ domain, level });
        if (!bank || !bank.questionList || bank.questionList.length === 0) {
            // Fallback: Generate dummy questions if bank is empty
            const mockQs = Array.from({ length: 5 }, (_, i) => `${level} ${domain} Question ${i + 1}`);
            res.json({ questions: mockQs });
            return;
        }
        // Get recently asked questions to avoid repetition
        const recentQuestions = new Set();
        if (user && user.interviewHistory) {
            // Collect questions from past interviews
            // Note: interviewHistory contains Interview objects since we populated it.
            // But let's safely handle it.
            const history = user.interviewHistory;
            history.forEach((interview) => {
                if (interview && interview.domain === domain && interview.level === level && interview.questions) {
                    interview.questions.forEach((q) => recentQuestions.add(q));
                }
            });
        }
        // Filter available
        let availableQuestions = bank.questionList.filter(q => !recentQuestions.has(q));
        // If we exhausted the pool, use the full pool again
        if (availableQuestions.length < 5) {
            availableQuestions = bank.questionList;
        }
        // Randomly pick 5
        const selected = [];
        const pool = [...availableQuestions];
        while (selected.length < 5 && pool.length > 0) {
            const idx = Math.floor(Math.random() * pool.length);
            selected.push(pool[idx]);
            pool.splice(idx, 1);
        }
        // If still less than 5, supplement with mocks
        let i = 1;
        while (selected.length < 5) {
            selected.push(`${level} ${domain} Backup Question ${i++}`);
        }
        res.json({ questions: selected });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching questions' });
    }
});
exports.getQuestions = getQuestions;
