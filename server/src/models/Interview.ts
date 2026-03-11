import mongoose, { Schema, Document } from 'mongoose';

export interface IInterview extends Document {
  userId: mongoose.Types.ObjectId;
  domain: string;
  level: string;
  questions: string[];
  answers: string[];
  transcripts: string[];
  score: number;
  feedback: {
    confidence: number;
    communication: number;
    technical: number;
    clarity: number;
    suggestions: string[];
  };
  createdAt: Date;
}

const InterviewSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  domain: { type: String, required: true },
  level: { type: String, required: true, default: 'Intermediate' },
  questions: { type: [String], required: true },
  answers: { type: [String], default: [] },
  transcripts: { type: [String], default: [] },
  score: { type: Number, default: 0 },
  feedback: {
    confidence: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    technical: { type: Number, default: 0 },
    clarity: { type: Number, default: 0 },
    suggestions: { type: [String], default: [] },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IInterview>('Interview', InterviewSchema);
