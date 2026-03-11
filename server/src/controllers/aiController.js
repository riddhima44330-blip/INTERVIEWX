"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFeedback = exports.analyzeResponse = exports.generateQuestions = void 0;
const express_1 = require("express");
// For MVP, we provide mock AI responses. When adding OpenAI/Gemini, wire logic here.
const generateQuestions = async (req, res) => {
    const { domain } = req.body;
    try {
        const mockQuestions = [
            `Tell me about a challenging problem you solved in ${domain}.`,
            `How do you handle performance optimization in ${domain}?`,
            `Explain a core concept in ${domain} to a beginner.`,
            `Describe your ideal testing process for a ${domain} project.`,
            `What is an emerging trend in ${domain} you find interesting?`
        ];
        // Delay to simulate API call
        setTimeout(() => res.json({ questions: mockQuestions }), 1500);
    }
    catch (error) {
        res.status(500).json({ message: 'AI Error Generating Questions' });
    }
};
exports.generateQuestions = generateQuestions;
const analyzeResponse = async (req, res) => {
    try {
        // Dummy response analyzer
        res.json({ analysis: "Good answer, could be more concise." });
    }
    catch (error) {
        res.status(500).json({ message: 'Error Analyzing Response' });
    }
};
exports.analyzeResponse = analyzeResponse;
const generateFeedback = async (req, res) => {
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
};
exports.generateFeedback = generateFeedback;
//# sourceMappingURL=aiController.js.map