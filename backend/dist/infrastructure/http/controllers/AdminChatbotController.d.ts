import { NextFunction, Request, Response } from 'express';
import { AdminChatbotRequest } from '../middlewares/adminChatbotAuth.middleware';
export declare class AdminChatbotController {
    private auditTableReady;
    login: (req: Request, res: Response, _next: NextFunction) => Promise<void>;
    logout: (req: Request, res: Response) => Promise<void>;
    listKnowledgeBase: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getKnowledgeBaseByCategory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createKnowledgeBaseEntry: (req: AdminChatbotRequest, res: Response, next: NextFunction) => Promise<void>;
    updateKnowledgeBaseEntry: (req: AdminChatbotRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteKnowledgeBaseEntry: (req: AdminChatbotRequest, res: Response, next: NextFunction) => Promise<void>;
    getLogs: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBackups: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    private normalizeCategory;
    private getFileNameByCategory;
    private getCategoryFilePath;
    private readCategory;
    private writeCategory;
    private parseDatos;
    private getSubcategoryByCategory;
    private getStableEntryId;
    private stripInternalId;
    private extractName;
    private resolveTargetEntryId;
    private normalizeIncomingEntry;
    private ensureEntryIdentifier;
    private findEntryIndex;
    private getEntryDescriptor;
    private ensureAuditTable;
    private insertAuditLog;
}
//# sourceMappingURL=AdminChatbotController.d.ts.map