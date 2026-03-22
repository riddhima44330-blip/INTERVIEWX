"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/profile', authMiddleware_1.protect, userController_1.getUserProfile);
router.put('/profile', authMiddleware_1.protect, userController_1.updateUserProfile);
router.put('/change-password', authMiddleware_1.protect, userController_1.changePassword);
router.get('/history', authMiddleware_1.protect, userController_1.getUserHistory);
router.get('/stats', authMiddleware_1.protect, userController_1.getUserStats);
router.post('/set-skill-level', authMiddleware_1.protect, userController_1.setSkillLevel);
exports.default = router;
