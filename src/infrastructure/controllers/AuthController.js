"use strict";
/**
 * AuthController.ts — Infrastructure / Controllers
 * Maneja register, login, logout y refresh de tokens.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
var RegisterUseCase_1 = require("../../application/usecases/auth/RegisterUseCase");
var LoginUseCase_1 = require("../../application/usecases/auth/LoginUseCase");
var MySQLPlayerRepository_1 = require("../repositories/MySQLPlayerRepository");
var jwt_1 = require("../security/jwt");
var DomainError_1 = require("../../domain/errors/DomainError");
var registerUseCase = new RegisterUseCase_1.RegisterUseCase(MySQLPlayerRepository_1.playerRepository);
var loginUseCase = new LoginUseCase_1.LoginUseCase(MySQLPlayerRepository_1.playerRepository);
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    // POST /api/v1/auth/register
    AuthController.prototype.register = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var player, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, registerUseCase.execute(req.body)];
                    case 1:
                        player = _a.sent();
                        res.status(201).json({
                            success: true,
                            data: {
                                id: player.id,
                                username: player.username,
                                email: player.email,
                            },
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        next(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/v1/auth/login
    AuthController.prototype.login = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var player, accessToken, refreshToken, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, loginUseCase.execute(req.body)];
                    case 1:
                        player = _a.sent();
                        accessToken = (0, jwt_1.signAccessToken)({ sub: player.id, role: player.role });
                        refreshToken = (0, jwt_1.signRefreshToken)(player.id);
                        res.json({
                            success: true,
                            data: {
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                                player: {
                                    id: player.id,
                                    username: player.username,
                                    role: player.role,
                                },
                            },
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        if (err_2 instanceof DomainError_1.DomainError && err_2.code === 'UNAUTHORIZED') {
                            res.status(401).json({ success: false, error: 'INVALID_CREDENTIALS', message: err_2.message });
                            return [2 /*return*/];
                        }
                        next(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/v1/auth/logout
    AuthController.prototype.logout = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Sin Redis/blacklist por ahora — el cliente borra sus tokens
                res.json({ success: true });
                return [2 /*return*/];
            });
        });
    };
    // POST /api/v1/auth/refresh
    AuthController.prototype.refresh = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var refreshToken, payload, player, accessToken, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        refreshToken = req.body.refreshToken;
                        if (!refreshToken) {
                            res.status(400).json({ success: false, error: 'REFRESH_TOKEN_REQUIRED' });
                            return [2 /*return*/];
                        }
                        payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
                        return [4 /*yield*/, MySQLPlayerRepository_1.playerRepository.findById(payload.sub)];
                    case 1:
                        player = _a.sent();
                        if (!player) {
                            res.status(401).json({ success: false, error: 'INVALID_TOKEN' });
                            return [2 /*return*/];
                        }
                        accessToken = (0, jwt_1.signAccessToken)({ sub: player.id, role: player.role });
                        res.json({ success: true, data: { accessToken: accessToken } });
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        res.status(401).json({ success: false, error: 'INVALID_TOKEN' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AuthController;
}());
exports.AuthController = AuthController;
exports.authController = new AuthController();
