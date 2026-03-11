import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaderboard extends Document {
  userId: mongoose.Types.ObjectId;
  xp: number;
  lastUpdated: Date;
}

const LeaderboardSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  xp: { type: Number, required: true, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);
