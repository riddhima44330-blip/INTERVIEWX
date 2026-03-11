"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const interviewController_1 = require("../controllers/interviewController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/start', authMiddleware_1.protect, interviewController_1.startInterview);
router.post('/answer', authMiddleware_1.protect, interviewController_1.answerQuestion);
router.post('/finish', authMiddleware_1.protect, interviewController_1.finishInterview);
exports.default = router;
//# sourceMappingURL=interviewRoutes.js.map