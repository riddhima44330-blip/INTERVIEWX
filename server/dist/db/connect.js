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
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let mongoServer;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interviewx';
        try {
            // First try to connect to the provided or local MongoDB
            yield mongoose_1.default.connect(mongoURI, { serverSelectionTimeoutMS: 2000 });
            console.log('MongoDB Connected Successfully to local/cloud instance');
        }
        catch (primaryErr) {
            console.log('Local MongoDB not found. Booting In-Memory MongoDB Server for MVP...');
            mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
            const memoryURI = mongoServer.getUri();
            yield mongoose_1.default.connect(memoryURI);
            console.log(`In-Memory MongoDB Connected at ${memoryURI}`);
        }
    }
    catch (error) {
        console.error('Fatal MongoDB Connection Error: ', error);
        process.exit(1);
    }
});
exports.default = connectDB;
