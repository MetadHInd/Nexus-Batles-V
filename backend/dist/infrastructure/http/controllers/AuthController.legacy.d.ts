/**
 * AuthController.legacy.ts — Infrastructure / HTTP / Controllers
 * Controlador de Auth para el flujo de Player (v1).
 * Exporta singleton `authController` usado por authRoutes.ts
 *
 * FIXES:
 *  - Renombrado de AuthController para evitar colisión con AuthController.ts (v2)
 *  - Importa playerRepository desde '../repositories/MySQLPlayerRepository' (ruta correcta)
 *  - Usa bcrypt directamente (no RegisterUseCase/LoginUseCase que no existen)
 */
import { Request, Response, NextFunction } from 'express';
declare class AuthControllerLegacy {
    register(req: Request, res: Response, next: NextFunction): Promise<void>;
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    logout(_req: Request, res: Response): Promise<void>;
    refresh(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const authController: AuthControllerLegacy;
export {};
//# sourceMappingURL=AuthController.legacy.d.ts.map