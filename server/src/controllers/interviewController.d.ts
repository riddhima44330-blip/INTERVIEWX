import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare const startInterview: (req: AuthRequest, res: Response) => Promise<void>;
export declare const answerQuestion: (req: AuthRequest, res: Response) => Promise<void>;
export declare const finishInterview: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=interviewController.d.ts.map