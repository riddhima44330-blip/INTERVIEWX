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
exports.generateFeedback = exports.analyzeResponse = exports.generateQuestions = void 0;
const User_1 = __importDefault(require("../models/User"));
// For MVP, we provide mock AI responses. When adding OpenAI/Gemini, wire logic here.
const generateQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { domain } = req.body;
    try {
        const questionPool = [
            `Tell me about a challenging problem you solved in ${domain}.`,
            `How do you handle performance optimization in ${domain}?`,
            `Explain a core concept in ${domain} to a beginner.`,
            `Describe your ideal testing process for a ${domain} project.`,
            `What is an emerging trend in ${domain} you find interesting?`,
            `Walk me through your process of debugging a complex issue in ${domain}.`,
            `How do you ensure your ${domain} code is scalable and maintainable?`,
            `Describe a time you had to compromise on technical debt in a ${domain} project.`,
            `What security considerations do you prioritize when working in ${domain}?`,
            `How do you stay updated with the latest advancements in ${domain}?`,
            `Can you explain a design pattern you frequently use in ${domain} and why?`,
            `What metrics do you use to measure the success of a ${domain} implementation?`
        ];
        // Shuffle and pick 5
        const shuffled = questionPool.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, 5);
        const user = yield User_1.default.findById(req.user._id);
        if (user && user.resumeData && user.resumeData.skills && user.resumeData.skills.length > 0) {
            const skillsSnippet = user.resumeData.skills.join(', ');
            // Inject personalization into the first and third questions
            selectedQuestions[0] = `I see from your resume you have experience with ${skillsSnippet}. Can you describe a challenging problem you solved using these skills in ${domain}?`;
            selectedQuestions[2] = `How do your existing skills like ${skillsSnippet} translate to core concepts in ${domain}?`;
        }
        // Delay to simulate API call
        setTimeout(() => res.json({ questions: selectedQuestions }), 1500);
    }
    catch (error) {
        res.status(500).json({ message: 'AI Error Generating Questions' });
    }
});
exports.generateQuestions = generateQuestions;
const analyzeResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Dummy response analyzer
        res.json({ analysis: "Good answer, could be more concise." });
    }
    catch (error) {
        res.status(500).json({ message: 'Error Analyzing Response' });
    }
});
exports.analyzeResponse = analyzeResponse;
const generateFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Generate dummy score based on simple math for MVP
        const mockFeedback = {
            confidence: Math.floor(Math.random() * 30) + 70, // 70-100
            communication: Math.floor(Math.random() * 30) + 65,
            technical: Math.floor(Math.random() * 30) + 70,
            clarity: Math.floor(Math.random() * 30) + 65,
            suggestions: [
                "Include more concrete examples",
                "Pace yourself during difficult concepts"
            ]
        };
        setTimeout(() => res.json({ score: (mockFeedback.confidence + mockFeedback.technical) / 2, feedback: mockFeedback }), 2000);
    }
    catch (error) {
        res.status(500).json({ message: 'AI Error Generating Feedback' });
    }
});
exports.generateFeedback = generateFeedback;
