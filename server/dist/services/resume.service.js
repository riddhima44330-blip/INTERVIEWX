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
exports.analyzeAndSaveResume = exports.extractResumeText = void 0;
const pdfParse = require("pdf-parse");
const promises_1 = __importDefault(require("fs/promises"));
const User_1 = __importDefault(require("../models/User"));
const ai_service_1 = require("./ai.service");
const extractResumeText = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const buffer = yield promises_1.default.readFile(filePath);
    const parsePdf = pdfParse;
    const parsed = yield parsePdf(buffer);
    return parsed.text || '';
});
exports.extractResumeText = extractResumeText;
const analyzeAndSaveResume = (userId, text) => __awaiter(void 0, void 0, void 0, function* () {
    const baseAnalysis = yield (0, ai_service_1.analyzeResumeWithAI)(text);
    const extractedSkills = yield (0, ai_service_1.extractSkillsFromResume)(text);
    const domain = (0, ai_service_1.detectDomain)(extractedSkills);
    const analysis = Object.assign(Object.assign({}, baseAnalysis), { skills: extractedSkills, projects: baseAnalysis.projects || [], experienceYears: baseAnalysis.experienceYears || 0, educationLevel: baseAnalysis.educationLevel || 'Unknown', technologies: extractedSkills.slice(0, 6), experienceKeywords: [domain, ...baseAnalysis.experienceKeywords].slice(0, 8), skillLevel: (0, ai_service_1.calculateUserLevel)({
            skills: extractedSkills,
            projects: baseAnalysis.projects || [],
            experienceYears: baseAnalysis.experienceYears || 0,
            technologies: extractedSkills.slice(0, 6),
            educationLevel: baseAnalysis.educationLevel || 'Unknown',
        }) });
    const user = yield User_1.default.findById(userId);
    if (user) {
        user.resumeData = {
            skills: analysis.skills,
            projects: analysis.projects,
            experienceYears: analysis.experienceYears,
            educationLevel: analysis.educationLevel,
            technologies: analysis.technologies,
            experienceKeywords: analysis.experienceKeywords,
        };
        user.resumeAnalyzed = true;
        user.skillLevel = analysis.skillLevel;
        user.detectedDomain = domain;
        yield user.save();
    }
    return Object.assign(Object.assign({}, analysis), { domain });
});
exports.analyzeAndSaveResume = analyzeAndSaveResume;
