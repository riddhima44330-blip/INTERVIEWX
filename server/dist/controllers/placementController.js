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
exports.submitPlacementTest = exports.startPlacementTest = void 0;
const User_1 = __importDefault(require("../models/User"));
const ai_service_1 = require("../services/ai.service");
const startPlacementTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { domain, level } = req.body;
    if (!domain) {
        res.status(400).json({ message: 'Domain is required' });
        return;
    }
    try {
        const user = yield User_1.default.findById(req.user._id);
        const skills = ((_a = user === null || user === void 0 ? void 0 : user.resumeData) === null || _a === void 0 ? void 0 : _a.skills) || [];
        const targetDomain = domain || (user === null || user === void 0 ? void 0 : user.detectedDomain) || 'Behavioural';
        const targetLevel = level || (user === null || user === void 0 ? void 0 : user.skillLevel) || 'Intermediate';
        const questions = yield (0, ai_service_1.generatePlacementQuestions)(skills, targetDomain, targetLevel);
        res.json({ questions });
    }
    catch (error) {
        console.error('Error generating placement test:', error);
        res.status(500).json({ message: 'Failed to generate placement test from AI' });
    }
});
exports.startPlacementTest = startPlacementTest;
const submitPlacementTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { score, totalQuestions } = req.body; // e.g., score: 3 out of 5
    if (score === undefined || !totalQuestions) {
        res.status(400).json({ message: 'Score and totalQuestions are required' });
        return;
    }
    try {
        const normalizedTotal = Number(totalQuestions);
        const normalizedScore = Number(score);
        const percentage = (normalizedScore / normalizedTotal) * 100;
        let skillLevel = 'Beginner';
        if (normalizedScore >= 8) {
            skillLevel = 'Advanced';
        }
        else if (normalizedScore >= 4) {
            skillLevel = 'Intermediate';
        }
        const user = yield User_1.default.findById(req.user._id);
        if (user) {
            user.placementTestScore = percentage;
            user.skillLevel = skillLevel;
            yield user.save();
        }
        res.json({ skillLevel, score: percentage, message: `Placement test complete. You are placed at ${skillLevel} level.` });
    }
    catch (error) {
        console.error('Error submitting placement test:', error);
        res.status(500).json({ message: 'Error processing placement test results' });
    }
});
exports.submitPlacementTest = submitPlacementTest;
