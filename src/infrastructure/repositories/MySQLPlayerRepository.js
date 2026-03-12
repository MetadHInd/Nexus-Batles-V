"use strict";
/**
 * MySQLPlayerRepository.ts — Infrastructure / Repositories
 * Implementación MySQL de IPlayerRepository.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.playerRepository = void 0;
var connection_1 = require("../database/connection");
var crypto_1 = require("crypto");
var MySQLPlayerRepository = /** @class */ (function () {
    function MySQLPlayerRepository() {
    }
    MySQLPlayerRepository.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection_1.pool.execute('SELECT * FROM players WHERE id = ? LIMIT 1', [id])];
                    case 1:
                        rows = (_a.sent())[0];
                        if (!rows.length)
                            return [2 /*return*/, null];
                        return [2 /*return*/, this._map(rows[0])];
                }
            });
        });
    };
    MySQLPlayerRepository.prototype.findByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection_1.pool.execute('SELECT * FROM players WHERE email = ? LIMIT 1', [email])];
                    case 1:
                        rows = (_a.sent())[0];
                        if (!rows.length)
                            return [2 /*return*/, null];
                        return [2 /*return*/, this._map(rows[0])];
                }
            });
        });
    };
    MySQLPlayerRepository.prototype.findByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection_1.pool.execute('SELECT * FROM players WHERE username = ? LIMIT 1', [username])];
                    case 1:
                        rows = (_a.sent())[0];
                        if (!rows.length)
                            return [2 /*return*/, null];
                        return [2 /*return*/, this._map(rows[0])];
                }
            });
        });
    };
    MySQLPlayerRepository.prototype.save = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var id, player;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = (0, crypto_1.randomUUID)();
                        return [4 /*yield*/, connection_1.pool.execute("INSERT INTO players (id, username, email, password_hash, role, `rank`, coins)\n       VALUES (?, ?, ?, ?, ?, ?, ?)", [id, data.username, data.email, data.passwordHash, data.role, data.rank, data.coins])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.findById(id)];
                    case 2:
                        player = _a.sent();
                        return [2 /*return*/, player];
                }
            });
        });
    };
    MySQLPlayerRepository.prototype.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, values, player;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fields = [];
                        values = [];
                        if (data.username) {
                            fields.push('username = ?');
                            values.push(data.username);
                        }
                        if (data.passwordHash) {
                            fields.push('password_hash = ?');
                            values.push(data.passwordHash);
                        }
                        if (data.role) {
                            fields.push('role = ?');
                            values.push(data.role);
                        }
                        if (data.rank != null) {
                            fields.push('`rank` = ?');
                            values.push(data.rank);
                        }
                        if (data.coins != null) {
                            fields.push('coins = ?');
                            values.push(data.coins);
                        }
                        if (!fields.length) return [3 /*break*/, 2];
                        fields.push('updated_at = NOW()');
                        values.push(id);
                        return [4 /*yield*/, connection_1.pool.execute("UPDATE players SET ".concat(fields.join(', '), " WHERE id = ?"), values)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.findById(id)];
                    case 3:
                        player = _a.sent();
                        return [2 /*return*/, player];
                }
            });
        });
    };
    MySQLPlayerRepository.prototype.updateRank = function (id, newRank) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection_1.pool.execute('UPDATE players SET `rank` = ?, updated_at = NOW() WHERE id = ?', [newRank, id])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MySQLPlayerRepository.prototype.getRankings = function (limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection_1.pool.execute('SELECT * FROM players ORDER BY `rank` DESC LIMIT ? OFFSET ?', [limit, offset])];
                    case 1:
                        rows = (_a.sent())[0];
                        return [2 /*return*/, rows.map(function (r) { return _this._map(r); })];
                }
            });
        });
    };
    MySQLPlayerRepository.prototype.findRankings = function (limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getRankings(limit, offset)];
            });
        });
    };
    MySQLPlayerRepository.prototype.findInventory = function (playerId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection_1.pool.execute("SELECT id, player_id, name, rarity, metadata, acquired_at\n       FROM inventory_items\n       WHERE player_id = ?\n       ORDER BY acquired_at DESC", [playerId])];
                    case 1:
                        rows = (_a.sent())[0];
                        return [2 /*return*/, rows.map(function (r) { return (__assign(__assign({}, r), { metadata: r.metadata ? (typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata) : {} })); })];
                }
            });
        });
    };
    MySQLPlayerRepository.prototype.updateUsername = function (playerId, username) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, connection_1.pool.execute('UPDATE players SET username = ?, updated_at = NOW() WHERE id = ?', [username, playerId])];
                    case 1:
                        result = (_a.sent())[0];
                        return [2 /*return*/, result.affectedRows > 0];
                    case 2:
                        err_1 = _a.sent();
                        if (err_1.code === 'ER_DUP_ENTRY')
                            return [2 /*return*/, false];
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MySQLPlayerRepository.prototype.addCoins = function (playerId, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection_1.pool.execute('UPDATE players SET coins = coins + ?, updated_at = NOW() WHERE id = ?', [amount, playerId])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MySQLPlayerRepository.prototype._map = function (row) {
        return {
            id: row.id,
            username: row.username,
            email: row.email,
            passwordHash: row.password_hash,
            role: row.role,
            rank: row.rank,
            coins: row.coins,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    };
    return MySQLPlayerRepository;
}());
exports.playerRepository = new MySQLPlayerRepository();
