/**
 * PlayerController.ts — Infrastructure / Controllers
 * Implementa todos los endpoints de /api/v1/players que estaban en 501.
 *
 * Endpoints que cubre:
 *   GET  /players/rankings         → playerController.getRankings
 *   GET  /players/me               → playerController.getMe
 *   PATCH /players/me              → playerController.updateMe
 *   GET  /players/me/inventory     → playerController.getInventory
 *   GET  /players/:id              → playerController.getById
 *
 * NOTA: Este controlador lee directamente de los repositorios MySQL.
 * El equipo de dominio puede extraerlos a use cases en la siguiente iteración.
 */
import { Request, Response, NextFunction } from 'express';
export declare class PlayerController {
    getRankings(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMe(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateMe(req: Request, res: Response, next: NextFunction): Promise<void>;
    getInventory(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const playerController: PlayerController;
//# sourceMappingURL=PlayerController.d.ts.map