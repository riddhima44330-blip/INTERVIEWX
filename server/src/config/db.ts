import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env';

let mongoServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('MongoDB connected');
  } catch (primaryError) {
    console.log('Primary MongoDB unavailable. Starting in-memory MongoDB.');
    mongoServer = await MongoMemoryServer.create();
    const memoryURI = mongoServer.getUri();
    await mongoose.connect(memoryURI);
    console.log('In-memory MongoDB connected');
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
};
