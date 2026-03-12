"use strict";
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
exports.BaseCacheService = void 0;
var BaseCacheService = /** @class */ (function () {
    function BaseCacheService(cache) {
        this.cache = cache;
    }
    BaseCacheService.prototype.tryCacheOrExecute = function (key, params, shouldCache, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var cached, result, firstItem, ttl, serialized;
            var _this = this;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!shouldCache) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cache.get(key, params)];
                    case 1:
                        cached = _e.sent();
                        if (cached) {
                            // Si es un array de objetos, devolverlo directamente
                            if (Array.isArray(cached)) {
                                return [2 /*return*/, cached];
                            }
                            // Para objetos individuales, devolverlos directamente
                            // El UserProfileService se encargará de la reconstrucción específica
                            return [2 /*return*/, cached];
                        }
                        _e.label = 2;
                    case 2: return [4 /*yield*/, callback()];
                    case 3:
                        result = _e.sent();
                        if (!shouldCache) return [3 /*break*/, 12];
                        if (!Array.isArray(result)) return [3 /*break*/, 8];
                        firstItem = result[0];
                        if (!(firstItem && this.isCacheable(firstItem))) return [3 /*break*/, 5];
                        ttl = (_b = (_a = firstItem.cacheTTL) === null || _a === void 0 ? void 0 : _a.call(firstItem)) !== null && _b !== void 0 ? _b : 300;
                        serialized = result.map(function (item) {
                            return _this.isCacheable(item) ? item.toJSON() : item;
                        });
                        return [4 /*yield*/, this.cache.set({ key: key, params: params }, serialized, ttl)];
                    case 4:
                        _e.sent();
                        return [3 /*break*/, 7];
                    case 5: 
                    // Array simple, cachear directamente
                    return [4 /*yield*/, this.cache.set({ key: key, params: params }, result, 300)];
                    case 6:
                        // Array simple, cachear directamente
                        _e.sent();
                        _e.label = 7;
                    case 7: return [3 /*break*/, 12];
                    case 8:
                        if (!this.isCacheable(result)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.cache.set({ key: key, params: params }, result.toJSON(), (_d = (_c = result.cacheTTL) === null || _c === void 0 ? void 0 : _c.call(result)) !== null && _d !== void 0 ? _d : 300)];
                    case 9:
                        _e.sent();
                        return [3 /*break*/, 12];
                    case 10:
                        if (!(result !== null && result !== undefined)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.cache.set({ key: key, params: params }, result, 300)];
                    case 11:
                        _e.sent();
                        _e.label = 12;
                    case 12: return [2 /*return*/, result];
                }
            });
        });
    };
    // Métodos auxiliares para el manejo de cache
    BaseCacheService.prototype.cacheSet = function (key, params, value, ttl) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache.set({ key: key, params: params }, value, ttl)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseCacheService.prototype.cacheGet = function (key, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache.get(key, params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BaseCacheService.prototype.cacheDelete = function (key, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache.delete(key, params)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseCacheService.prototype.isCacheable = function (obj) {
        return (obj !== null &&
            obj !== undefined &&
            typeof obj.cacheKey === 'function' &&
            typeof obj.toJSON === 'function');
    };
    return BaseCacheService;
}());
exports.BaseCacheService = BaseCacheService;
