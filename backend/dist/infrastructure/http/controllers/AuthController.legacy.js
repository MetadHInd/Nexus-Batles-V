"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const MySQLPlayerRepository_1 = require("../../repositories/MySQLPlayerRepository");
const jwt_1 = require("../../security/jwt");
const DomainError_1 = require("../../../domain/errors/DomainError");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthControllerLegacy {
    async register(req, res, next) {
        try {
            const { username, email, password } = req.body;
            const existing = await MySQLPlayerRepository_1.playerRepository.findByEmail(email);
            if (existing) {
                res.status(409).json({ success: false, error: 'EMAIL_TAKEN' });
                return;
            }
            const passwordHash = await bcrypt_1.default.hash(password, 12);
            const player = await MySQLPlayerRepository_1.playerRepository.save({ username, email, passwordHash, role: 'PLAYER', rank: 0, coins: 0 });
            res.status(201).json({
                success: true,
                data: { id: player.id, username: player.username, email: player.email },
            });
        }
        catch (err) {
            next(err);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const player = await MySQLPlayerRepository_1.playerRepository.findByEmail(email);
            if (!player || !(await bcrypt_1.default.compare(password, player.passwordHash))) {
                res.status(401).json({ success: false, error: 'INVALID_CREDENTIALS' });
                return;
            }
            const accessToken = (0, jwt_1.signAccessToken)({ sub: player.id, role: player.role });
            const refreshToken = (0, jwt_1.signRefreshToken)(player.id);
            res.json({
                success: true,
                data: {
                    accessToken, refreshToken,
                    player: { id: player.id, username: player.username, role: player.role },
                },
            });
        }
        catch (err) {
            if (err instanceof DomainError_1.DomainError && err.code === 'UNAUTHORIZED') {
                res.status(401).json({ success: false, error: 'INVALID_CREDENTIALS', message: err.message });
                return;
            }
            next(err);
        }
    }
    async logout(_req, res) {
        res.json({ success: true });
    }
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({ success: false, error: 'REFRESH_TOKEN_REQUIRED' });
                return;
            }
            const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
            const player = await MySQLPlayerRepository_1.playerRepository.findById(payload.sub);
            if (!player) {
                res.status(401).json({ success: false, error: 'INVALID_TOKEN' });
                return;
            }
            const accessToken = (0, jwt_1.signAccessToken)({ sub: player.id, role: player.role });
            res.json({ success: true, data: { accessToken } });
        }
        catch {
            res.status(401).json({ success: false, error: 'INVALID_TOKEN' });
        }
    }
}
exports.authController = new AuthControllerLegacy();
//# sourceMappingURL=AuthController.legacy.js.map