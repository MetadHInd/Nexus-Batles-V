"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const DomainError_1 = require("../../../domain/errors/DomainError");
class AuthController {
    constructor(registerUser, loginUser) {
        this.registerUser = registerUser;
        this.loginUser = loginUser;
        this.register = async (req, res, next) => {
            try {
                const result = await this.registerUser.execute(req.body);
                res.status(201).json({ success: true, data: result });
            }
            catch (err) {
                next(err);
            }
        };
        this.login = async (req, res, next) => {
            try {
                const ip = req.ip ?? '';
                const userAgent = req.headers['user-agent'] ?? '';
                const result = await this.loginUser.execute(req.body, ip, userAgent);
                res.json({ success: true, data: result });
            }
            catch (err) {
                if (err instanceof DomainError_1.DomainError && err.code === 'UNAUTHORIZED') {
                    res.status(401).json({ success: false, error: 'INVALID_CREDENTIALS', message: err.message });
                    return;
                }
                next(err);
            }
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map