"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requiredEnv = ['JWT_SECRET'];
for (const envName of requiredEnv) {
    if (!process.env[envName]) {
        throw new Error(`Missing required environment variable: ${envName}`);
    }
}
exports.env = {
    PORT: Number(process.env.PORT || 5000),
    MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interviewx',
    JWT_SECRET: process.env.JWT_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
};
