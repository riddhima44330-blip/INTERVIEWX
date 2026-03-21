"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const communityController_1 = require("../controllers/communityController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, communityController_1.createPost);
router.get('/', authMiddleware_1.protect, communityController_1.getPosts);
router.post('/:id/like', authMiddleware_1.protect, communityController_1.likePost);
router.post('/:id/comment', authMiddleware_1.protect, communityController_1.commentPost);
exports.default = router;
