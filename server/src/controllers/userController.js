"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStats = exports.getUserHistory = exports.getUserProfile = void 0;
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const Interview_1 = __importDefault(require("../models/Interview"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const getUserProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user._id).select('-password');
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
};
exports.getUserProfile = getUserProfile;
const getUserHistory = async (req, res) => {
    try {
        const interviews = await Interview_1.default.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(interviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching history' });
    }
};
exports.getUserHistory = getUserHistory;
const getUserStats = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user._id);
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
};
exports.getUserStats = getUserStats;
//# sourceMappingURL=userController.js.map