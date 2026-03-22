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
exports.uploadResume = void 0;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multerConfig_1 = require("../config/multerConfig");
const resume_service_1 = require("../services/resume.service");
exports.uploadResume = [
    multerConfig_1.upload.single('resume'), // CRITICAL: Field name "resume"
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No resume file uploaded' });
            }
            const filePath = path_1.default.join(__dirname, '../../../uploads', req.file.filename);
            const dataBuffer = fs_1.default.readFileSync(filePath);
            const pdfData = yield (0, pdf_parse_1.default)(dataBuffer);
            const analysis = (0, resume_service_1.analyzeResume)(pdfData.text);
            res.json({
                success: true,
                filePath: req.file.path,
                filename: req.file.filename,
                analysis
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    })
];
