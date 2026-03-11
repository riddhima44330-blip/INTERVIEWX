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
exports.getUserStats = exports.getUserHistory = exports.getUserProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const Interview_1 = __importDefault(require("../models/Interview"));
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUserProfile = getUserProfile;
const getUserHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interviews = yield Interview_1.default.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(interviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching history' });
    }
});
exports.getUserHistory = getUserHistory;
const getUserStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user._id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const stats = {
            xp: user.xp,
            streak: user.streak,
            badges: user.badges,
            level: user.level
        };
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching stats' });
    }
});
exports.getUserStats = getUserStats;
