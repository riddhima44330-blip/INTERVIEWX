import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  xp: number;
  streak: number;
  badges: string[];
  level: number;
  interviewHistory: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  level: { type: Number, default: 1 },
  interviewHistory: [{ type: Schema.Types.ObjectId, ref: 'Interview' }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
