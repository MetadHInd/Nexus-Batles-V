/**
 * AuthController.ts — Infrastructure / HTTP / Controllers
 * Controlador de Auth para el flujo de User (apodo/nombres) — v2.
 * Recibe sus dependencias por DI desde server.ts.
 *
 * FIXES:
 *  - Eliminado import duplicado de LoginUseCase
 *  - RegisterUseCase/LoginUseCase (no existen) → RegisterUser/LoginUser
 *  - Eliminada instancia interna de playerRepository (no aplica aquí)
 *  - Métodos como arrow functions para preservar 'this' al pasarlos como handlers
 */
import { Request, Response, NextFunction } from 'express';
import { RegisterUser } from '../../../application/usecases/auth/RegisterUser';
import { LoginUser } from '../../../application/usecases/auth/LoginUser';
export declare class AuthController {
    private readonly registerUser;
    private readonly loginUser;
    constructor(registerUser: RegisterUser, loginUser: LoginUser);
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map