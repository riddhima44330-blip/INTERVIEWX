import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionBank extends Document {
  domain: string;
  level: string; // 'Beginner', 'Intermediate', 'Advanced'
  questionList: string[];
}

const QuestionBankSchema: Schema = new Schema({
  domain: { type: String, required: true },
  level: { type: String, required: true },
  questionList: { type: [String], required: true },
});

export default mongoose.model<IQuestionBank>('QuestionBank', QuestionBankSchema);
