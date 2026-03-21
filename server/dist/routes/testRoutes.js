"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const placementController_1 = require("../controllers/placementController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/start', authMiddleware_1.protect, placementController_1.startPlacementTest);
router.post('/submit', authMiddleware_1.protect, placementController_1.submitPlacementTest);
exports.default = router;
