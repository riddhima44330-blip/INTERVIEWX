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
exports.analyzeResume = exports.uploadResume = void 0;
const User_1 = __importDefault(require("../models/User"));
const pdfParse = require("pdf-parse");
const fs_1 = __importDefault(require("fs"));
const uploadResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded. Use field name 'resume' with a PDF file." });
            return;
        }
        const resumeFilePath = req.file.path;
        const buffer = yield fs_1.default.promises.readFile(resumeFilePath);
        const parsePdf = pdfParse;
        const parsed = yield parsePdf(buffer);
        const extractedText = parsed.text || '';
        // Save initial raw text or proceed to analyze. Let's send the text back, then the client calls analyze.
        res.json({ message: 'Resume uploaded successfully', text: extractedText, filePath: resumeFilePath });
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: `Error processing resume: ${error.message}` });
        }
        else {
            res.status(500).json({ message: 'Error processing resume' });
        }
    }
});
exports.uploadResume = uploadResume;
const analyzeResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text } = req.body;
    try {
        const lowerText = text.toLowerCase();
        const possibleSkills = ['javascript', 'react', 'node', 'mongodb', 'typescript', 'express', 'python', 'java', 'c++', 'sql', 'aws', 'docker', 'machine learning', 'data science'];
        const possibleTech = ['html', 'css', 'tailwindcss', 'git', 'linux', 'kubernetes', 'redis', 'graphql', 'figma'];
        const possibleExp = ['frontend', 'backend', 'fullstack', 'api', 'ui', 'ux', 'system design', 'agile', 'scrum'];
        const foundSkills = possibleSkills.filter(s => lowerText.includes(s)).map(s => s.charAt(0).toUpperCase() + s.slice(1));
        const foundTech = possibleTech.filter(s => lowerText.includes(s)).map(s => s.charAt(0).toUpperCase() + s.slice(1));
        const foundExp = possibleExp.filter(s => lowerText.includes(s)).map(s => s.charAt(0).toUpperCase() + s.slice(1));
        const resumeData = {
            skills: foundSkills.length > 0 ? foundSkills : ['JavaScript', 'React'],
            technologies: foundTech.length > 0 ? foundTech : ['Git', 'HTML/CSS'],
            experienceKeywords: foundExp.length > 0 ? foundExp : ['Software Development']
        };
        const user = yield User_1.default.findById(req.user._id);
        if (user) {
            user.resumeData = resumeData;
            yield user.save();
        }
        res.json({ resumeData });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error analyzing resume' });
    }
});
exports.analyzeResume = analyzeResume;
