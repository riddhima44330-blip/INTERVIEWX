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
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const env_1 = require("./env");
let mongoServer = null;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_1.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
        console.log('MongoDB connected');
    }
    catch (primaryError) {
        console.log('Primary MongoDB unavailable. Starting in-memory MongoDB.');
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const memoryURI = mongoServer.getUri();
        yield mongoose_1.default.connect(memoryURI);
        console.log('In-memory MongoDB connected');
    }
});
exports.connectDB = connectDB;
const disconnectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    if (mongoServer) {
        yield mongoServer.stop();
        mongoServer = null;
    }
});
exports.disconnectDB = disconnectDB;
