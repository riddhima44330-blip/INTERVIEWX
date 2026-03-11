import mongoose, { Document } from 'mongoose';
export interface IInterview extends Document {
    userId: mongoose.Types.ObjectId;
    domain: string;
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
declare const _default: mongoose.Model<IInterview, {}, {}, {}, mongoose.Document<unknown, {}, IInterview, {}, {}> & IInterview & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Interview.d.ts.map