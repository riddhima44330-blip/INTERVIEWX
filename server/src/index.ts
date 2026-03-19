import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/connect';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import interviewRoutes from './routes/interviewRoutes';
import aiRoutes from './routes/aiRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import questionRoutes from './routes/questionRoutes';
import resumeRoutes from './routes/resumeRoutes';
import communityRoutes from './routes/communityRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/community', communityRoutes);

app.get('/', (req, res) => {
  res.send('InterviewX API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
