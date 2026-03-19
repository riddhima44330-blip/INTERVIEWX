import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
  userId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface ICommunityPost extends Document {
  userId: mongoose.Types.ObjectId;
  question: string;
  domain: string;
  level: number | string;
  likes: mongoose.Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CommunityPostSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  domain: { type: String, required: true },
  level: { type: Schema.Types.Mixed, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICommunityPost>('CommunityPost', CommunityPostSchema);
