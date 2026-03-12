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
exports.CacheManagementService = void 0;
var common_1 = require("@nestjs/common");
var CacheManagementService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CacheManagementService = _classThis = /** @class */ (function () {
        function CacheManagementService_1(cacheService) {
            this.cacheService = cacheService;
            this.logger = new common_1.Logger(CacheManagementService.name);
        }
        /**
         * Obtiene el tenant_id del contexto global
         */
        CacheManagementService_1.prototype.getTenantId = function () {
            var _a;
            try {
                var request = global.currentRequest;
                if ((_a = request === null || request === void 0 ? void 0 : request.selectedRestaurant) === null || _a === void 0 ? void 0 : _a.database_connection) {
                    return request.selectedRestaurant.database_connection;
                }
            }
            catch (_b) {
                // Ignorar errores
            }
            return null;
        };
        /**
         * Limpia el caché según los parámetros proporcionados
         */
        CacheManagementService_1.prototype.clearCache = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var tenantId, totalKeysDeleted, details, allKeys, keys_1, _i, _a, module_1, pattern_1, keys_2, keysCount, pattern, keys, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.logger.log('🧹 Starting cache clearing operation');
                            this.logger.log("\uD83D\uDCCB Parameters: ".concat(JSON.stringify(dto)));
                            tenantId = dto.tenantId || this.getTenantId() || 'global';
                            totalKeysDeleted = 0;
                            details = {};
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 20, , 21]);
                            if (!dto.clearAll) return [3 /*break*/, 5];
                            this.logger.log('🔥 Clearing ALL cache');
                            return [4 /*yield*/, this.cacheService.getKeys('*')];
                        case 2:
                            allKeys = _b.sent();
                            if (!(allKeys.length > 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.cacheService.deletePattern('*')];
                        case 3:
                            _b.sent();
                            totalKeysDeleted = allKeys.length;
                            _b.label = 4;
                        case 4: return [2 /*return*/, {
                                success: true,
                                message: 'Todo el caché ha sido limpiado exitosamente',
                                keysDeleted: totalKeysDeleted,
                                tenantId: tenantId,
                            }];
                        case 5:
                            if (!dto.customPattern) return [3 /*break*/, 9];
                            this.logger.log("\uD83C\uDFAF Using custom pattern: ".concat(dto.customPattern));
                            return [4 /*yield*/, this.cacheService.getKeys(dto.customPattern)];
                        case 6:
                            keys_1 = _b.sent();
                            if (!(keys_1.length > 0)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.cacheService.deletePattern(dto.customPattern)];
                        case 7:
                            _b.sent();
                            totalKeysDeleted = keys_1.length;
                            _b.label = 8;
                        case 8: return [2 /*return*/, {
                                success: true,
                                message: "Cach\u00E9 limpiado con pattern personalizado",
                                keysDeleted: totalKeysDeleted,
                                tenantId: tenantId,
                            }];
                        case 9:
                            if (!(dto.modules && dto.modules.length > 0)) return [3 /*break*/, 16];
                            this.logger.log("\uD83D\uDCE6 Clearing cache for modules: ".concat(dto.modules.join(', ')));
                            _i = 0, _a = dto.modules;
                            _b.label = 10;
                        case 10:
                            if (!(_i < _a.length)) return [3 /*break*/, 15];
                            module_1 = _a[_i];
                            pattern_1 = "".concat(tenantId, ":").concat(module_1, ":*");
                            this.logger.log("\uD83D\uDD0D Searching pattern: ".concat(pattern_1));
                            return [4 /*yield*/, this.cacheService.getKeys(pattern_1)];
                        case 11:
                            keys_2 = _b.sent();
                            keysCount = keys_2.length;
                            if (!(keysCount > 0)) return [3 /*break*/, 13];
                            return [4 /*yield*/, this.cacheService.deletePattern(pattern_1)];
                        case 12:
                            _b.sent();
                            details[module_1] = keysCount;
                            totalKeysDeleted += keysCount;
                            this.logger.log("\u2705 Deleted ".concat(keysCount, " keys for module: ").concat(module_1));
                            return [3 /*break*/, 14];
                        case 13:
                            details[module_1] = 0;
                            this.logger.log("\u2139\uFE0F No keys found for module: ".concat(module_1));
                            _b.label = 14;
                        case 14:
                            _i++;
                            return [3 /*break*/, 10];
                        case 15: return [2 /*return*/, {
                                success: true,
                                message: "Cach\u00E9 limpiado exitosamente para ".concat(dto.modules.length, " m\u00F3dulo(s)"),
                                keysDeleted: totalKeysDeleted,
                                details: details,
                                tenantId: tenantId,
                            }];
                        case 16:
                            // Caso 4: Limpiar todo el caché del tenant actual
                            this.logger.log("\uD83C\uDFE2 Clearing all cache for tenant: ".concat(tenantId));
                            pattern = "".concat(tenantId, ":*");
                            return [4 /*yield*/, this.cacheService.getKeys(pattern)];
                        case 17:
                            keys = _b.sent();
                            if (!(keys.length > 0)) return [3 /*break*/, 19];
                            return [4 /*yield*/, this.cacheService.deletePattern(pattern)];
                        case 18:
                            _b.sent();
                            totalKeysDeleted = keys.length;
                            _b.label = 19;
                        case 19: return [2 /*return*/, {
                                success: true,
                                message: "Todo el cach\u00E9 del tenant ha sido limpiado",
                                keysDeleted: totalKeysDeleted,
                                tenantId: tenantId,
                            }];
                        case 20:
                            error_1 = _b.sent();
                            this.logger.error("\u274C Error clearing cache: ".concat(error_1.message), error_1.stack);
                            return [2 /*return*/, {
                                    success: false,
                                    message: "Error al limpiar cach\u00E9: ".concat(error_1.message),
                                    keysDeleted: totalKeysDeleted,
                                    details: details,
                                    tenantId: tenantId,
                                }];
                        case 21: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Obtiene las claves del caché según el filtro proporcionado
         */
        CacheManagementService_1.prototype.getCacheKeys = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var tenantId, pattern, keys, totalKeys, groupedByModule_1, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log('🔍 Getting cache keys');
                            this.logger.log("\uD83D\uDCCB Parameters: ".concat(JSON.stringify(dto)));
                            tenantId = dto.tenantId || this.getTenantId() || 'global';
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            pattern = dto.pattern || '*';
                            // Si se especifica un módulo, ajustar el pattern
                            if (dto.module) {
                                pattern = "".concat(tenantId, ":").concat(dto.module, ":*");
                            }
                            else if (!dto.pattern) {
                                // Si no hay pattern ni módulo, usar tenant:*
                                pattern = "".concat(tenantId, ":*");
                            }
                            this.logger.log("\uD83D\uDD0D Using pattern: ".concat(pattern));
                            return [4 /*yield*/, this.cacheService.getKeys(pattern)];
                        case 2:
                            keys = _a.sent();
                            totalKeys = keys.length;
                            groupedByModule_1 = {};
                            keys.forEach(function (key) {
                                // Formato: tenant:module:restOfKey
                                var parts = key.split(':');
                                if (parts.length >= 2) {
                                    var module_2 = parts[1];
                                    groupedByModule_1[module_2] = (groupedByModule_1[module_2] || 0) + 1;
                                }
                            });
                            this.logger.log("\u2705 Found ".concat(totalKeys, " keys"));
                            return [2 /*return*/, {
                                    success: true,
                                    totalKeys: totalKeys,
                                    keys: keys,
                                    groupedByModule: groupedByModule_1,
                                }];
                        case 3:
                            error_2 = _a.sent();
                            this.logger.error("\u274C Error getting cache keys: ".concat(error_2.message), error_2.stack);
                            return [2 /*return*/, {
                                    success: false,
                                    totalKeys: 0,
                                    keys: [],
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Obtiene estadísticas del caché
         */
        CacheManagementService_1.prototype.getCacheStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                var allKeys, tenantId, byTenant_1, byModule_1, byTenantAndModule_1, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log('📊 Getting cache statistics');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.cacheService.getKeys('*')];
                        case 2:
                            allKeys = _a.sent();
                            tenantId = this.getTenantId() || 'global';
                            byTenant_1 = {};
                            byModule_1 = {};
                            byTenantAndModule_1 = {};
                            allKeys.forEach(function (key) {
                                var parts = key.split(':');
                                if (parts.length >= 2) {
                                    var tenant = parts[0];
                                    var module_3 = parts[1];
                                    // Por tenant
                                    byTenant_1[tenant] = (byTenant_1[tenant] || 0) + 1;
                                    // Por módulo
                                    byModule_1[module_3] = (byModule_1[module_3] || 0) + 1;
                                    // Por tenant y módulo
                                    if (!byTenantAndModule_1[tenant]) {
                                        byTenantAndModule_1[tenant] = {};
                                    }
                                    byTenantAndModule_1[tenant][module_3] =
                                        (byTenantAndModule_1[tenant][module_3] || 0) + 1;
                                }
                            });
                            return [2 /*return*/, {
                                    success: true,
                                    totalKeys: allKeys.length,
                                    currentTenant: tenantId,
                                    byTenant: byTenant_1,
                                    byModule: byModule_1,
                                    byTenantAndModule: byTenantAndModule_1,
                                }];
                        case 3:
                            error_3 = _a.sent();
                            this.logger.error("\u274C Error getting cache stats: ".concat(error_3.message), error_3.stack);
                            return [2 /*return*/, {
                                    success: false,
                                    message: "Error al obtener estad\u00EDsticas: ".concat(error_3.message),
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Lista todos los módulos disponibles en el caché
         */
        CacheManagementService_1.prototype.getAvailableModules = function () {
            return __awaiter(this, void 0, void 0, function () {
                var allKeys, modules_1, moduleList, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log('📦 Getting available modules');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.cacheService.getKeys('*')];
                        case 2:
                            allKeys = _a.sent();
                            modules_1 = new Set();
                            allKeys.forEach(function (key) {
                                var parts = key.split(':');
                                if (parts.length >= 2) {
                                    modules_1.add(parts[1]);
                                }
                            });
                            moduleList = Array.from(modules_1).sort();
                            this.logger.log("\u2705 Found ".concat(moduleList.length, " modules"));
                            return [2 /*return*/, moduleList];
                        case 3:
                            error_4 = _a.sent();
                            this.logger.error("\u274C Error getting modules: ".concat(error_4.message), error_4.stack);
                            return [2 /*return*/, []];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Obtiene el valor de una clave específica del caché
         */
        CacheManagementService_1.prototype.getCacheValue = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var value, parsedValue, ttl, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("\uD83D\uDD0D Getting cache value for key: ".concat(key));
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            if (!this.cacheService.redis) {
                                return [2 /*return*/, {
                                        success: false,
                                        message: 'Redis no está disponible',
                                        key: key,
                                    }];
                            }
                            return [4 /*yield*/, this.cacheService.redis.get(key)];
                        case 2:
                            value = _a.sent();
                            if (!value) {
                                return [2 /*return*/, {
                                        success: false,
                                        message: 'Clave no encontrada',
                                        key: key,
                                    }];
                            }
                            parsedValue = void 0;
                            try {
                                parsedValue = JSON.parse(value);
                            }
                            catch (_b) {
                                parsedValue = value; // Si no es JSON, devolver el valor raw
                            }
                            return [4 /*yield*/, this.cacheService.redis.ttl(key)];
                        case 3:
                            ttl = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    key: key,
                                    value: parsedValue,
                                    rawValue: value,
                                    ttl: ttl === -1 ? 'Sin expiración' : ttl === -2 ? 'Clave no existe' : "".concat(ttl, "s"),
                                    size: Buffer.byteLength(value, 'utf8'),
                                }];
                        case 4:
                            error_5 = _a.sent();
                            this.logger.error("\u274C Error getting cache value: ".concat(error_5.message), error_5.stack);
                            return [2 /*return*/, {
                                    success: false,
                                    message: "Error: ".concat(error_5.message),
                                    key: key,
                                }];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Obtiene todas las claves con sus valores (limitado)
         */
        CacheManagementService_1.prototype.getCacheKeysWithValues = function () {
            return __awaiter(this, arguments, void 0, function (pattern, limit) {
                var tenantId, searchPattern, keys, limitedKeys, keysWithValues, error_6;
                var _this = this;
                if (pattern === void 0) { pattern = '*'; }
                if (limit === void 0) { limit = 100; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("\uD83D\uDD0D Getting cache keys with values. Pattern: ".concat(pattern, ", Limit: ").concat(limit));
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            if (!this.cacheService.redis) {
                                return [2 /*return*/, {
                                        success: false,
                                        message: 'Redis no está disponible',
                                    }];
                            }
                            tenantId = this.getTenantId() || 'global';
                            searchPattern = pattern;
                            // Si el pattern no incluye el tenant, agregarlo
                            if (!pattern.includes(':')) {
                                searchPattern = "".concat(tenantId, ":").concat(pattern);
                            }
                            return [4 /*yield*/, this.cacheService.getKeys(searchPattern)];
                        case 2:
                            keys = _a.sent();
                            limitedKeys = keys.slice(0, limit);
                            return [4 /*yield*/, Promise.all(limitedKeys.map(function (key) { return __awaiter(_this, void 0, void 0, function () {
                                    var value, ttl, parts, tenant, module_4, keyName, parsedValue, error_7;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 3, , 4]);
                                                return [4 /*yield*/, this.cacheService.redis.get(key)];
                                            case 1:
                                                value = _a.sent();
                                                return [4 /*yield*/, this.cacheService.redis.ttl(key)];
                                            case 2:
                                                ttl = _a.sent();
                                                parts = key.split(':');
                                                tenant = parts[0] || 'unknown';
                                                module_4 = parts[1] || 'unknown';
                                                keyName = parts.slice(2).join(':');
                                                parsedValue = void 0;
                                                try {
                                                    parsedValue = value ? JSON.parse(value) : null;
                                                }
                                                catch (_b) {
                                                    parsedValue = value;
                                                }
                                                return [2 /*return*/, {
                                                        key: key,
                                                        tenant: tenant,
                                                        module: module_4,
                                                        keyName: keyName,
                                                        value: parsedValue,
                                                        preview: value ? value.substring(0, 100) : null,
                                                        ttl: ttl === -1 ? null : ttl === -2 ? 0 : ttl,
                                                        size: value ? Buffer.byteLength(value, 'utf8') : 0,
                                                    }];
                                            case 3:
                                                error_7 = _a.sent();
                                                return [2 /*return*/, {
                                                        key: key,
                                                        error: error_7.message,
                                                    }];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                }); }))];
                        case 3:
                            keysWithValues = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    total: keys.length,
                                    returned: limitedKeys.length,
                                    pattern: searchPattern,
                                    keys: keysWithValues,
                                }];
                        case 4:
                            error_6 = _a.sent();
                            this.logger.error("\u274C Error getting cache keys with values: ".concat(error_6.message), error_6.stack);
                            return [2 /*return*/, {
                                    success: false,
                                    message: "Error: ".concat(error_6.message),
                                }];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return CacheManagementService_1;
    }());
    __setFunctionName(_classThis, "CacheManagementService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CacheManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CacheManagementService = _classThis;
}();
exports.CacheManagementService = CacheManagementService;
