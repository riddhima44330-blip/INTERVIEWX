"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const connect_1 = __importDefault(require("./db/connect"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const interviewRoutes_1 = __importDefault(require("./routes/interviewRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const leaderboardRoutes_1 = __importDefault(require("./routes/leaderboardRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Database Connection
(0, connect_1.default)();
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
app.use('/api/interview', interviewRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
app.use('/api/leaderboard', leaderboardRoutes_1.default);
app.get('/', (req, res) => {
    res.send('InterviewX API is running...');
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map