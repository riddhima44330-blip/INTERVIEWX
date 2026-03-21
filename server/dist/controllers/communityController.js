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
exports.commentPost = exports.likePost = exports.getPosts = exports.createPost = void 0;
const CommunityPost_1 = __importDefault(require("../models/CommunityPost"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question, domain, level } = req.body;
    try {
        const post = new CommunityPost_1.default({
            userId: req.user._id,
            question,
            domain,
            level,
        });
        const savedPost = yield post.save();
        // Populate user info before returning
        yield savedPost.populate('userId', 'name profileImage');
        res.status(201).json(savedPost);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating post' });
    }
});
exports.createPost = createPost;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sort = 'latest' } = req.query; // 'latest' or 'trending'
    try {
        let query = CommunityPost_1.default.find()
            .populate('userId', 'name profileImage')
            .populate('comments.userId', 'name profileImage');
        if (sort === 'trending') {
            // Sort by likes array length in descending order, then by date logic would typically require aggregation.
            // For simplicity, let's just sort by createdAt descending, and we'll handle sorting by likes explicitly:
            const posts = yield query.exec();
            posts.sort((a, b) => b.likes.length - a.likes.length);
            res.json(posts);
            return;
        }
        else {
            // default: latest
            query = query.sort({ createdAt: -1 });
        }
        const posts = yield query.exec();
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
});
exports.getPosts = getPosts;
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const post = yield CommunityPost_1.default.findById(id);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        const userId = req.user._id;
        const index = post.likes.indexOf(userId);
        if (index === -1) {
            // like
            post.likes.push(userId);
        }
        else {
            // unlike
            post.likes.splice(index, 1);
        }
        yield post.save();
        res.json(post);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error liking post' });
    }
});
exports.likePost = likePost;
const commentPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { text } = req.body;
    try {
        const post = yield CommunityPost_1.default.findById(id);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        const newComment = {
            userId: req.user._id,
            text
        };
        post.comments.push(newComment);
        yield post.save();
        // Return populated post
        yield post.populate('comments.userId', 'name profileImage');
        res.json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding comment' });
    }
});
exports.commentPost = commentPost;
