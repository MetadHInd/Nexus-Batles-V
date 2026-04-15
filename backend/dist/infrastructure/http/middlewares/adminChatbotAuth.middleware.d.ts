import { NextFunction, Request, Response } from 'express';
export interface AdminChatbotRequest extends Request {
    admin?: {
        username: string;
    };
}
export declare function createAdminChatbotSession(username: string): string;
export declare function destroyAdminChatbotSession(token: string): void;
export declare function adminChatbotAuthMiddleware(req: AdminChatbotRequest, res: Response, next: NextFunction): void;
//# sourceMappingURL=adminChatbotAuth.middleware.d.ts.map