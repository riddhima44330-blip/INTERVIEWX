"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = void 0;
const express_1 = require("express");
const Leaderboard_1 = __importDefault(require("../models/Leaderboard"));
const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Leaderboard_1.default.find().sort({ xp: -1 }).limit(10).populate('userId', 'name level badges');
        res.json(leaderboard);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard' });
    }
};
exports.getLeaderboard = getLeaderboard;
//# sourceMappingURL=leaderboardController.js.map