"use strict";
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
exports.playerController = exports.PlayerController = void 0;
var MySQLPlayerRepository_1 = require("../repositories/MySQLPlayerRepository");
var logger_1 = require("../logging/logger");
var PlayerController = /** @class */ (function () {
    function PlayerController() {
    }
    // ── GET /api/v1/players/rankings ────────────────────────────────────────────
    PlayerController.prototype.getRankings = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var limit, offset, players, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        limit = Math.min(parseInt(req.query.limit) || 50, 100);
                        offset = parseInt(req.query.offset) || 0;
                        return [4 /*yield*/, MySQLPlayerRepository_1.playerRepository.findRankings(limit, offset)];
                    case 1:
                        players = _a.sent();
                        res.json({
                            success: true,
                            data: players.map(function (p) {
                                var _a;
                                return ({
                                    id: p.id,
                                    username: p.username,
                                    role: p.role,
                                    rank: p.rank,
                                    gold: p.coins,
                                    xp: (_a = p.xp) !== null && _a !== void 0 ? _a : 0,
                                });
                            }),
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
    // ── GET /api/v1/players/me ───────────────────────────────────────────────────
    PlayerController.prototype.getMe = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, player, err_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        if (!userId) {
                            res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, MySQLPlayerRepository_1.playerRepository.findById(userId)];
                    case 1:
                        player = _c.sent();
                        if (!player) {
                            res.status(404).json({ success: false, error: 'PLAYER_NOT_FOUND' });
                            return [2 /*return*/];
                        }
                        // Nunca exponer passwordHash
                        res.json({
                            success: true,
                            data: {
                                id: player.id,
                                username: player.username,
                                email: player.email,
                                role: player.role,
                                rank: player.rank,
                                gold: player.coins,
                                xp: (_b = player.xp) !== null && _b !== void 0 ? _b : 0,
                                createdAt: player.createdAt,
                            },
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _c.sent();
                        next(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ── PATCH /api/v1/players/me ─────────────────────────────────────────────────
    PlayerController.prototype.updateMe = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, username, updated, err_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        username = req.body.username;
                        // Solo se permite cambiar el username por ahora
                        if (!username || typeof username !== 'string' || username.trim().length < 3) {
                            res.status(400).json({
                                success: false,
                                error: 'VALIDATION_ERROR',
                                message: 'El username debe tener al menos 3 caracteres',
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, MySQLPlayerRepository_1.playerRepository.updateUsername(userId, username.trim())];
                    case 1:
                        updated = _b.sent();
                        if (!updated) {
                            res.status(409).json({ success: false, error: 'USERNAME_TAKEN' });
                            return [2 /*return*/];
                        }
                        logger_1.logger.info('PlayerController.updateMe', { userId: userId, username: username });
                        res.json({
                            success: true,
                            data: { username: username.trim() },
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _b.sent();
                        next(err_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ── GET /api/v1/players/me/inventory ─────────────────────────────────────────
    PlayerController.prototype.getInventory = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, items, err_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        return [4 /*yield*/, MySQLPlayerRepository_1.playerRepository.findInventory(userId)];
                    case 1:
                        items = _b.sent();
                        res.json({
                            success: true,
                            data: items.map(function (item) {
                                var _a, _b, _c, _d, _e, _f, _g, _h;
                                return ({
                                    id: item.id,
                                    ownerId: item.player_id,
                                    name: item.name,
                                    description: (_b = (_a = item.metadata) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : '',
                                    type: (_d = (_c = item.metadata) === null || _c === void 0 ? void 0 : _c.type) !== null && _d !== void 0 ? _d : 'ARTIFACT',
                                    rarity: item.rarity,
                                    stats: (_f = (_e = item.metadata) === null || _e === void 0 ? void 0 : _e.stats) !== null && _f !== void 0 ? _f : {},
                                    isEquipped: (_h = (_g = item.metadata) === null || _g === void 0 ? void 0 : _g.isEquipped) !== null && _h !== void 0 ? _h : false,
                                    acquiredAt: item.acquired_at,
                                });
                            }),
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _b.sent();
                        next(err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ── GET /api/v1/players/:id ──────────────────────────────────────────────────
    PlayerController.prototype.getById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var player, err_5;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, MySQLPlayerRepository_1.playerRepository.findById(req.params.id)];
                    case 1:
                        player = _b.sent();
                        if (!player) {
                            res.status(404).json({ success: false, error: 'PLAYER_NOT_FOUND' });
                            return [2 /*return*/];
                        }
                        // Vista pública: sin email ni passwordHash
                        res.json({
                            success: true,
                            data: {
                                id: player.id,
                                username: player.username,
                                role: player.role,
                                rank: player.rank,
                                gold: player.coins,
                                xp: (_a = player.xp) !== null && _a !== void 0 ? _a : 0,
                            },
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _b.sent();
                        next(err_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return PlayerController;
}());
exports.PlayerController = PlayerController;
exports.playerController = new PlayerController();
