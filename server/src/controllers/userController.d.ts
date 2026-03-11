import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare const getUserProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUserHistory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUserStats: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map