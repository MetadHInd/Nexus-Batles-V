import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        apodo: string;
        rol: 'PLAYER' | 'ADMIN' | 'MODERATOR';
    };
}
export declare const authenticateJWT: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const requireRole: (...roles: Array<"PLAYER" | "ADMIN" | "MODERATOR">) => (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map