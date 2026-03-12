import { Request, Response, NextFunction } from 'express';
export declare class PlayerController {
    getRankings(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMe(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateMe(req: Request, res: Response, next: NextFunction): Promise<void>;
    getInventory(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const playerController: PlayerController;
