"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheAdminService = void 0;
exports.getGlobalRedisCacheInstance = getGlobalRedisCacheInstance;
var common_1 = require("@nestjs/common");
var redis_cache_service_1 = require("../redis-cache.service");
// Instancia singleton para uso global
var globalRedisCacheInstance = null;
function getGlobalRedisCacheInstance() {
    if (!globalRedisCacheInstance) {
        globalRedisCacheInstance = new redis_cache_service_1.RedisCacheService();
    }
    return globalRedisCacheInstance;
}
/**
 * 🗂️ SERVICIO DE ADMINISTRACIÓN DE CACHE
 *
 * Proporciona operaciones simplificadas para gestionar el cache desde el frontend:
 * - Obtener/Establecer/Eliminar valores individuales
 * - Buscar claves por patrón
 * - Limpiar cache por criterios
 * - Estadísticas globales del cache
 */
var CacheAdminService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CacheAdminService = _classThis = /** @class */ (function () {
        function CacheAdminService_1() {
            this.logger = new common_1.Logger(CacheAdminService.name);
            this.cache = getGlobalRedisCacheInstance();
        }
        /**
         * Obtener valor de una clave específica
         */
        CacheAdminService_1.prototype.getCacheValue = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.cache.get(key)];
                });
            });
        };
        /**
         * Establecer valor en cache
         */
        CacheAdminService_1.prototype.setCacheValue = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cache.set({ key: dto.key }, dto.value, dto.ttl)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Cache key '".concat(dto.key, "' set successfully").concat(dto.ttl ? " with TTL ".concat(dto.ttl, "s") : ''),
                                }];
                    }
                });
            });
        };
        /**
         * Eliminar una clave específica
         */
        CacheAdminService_1.prototype.deleteCacheKey = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cache.delete(key)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Cache key '".concat(key, "' deleted successfully"),
                                }];
                    }
                });
            });
        };
        /**
         * Buscar claves por patrón
         */
        CacheAdminService_1.prototype.findKeysByPattern = function (pattern) {
            return __awaiter(this, void 0, void 0, function () {
                var redis;
                return __generator(this, function (_a) {
                    redis = this.cache['redis'];
                    if (!redis) {
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var keys = [];
                            var stream = redis.scanStream({
                                match: pattern,
                                count: 100,
                            });
                            stream.on('data', function (resultKeys) {
                                keys.push.apply(keys, resultKeys);
                            });
                            stream.on('end', function () {
                                resolve(keys);
                            });
                            stream.on('error', function (err) {
                                reject(err);
                            });
                        })];
                });
            });
        };
        /**
         * Eliminar claves por patrón
         */
        CacheAdminService_1.prototype.deleteByPattern = function (pattern) {
            return __awaiter(this, void 0, void 0, function () {
                var keys;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findKeysByPattern(pattern)];
                        case 1:
                            keys = _a.sent();
                            if (keys.length === 0) {
                                return [2 /*return*/, { success: true, deletedCount: 0 }];
                            }
                            return [4 /*yield*/, Promise.all(keys.map(function (key) { return _this.cache.delete(key); }))];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    deletedCount: keys.length,
                                }];
                    }
                });
            });
        };
        /**
         * Limpiar cache según criterios
         */
        CacheAdminService_1.prototype.clearCache = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var deletedCount, result, result, redis;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            deletedCount = 0;
                            if (!dto.paginationOnly) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.deleteByPattern('*_paginated_*')];
                        case 1:
                            result = _a.sent();
                            deletedCount = result.deletedCount;
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Cleared ".concat(deletedCount, " pagination cache entries"),
                                    deletedCount: deletedCount,
                                }];
                        case 2:
                            if (!dto.pattern) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.deleteByPattern(dto.pattern)];
                        case 3:
                            result = _a.sent();
                            deletedCount = result.deletedCount;
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Cleared ".concat(deletedCount, " cache entries matching pattern '").concat(dto.pattern, "'"),
                                    deletedCount: deletedCount,
                                }];
                        case 4:
                            redis = this.cache['redis'];
                            if (!redis) return [3 /*break*/, 6];
                            return [4 /*yield*/, redis.flushdb()];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'All cache cleared successfully',
                                    deletedCount: -1, // No podemos saber cuántas claves había
                                }];
                        case 6: return [2 /*return*/, {
                                success: false,
                                message: 'Redis not connected',
                                deletedCount: 0,
                            }];
                    }
                });
            });
        };
        /**
         * Obtener estadísticas del cache
         */
        CacheAdminService_1.prototype.getCacheStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                var redis, dbsize, info, memoryMatch, memoryUsage, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            redis = this.cache['redis'];
                            if (!redis) {
                                return [2 /*return*/, {
                                        totalKeys: 0,
                                        memoryUsage: 0,
                                        connected: false,
                                    }];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, redis.dbsize()];
                        case 2:
                            dbsize = _a.sent();
                            return [4 /*yield*/, redis.info('memory')];
                        case 3:
                            info = _a.sent();
                            memoryMatch = info.match(/used_memory:(\d+)/);
                            memoryUsage = memoryMatch ? parseInt(memoryMatch[1]) : 0;
                            return [2 /*return*/, {
                                    totalKeys: dbsize,
                                    memoryUsage: memoryUsage,
                                    connected: true,
                                    serverInfo: {
                                        memory: this.formatBytes(memoryUsage),
                                        keys: dbsize,
                                    },
                                }];
                        case 4:
                            error_1 = _a.sent();
                            this.logger.error('Error getting cache stats:', error_1);
                            return [2 /*return*/, {
                                    totalKeys: 0,
                                    memoryUsage: 0,
                                    connected: false,
                                }];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Listar todas las claves (con límite)
         */
        CacheAdminService_1.prototype.listAllKeys = function () {
            return __awaiter(this, arguments, void 0, function (limit) {
                if (limit === void 0) { limit = 100; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.findKeysByPattern('*').then(function (keys) { return keys.slice(0, limit); })];
                });
            });
        };
        /**
         * Helper: formatear bytes a tamaño legible
         */
        CacheAdminService_1.prototype.formatBytes = function (bytes) {
            if (bytes === 0)
                return '0 Bytes';
            var k = 1024;
            var sizes = ['Bytes', 'KB', 'MB', 'GB'];
            var i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        };
        return CacheAdminService_1;
    }());
    __setFunctionName(_classThis, "CacheAdminService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CacheAdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CacheAdminService = _classThis;
}();
exports.CacheAdminService = CacheAdminService;
