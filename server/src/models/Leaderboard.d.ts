import mongoose, { Document } from 'mongoose';
export interface ILeaderboard extends Document {
    userId: mongoose.Types.ObjectId;
    xp: number;
    lastUpdated: Date;
}
declare const _default: mongoose.Model<ILeaderboard, {}, {}, {}, mongoose.Document<unknown, {}, ILeaderboard, {}, {}> & ILeaderboard & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Leaderboard.d.ts.map