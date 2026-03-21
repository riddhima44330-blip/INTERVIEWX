import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['JWT_SECRET'];

for (const envName of requiredEnv) {
  if (!process.env[envName]) {
    throw new Error(`Missing required environment variable: ${envName}`);
  }
}

export const env = {
  PORT: Number(process.env.PORT || 5000),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interviewx',
  JWT_SECRET: process.env.JWT_SECRET as string,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
};
