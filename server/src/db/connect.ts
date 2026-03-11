import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
dotenv.config();

let mongoServer: MongoMemoryServer;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interviewx';
    
    try {
      // First try to connect to the provided or local MongoDB
      await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 });
      console.log('MongoDB Connected Successfully to local/cloud instance');
    } catch (primaryErr) {
      console.log('Local MongoDB not found. Booting In-Memory MongoDB Server for MVP...');
      mongoServer = await MongoMemoryServer.create();
      const memoryURI = mongoServer.getUri();
      
      await mongoose.connect(memoryURI);
      console.log(`In-Memory MongoDB Connected at ${memoryURI}`);
    }

  } catch (error) {
    console.error('Fatal MongoDB Connection Error: ', error);
    process.exit(1);
  }
};

export default connectDB;
