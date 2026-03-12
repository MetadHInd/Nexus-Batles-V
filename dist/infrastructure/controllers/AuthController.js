"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const RegisterUseCase_1 = require("../../application/usecases/auth/RegisterUseCase");
const LoginUseCase_1 = require("../../application/usecases/auth/LoginUseCase");
const MySQLPlayerRepository_1 = require("../repositories/MySQLPlayerRepository");
const jwt_1 = require("../security/jwt");
const DomainError_1 = require("../../domain/errors/DomainError");
const registerUseCase = new RegisterUseCase_1.RegisterUseCase(MySQLPlayerRepository_1.playerRepository);
const loginUseCase = new LoginUseCase_1.LoginUseCase(MySQLPlayerRepository_1.playerRepository);
class AuthController {
    async register(req, res, next) {
        try {
            const player = await registerUseCase.execute(req.body);
            res.status(201).json({
                success: true,
                data: {
                    id: player.id,
                    username: player.username,
                    email: player.email,
                },
            });
        }
        catch (err) {
            next(err);
        }
    }
    async login(req, res, next) {
        try {
            const player = await loginUseCase.execute(req.body);
            const accessToken = (0, jwt_1.signAccessToken)({ sub: player.id, role: player.role });
            const refreshToken = (0, jwt_1.signRefreshToken)(player.id);
            res.json({
                success: true,
                data: {
                    accessToken,
                    refreshToken,
                    player: {
                        id: player.id,
                        username: player.username,
                        role: player.role,
                    },
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
    async logout(req, res) {
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
        catch (err) {
            res.status(401).json({ success: false, error: 'INVALID_TOKEN' });
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=AuthController.js.map