"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
exports.UnifiedCacheController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../../../../../../../src/shared/core/auth/guards/jwt-auth.guard");
var clear_cache_dto_1 = require("../dtos/clear-cache.dto");
var cache_key_dto_1 = require("../dtos/cache-key.dto");
/**
 * 🎛️ UNIFIED CACHE CONTROLLER
 *
 * Controlador centralizado para gestión avanzada de cache Redis
 * Consolida funcionalidades de CacheManagementController y CacheAdminController
 *
 * Soporta:
 * - ✅ Gestión por tenant
 * - ✅ Gestión por organization
 * - ✅ Gestión por team
 * - ✅ Búsqueda y filtrado avanzado
 * - ✅ Estadísticas en tiempo real
 * - ✅ Limpieza selectiva y masiva
 *
 * @since 2026-01-12
 * @version 2.0
 */
var UnifiedCacheController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('01 - Cache Management'), (0, common_1.Controller)('api/cache'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getDashboard_decorators;
    var _getStats_decorators;
    var _searchKeys_decorators;
    var _getCacheValue_decorators;
    var _clearCache_decorators;
    var _clearTenant_decorators;
    var _clearOrganization_decorators;
    var _clearTeam_decorators;
    var _clearModule_decorators;
    var _deleteCacheKey_decorators;
    var _deleteByPattern_decorators;
    var _clearMyTenant_decorators;
    var _clearDefaultNamespace_decorators;
    var _getModules_decorators;
    var _getTenants_decorators;
    var _getOrganizations_decorators;
    var _getTeams_decorators;
    var _setCacheValue_decorators;
    var UnifiedCacheController = _classThis = /** @class */ (function () {
        function UnifiedCacheController_1(cacheManagementService, cacheAdminService) {
            this.cacheManagementService = (__runInitializers(this, _instanceExtraInitializers), cacheManagementService);
            this.cacheAdminService = cacheAdminService;
        }
        // ============================================================
        // 📊 DASHBOARD & MONITORING
        // ============================================================
        UnifiedCacheController_1.prototype.getDashboard = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, cacheStats, adminStats, modules, tenants, allKeys, organizations, teams;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.cacheManagementService.getCacheStats(),
                                this.cacheAdminService.getCacheStats(),
                                this.cacheManagementService.getAvailableModules(),
                            ])];
                        case 1:
                            _a = _d.sent(), cacheStats = _a[0], adminStats = _a[1], modules = _a[2];
                            tenants = Object.keys(cacheStats.byTenant || {}).sort();
                            return [4 /*yield*/, this.cacheAdminService.listAllKeys(10000)];
                        case 2:
                            allKeys = _d.sent();
                            organizations = new Set();
                            teams = new Set();
                            allKeys.forEach(function (key) {
                                // Formato: tenant:module:action o tenant:org:team:module:action
                                var parts = key.split(':');
                                if (parts.length >= 3 && parts[1] === 'org') {
                                    organizations.add(parts[2]);
                                }
                                if (parts.length >= 5 && parts[3] === 'team') {
                                    teams.add(parts[4]);
                                }
                            });
                            _b = {
                                memory: {
                                    used: "".concat(Math.round(adminStats.memoryUsage / 1024 / 1024), "MB"),
                                    connected: adminStats.connected,
                                }
                            };
                            _c = {
                                totalKeys: cacheStats.totalKeys,
                                currentTenant: cacheStats.currentTenant,
                                byTenant: cacheStats.byTenant
                            };
                            return [4 /*yield*/, this.analyzeByOrganization(allKeys)];
                        case 3:
                            _c.byOrganization = _d.sent();
                            return [4 /*yield*/, this.analyzeByTeam(allKeys)];
                        case 4: return [2 /*return*/, (_b.stats = (_c.byTeam = _d.sent(),
                                _c.byModule = cacheStats.byModule,
                                _c),
                                _b.modules = modules.sort(),
                                _b.tenants = tenants,
                                _b.organizations = Array.from(organizations).sort(),
                                _b.teams = Array.from(teams).sort(),
                                _b.timestamp = new Date().toISOString(),
                                _b)];
                    }
                });
            });
        };
        UnifiedCacheController_1.prototype.getStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.cacheAdminService.getCacheStats()];
                });
            });
        };
        // ============================================================
        // 🔍 SEARCH & INSPECT
        // ============================================================
        UnifiedCacheController_1.prototype.searchKeys = function (pattern, tenantId, organizationId, teamId, module, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var finalPattern;
                return __generator(this, function (_a) {
                    finalPattern = pattern;
                    if (tenantId) {
                        finalPattern = "".concat(tenantId, ":").concat(finalPattern || '*');
                    }
                    if (organizationId) {
                        finalPattern = finalPattern
                            ? finalPattern.replace('*', "org:".concat(organizationId, ":*"))
                            : "*:org:".concat(organizationId, ":*");
                    }
                    if (teamId) {
                        finalPattern = finalPattern
                            ? finalPattern.replace('*', "team:".concat(teamId, ":*"))
                            : "*:team:".concat(teamId, ":*");
                    }
                    if (module) {
                        finalPattern = finalPattern
                            ? finalPattern.replace('*', "".concat(module, ":*"))
                            : "*:".concat(module, ":*");
                    }
                    return [2 /*return*/, this.cacheManagementService.getCacheKeys({
                            pattern: finalPattern,
                            tenantId: tenantId,
                            module: module,
                        })];
                });
            });
        };
        UnifiedCacheController_1.prototype.getCacheValue = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.cacheAdminService.getCacheValue(key)];
                });
            });
        };
        // ============================================================
        // 🧹 CLEAR OPERATIONS
        // ============================================================
        UnifiedCacheController_1.prototype.clearCache = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.cacheManagementService.clearCache(dto)];
                });
            });
        };
        UnifiedCacheController_1.prototype.clearTenant = function (tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.cacheManagementService.clearCache({ tenantId: tenantId })];
                });
            });
        };
        UnifiedCacheController_1.prototype.clearOrganization = function (organizationId) {
            return __awaiter(this, void 0, void 0, function () {
                var pattern, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pattern = "*:org:".concat(organizationId, ":*");
                            return [4 /*yield*/, this.cacheAdminService.deleteByPattern(pattern)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    success: result.success,
                                    message: "Organization ".concat(organizationId, " cache cleared"),
                                    keysDeleted: result.deletedCount,
                                }];
                    }
                });
            });
        };
        UnifiedCacheController_1.prototype.clearTeam = function (teamId) {
            return __awaiter(this, void 0, void 0, function () {
                var pattern, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pattern = "*:team:".concat(teamId, ":*");
                            return [4 /*yield*/, this.cacheAdminService.deleteByPattern(pattern)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    success: result.success,
                                    message: "Team ".concat(teamId, " cache cleared"),
                                    keysDeleted: result.deletedCount,
                                }];
                    }
                });
            });
        };
        UnifiedCacheController_1.prototype.clearModule = function (module) {
            return __awaiter(this, void 0, void 0, function () {
                var pattern, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pattern = "*:".concat(module, ":*");
                            return [4 /*yield*/, this.cacheAdminService.deleteByPattern(pattern)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    success: result.success,
                                    message: "Module ".concat(module, " cache cleared globally"),
                                    keysDeleted: result.deletedCount,
                                }];
                    }
                });
            });
        };
        UnifiedCacheController_1.prototype.deleteCacheKey = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.cacheAdminService.deleteCacheKey(key)];
                });
            });
        };
        UnifiedCacheController_1.prototype.deleteByPattern = function (pattern) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.cacheAdminService.deleteByPattern(pattern)];
                });
            });
        };
        // ============================================================
        // ⚡ QUICK ACTIONS
        // ============================================================
        UnifiedCacheController_1.prototype.clearMyTenant = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.cacheManagementService.clearCache({})];
                });
            });
        };
        UnifiedCacheController_1.prototype.clearDefaultNamespace = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.cacheManagementService.clearCache({ modules: ['default'] })];
                });
            });
        };
        // ============================================================
        // 🛠️ UTILITY OPERATIONS
        // ============================================================
        UnifiedCacheController_1.prototype.getModules = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.cacheManagementService.getAvailableModules()];
                });
            });
        };
        UnifiedCacheController_1.prototype.getTenants = function () {
            return __awaiter(this, void 0, void 0, function () {
                var stats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cacheManagementService.getCacheStats()];
                        case 1:
                            stats = _a.sent();
                            return [2 /*return*/, Object.keys(stats.byTenant || {}).sort()];
                    }
                });
            });
        };
        UnifiedCacheController_1.prototype.getOrganizations = function () {
            return __awaiter(this, void 0, void 0, function () {
                var allKeys, organizations;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cacheAdminService.listAllKeys(10000)];
                        case 1:
                            allKeys = _a.sent();
                            organizations = new Set();
                            allKeys.forEach(function (key) {
                                var parts = key.split(':');
                                if (parts.length >= 3 && parts[1] === 'org') {
                                    organizations.add(parts[2]);
                                }
                            });
                            return [2 /*return*/, Array.from(organizations).sort()];
                    }
                });
            });
        };
        UnifiedCacheController_1.prototype.getTeams = function () {
            return __awaiter(this, void 0, void 0, function () {
                var allKeys, teams;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cacheAdminService.listAllKeys(10000)];
                        case 1:
                            allKeys = _a.sent();
                            teams = new Set();
                            allKeys.forEach(function (key) {
                                var parts = key.split(':');
                                if (parts.length >= 5 && parts[3] === 'team') {
                                    teams.add(parts[4]);
                                }
                            });
                            return [2 /*return*/, Array.from(teams).sort()];
                    }
                });
            });
        };
        UnifiedCacheController_1.prototype.setCacheValue = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.cacheAdminService.setCacheValue(dto)];
                });
            });
        };
        // ============================================================
        // 🔧 HELPER METHODS
        // ============================================================
        /**
         * Analiza claves para extraer estadísticas por organization
         */
        UnifiedCacheController_1.prototype.analyzeByOrganization = function (keys) {
            return __awaiter(this, void 0, void 0, function () {
                var orgStats;
                return __generator(this, function (_a) {
                    orgStats = {};
                    keys.forEach(function (key) {
                        var parts = key.split(':');
                        if (parts.length >= 3 && parts[1] === 'org') {
                            var orgId = parts[2];
                            orgStats[orgId] = (orgStats[orgId] || 0) + 1;
                        }
                    });
                    return [2 /*return*/, orgStats];
                });
            });
        };
        /**
         * Analiza claves para extraer estadísticas por team
         */
        UnifiedCacheController_1.prototype.analyzeByTeam = function (keys) {
            return __awaiter(this, void 0, void 0, function () {
                var teamStats;
                return __generator(this, function (_a) {
                    teamStats = {};
                    keys.forEach(function (key) {
                        var parts = key.split(':');
                        if (parts.length >= 5 && parts[3] === 'team') {
                            var teamId = parts[4];
                            teamStats[teamId] = (teamStats[teamId] || 0) + 1;
                        }
                    });
                    return [2 /*return*/, teamStats];
                });
            });
        };
        return UnifiedCacheController_1;
    }());
    __setFunctionName(_classThis, "UnifiedCacheController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getDashboard_decorators = [(0, common_1.Get)('dashboard'), (0, swagger_1.ApiOperation)({
                summary: '📊 Dashboard Completo del Cache',
                description: "\n    ## \uD83C\uDFAF Dashboard Principal de Cache\n    \n    Vista completa del estado del cache con estad\u00EDsticas por:\n    - \uD83C\uDFE2 **Tenant**: Uso de cache por tenant\n    - \uD83C\uDFDB\uFE0F **Organization**: Uso por organizaci\u00F3n\n    - \uD83D\uDC65 **Team**: Uso por equipo\n    - \uD83D\uDCE6 **Module**: Distribuci\u00F3n por m\u00F3dulo (order, customer, menu, etc.)\n    - \uD83D\uDD11 **Keys**: Total de claves en sistema\n    \n    ### \uD83D\uDCA1 Incluye:\n    - Estad\u00EDsticas generales (memoria, claves totales)\n    - Distribuci\u00F3n por tenant/org/team\n    - M\u00F3dulos m\u00E1s utilizados\n    - Claves recientes\n    - Recomendaciones de limpieza\n    \n    \u26A1 No requiere par\u00E1metros\n    ",
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: '✅ Dashboard obtenido exitosamente',
                schema: {
                    example: {
                        memory: { used: '45MB', peak: '67MB', fragmentation: 1.2 },
                        stats: {
                            totalKeys: 158,
                            byTenant: { 'tenant-1': 45, 'tenant-2': 67, 'tenant-3': 46 },
                            byOrganization: { 'org-1': 78, 'org-2': 80 },
                            byTeam: { 'team-alpha': 34, 'team-beta': 56 },
                            byModule: { order: 45, customer: 23, menu: 18, default: 72 },
                        },
                        modules: ['order', 'customer', 'menu', 'item', 'branch'],
                        tenants: ['tenant-1', 'tenant-2', 'tenant-3'],
                        organizations: ['org-1', 'org-2'],
                        teams: ['team-alpha', 'team-beta', 'team-gamma'],
                        timestamp: '2026-01-12T14:30:00Z',
                    },
                },
            })];
        _getStats_decorators = [(0, common_1.Get)('stats'), (0, swagger_1.ApiOperation)({
                summary: '📊 Estadísticas Detalladas',
                description: "\n    ## \uD83D\uDCC8 Estad\u00EDsticas Completas del Cache\n    \n    M\u00E9tricas detalladas incluyendo:\n    - **Memory**: Uso de memoria Redis\n    - **Keys**: Distribuci\u00F3n por tenant/org/team/m\u00F3dulo\n    - **Performance**: Ratio de fragmentaci\u00F3n\n    - **Info**: Versi\u00F3n de Redis, uptime\n    \n    ### \uD83D\uDCCA Interpretaci\u00F3n:\n    - **byTenant**: Claves por tenant\n    - **byOrganization**: Claves por organizaci\u00F3n\n    - **byTeam**: Claves por equipo\n    - **byModule**: Claves por m\u00F3dulo funcional\n    ",
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Estadísticas obtenidas exitosamente',
                type: cache_key_dto_1.CacheStatsDto,
            })];
        _searchKeys_decorators = [(0, common_1.Get)('keys'), (0, swagger_1.ApiOperation)({
                summary: '🔍 Buscar Claves con Filtros Avanzados',
                description: "\n    ## \uD83D\uDD0D Explorador de Claves\n    \n    B\u00FAsqueda avanzada con soporte para:\n    \n    ### \uD83C\uDFAF Filtros Disponibles:\n    \n    #### Por Tenant\n    ```\n    ?tenantId=tenant-uuid\n    ```\n    \n    #### Por Organization\n    ```\n    ?organizationId=org-uuid\n    ```\n    \n    #### Por Team\n    ```\n    ?teamId=team-uuid\n    ```\n    \n    #### Por M\u00F3dulo\n    ```\n    ?module=order\n    ?module=customer\n    ?module=menu\n    ```\n    \n    #### Por Pattern Personalizado\n    ```\n    ?pattern=*:order:findAll*\n    ?pattern=tenant-1:org:*\n    ?pattern=*:team:team-alpha:*\n    ```\n    \n    #### Combinaciones\n    ```\n    ?tenantId=tenant-1&module=order\n    ?organizationId=org-1&module=customer\n    ?teamId=team-alpha&pattern=*:findById:*\n    ```\n    \n    ### \uD83D\uDCA1 Tips:\n    - Sin par\u00E1metros = todas las claves de tu tenant\n    - Usa filtros espec\u00EDficos para b\u00FAsquedas r\u00E1pidas\n    - Combina filtros para mayor precisi\u00F3n\n    ",
            }), (0, swagger_1.ApiQuery)({ name: 'pattern', required: false, description: 'Pattern de Redis (wildcards: *)' }), (0, swagger_1.ApiQuery)({ name: 'tenantId', required: false, description: 'UUID del tenant' }), (0, swagger_1.ApiQuery)({ name: 'organizationId', required: false, description: 'UUID de la organización' }), (0, swagger_1.ApiQuery)({ name: 'teamId', required: false, description: 'UUID del equipo' }), (0, swagger_1.ApiQuery)({ name: 'module', required: false, description: 'Nombre del módulo' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Límite de resultados' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Claves encontradas exitosamente',
                type: clear_cache_dto_1.CacheKeysResponseDto,
            })];
        _getCacheValue_decorators = [(0, common_1.Get)('get/:key'), (0, swagger_1.ApiOperation)({
                summary: '🔎 Obtener Valor de una Clave',
                description: "\n    ## \uD83D\uDD0E Inspector de Valores\n    \n    Obtiene el valor almacenado en una clave espec\u00EDfica.\n    \n    ### \uD83D\uDCCB Informaci\u00F3n Retornada:\n    - **key**: Clave consultada\n    - **value**: Valor almacenado (objeto JSON)\n    - **exists**: Si la clave existe\n    - **ttl**: Tiempo de vida restante (segundos)\n    - **type**: Tipo de dato Redis\n    \n    ### \uD83D\uDCA1 \u00DAtil para:\n    - Inspeccionar datos cacheados\n    - Verificar valores antes de limpiar\n    - Debugging de problemas de cache\n    ",
            }), (0, swagger_1.ApiParam)({ name: 'key', description: 'Clave completa del cache' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Valor obtenido exitosamente',
                schema: {
                    example: {
                        key: 'tenant-1:order:findById:123',
                        value: { id: 123, customer: 'John', total: 150.5 },
                        exists: true,
                        ttl: 285,
                        type: 'string',
                    },
                },
            })];
        _clearCache_decorators = [(0, common_1.Post)('clear'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: '🧹 Limpiar Cache - Control Avanzado',
                description: "\n    ## \uD83C\uDF9B\uFE0F Panel de Control de Limpieza\n    \n    Endpoint principal para limpiar cache con m\u00E1xima flexibilidad.\n    \n    ### \uD83C\uDFAF Modos de Operaci\u00F3n:\n    \n    #### 1\uFE0F\u20E3 Por M\u00F3dulos (Recomendado)\n    ```json\n    {\n      \"modules\": [\"order\", \"customer\"]\n    }\n    ```\n    \n    #### 2\uFE0F\u20E3 Por Tenant\n    ```json\n    {\n      \"tenantId\": \"tenant-uuid\",\n      \"modules\": [\"menu\"]\n    }\n    ```\n    \n    #### 3\uFE0F\u20E3 Por Organization\n    ```json\n    {\n      \"organizationId\": \"org-uuid\"\n    }\n    ```\n    \n    #### 4\uFE0F\u20E3 Por Team\n    ```json\n    {\n      \"teamId\": \"team-uuid\"\n    }\n    ```\n    \n    #### 5\uFE0F\u20E3 Pattern Personalizado\n    ```json\n    {\n      \"customPattern\": \"*:order:findAll*\"\n    }\n    ```\n    \n    #### 6\uFE0F\u20E3 Limpiar TODO (\u26A0\uFE0F PELIGROSO)\n    ```json\n    {\n      \"clearAll\": true\n    }\n    ```\n    \n    ### \uD83D\uDCCA Respuesta:\n    - \u2705 Confirmaci\u00F3n de \u00E9xito\n    - \uD83D\uDCC8 N\u00FAmero de claves eliminadas\n    - \uD83D\uDCCB Desglose por m\u00F3dulo/tenant/org/team\n    ",
            }), (0, swagger_1.ApiBody)({
                type: clear_cache_dto_1.ClearModuleCacheDto,
                examples: {
                    'Por módulos': {
                        value: { modules: ['order', 'customer'] },
                    },
                    'Por tenant': {
                        value: { tenantId: 'tenant-uuid', modules: ['menu'] },
                    },
                    'Por organization': {
                        value: { organizationId: 'org-uuid' },
                    },
                    'Por team': {
                        value: { teamId: 'team-uuid' },
                    },
                    'Pattern personalizado': {
                        value: { customPattern: '*:findById:*' },
                    },
                    'PELIGRO - Todo': {
                        value: { clearAll: true },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: '✅ Cache limpiado exitosamente',
                type: clear_cache_dto_1.ClearCacheResponseDto,
            })];
        _clearTenant_decorators = [(0, common_1.Delete)('tenant/:tenantId'), (0, swagger_1.ApiOperation)({
                summary: '🏢 Limpiar Todo el Cache de un Tenant',
                description: "\n    ## \uD83C\uDFE2 Limpieza por Tenant\n    \n    Elimina TODAS las claves asociadas a un tenant espec\u00EDfico.\n    \n    ### \u26A0\uFE0F Precauci\u00F3n:\n    - Limpia todos los m\u00F3dulos del tenant\n    - No afecta otros tenants\n    - Acci\u00F3n irreversible\n    \n    ### \uD83D\uDCA1 Casos de uso:\n    - Migraci\u00F3n de datos\n    - Cambio de estructura\n    - Eliminaci\u00F3n de tenant\n    ",
            }), (0, swagger_1.ApiParam)({ name: 'tenantId', description: 'UUID del tenant' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Tenant limpiado exitosamente' })];
        _clearOrganization_decorators = [(0, common_1.Delete)('organization/:organizationId'), (0, swagger_1.ApiOperation)({
                summary: '🏛️ Limpiar Todo el Cache de una Organization',
                description: "\n    ## \uD83C\uDFDB\uFE0F Limpieza por Organization\n    \n    Elimina TODAS las claves asociadas a una organizaci\u00F3n.\n    \n    ### \u26A0\uFE0F Precauci\u00F3n:\n    - Limpia cache de todos los teams de la org\n    - Limpia cache de todos los m\u00F3dulos de la org\n    - Acci\u00F3n irreversible\n    ",
            }), (0, swagger_1.ApiParam)({ name: 'organizationId', description: 'UUID de la organización' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Organization limpiada exitosamente' })];
        _clearTeam_decorators = [(0, common_1.Delete)('team/:teamId'), (0, swagger_1.ApiOperation)({
                summary: '👥 Limpiar Todo el Cache de un Team',
                description: "\n    ## \uD83D\uDC65 Limpieza por Team\n    \n    Elimina TODAS las claves asociadas a un equipo.\n    \n    ### \u26A0\uFE0F Precauci\u00F3n:\n    - Limpia cache de todos los m\u00F3dulos del team\n    - No afecta otros teams\n    - Acci\u00F3n irreversible\n    ",
            }), (0, swagger_1.ApiParam)({ name: 'teamId', description: 'UUID del equipo' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Team limpiado exitosamente' })];
        _clearModule_decorators = [(0, common_1.Delete)('module/:module'), (0, swagger_1.ApiOperation)({
                summary: '📦 Limpiar Cache de un Módulo (Todos los Tenants)',
                description: "\n    ## \uD83D\uDCE6 Limpieza por M\u00F3dulo\n    \n    Elimina todas las claves de un m\u00F3dulo espec\u00EDfico en TODOS los tenants.\n    \n    ### \u26A0\uFE0F PRECAUCI\u00D3N M\u00C1XIMA:\n    - Afecta a TODOS los tenants\n    - Limpia el m\u00F3dulo en todo el sistema\n    - Usar solo en casos extremos\n    \n    ### \uD83D\uDCA1 Casos de uso:\n    - Actualizaci\u00F3n global del m\u00F3dulo\n    - Cambio de estructura de datos\n    - Fix de bugs cr\u00EDticos\n    ",
            }), (0, swagger_1.ApiParam)({
                name: 'module',
                description: 'Nombre del módulo (order, customer, menu, etc.)',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Módulo limpiado exitosamente' })];
        _deleteCacheKey_decorators = [(0, common_1.Delete)('key/:key'), (0, swagger_1.ApiOperation)({
                summary: '🔑 Eliminar una Clave Específica',
                description: "\n    ## \uD83D\uDD11 Eliminaci\u00F3n Precisa\n    \n    Elimina una clave espec\u00EDfica del cache.\n    \n    ### \u2705 Seguro:\n    - Solo elimina la clave exacta\n    - No afecta otras claves\n    - Ideal para limpieza quir\u00FArgica\n    ",
            }), (0, swagger_1.ApiParam)({ name: 'key', description: 'Clave completa a eliminar' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Clave eliminada exitosamente' })];
        _deleteByPattern_decorators = [(0, common_1.Delete)('pattern/:pattern'), (0, swagger_1.ApiOperation)({
                summary: '🎯 Eliminar por Pattern',
                description: "\n    ## \uD83C\uDFAF Eliminaci\u00F3n por Patr\u00F3n\n    \n    Elimina todas las claves que coincidan con un patr\u00F3n.\n    \n    ### \uD83D\uDCDD Ejemplos:\n    - `user_*` - Todas las claves de usuarios\n    - `*_paginated_*` - Todas las paginaciones\n    - `tenant-1:order:*` - Todas las \u00F3rdenes del tenant-1\n    - `*:findAll*` - Todos los findAll de cualquier m\u00F3dulo\n    \n    ### \u26A0\uFE0F Precauci\u00F3n:\n    - Puede afectar m\u00FAltiples claves\n    - Revisar pattern antes de ejecutar\n    ",
            }), (0, swagger_1.ApiParam)({ name: 'pattern', description: 'Pattern con wildcards (*)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Claves eliminadas por pattern' })];
        _clearMyTenant_decorators = [(0, common_1.Post)('quick/clear-my-tenant'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: '⚡ Acción Rápida: Limpiar Mi Tenant',
                description: "\n    ## \u26A1 Limpieza R\u00E1pida\n    \n    Limpia TODO el cache de tu tenant actual con un solo click.\n    \n    ### \u2705 Qu\u00E9 hace:\n    - Detecta tu tenant autom\u00E1ticamente\n    - Limpia todas las claves de tu tenant\n    - No afecta otros tenants\n    - Seguro de usar\n    \n    \uD83C\uDFAF Solo presiona \"Execute\"!\n    ",
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Mi tenant limpiado exitosamente' })];
        _clearDefaultNamespace_decorators = [(0, common_1.Post)('quick/clear-default-namespace'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: '⚡ Acción Rápida: Limpiar Namespace "default"',
                description: "\n    ## \u26A1 Limpieza de Default\n    \n    Limpia el namespace \"default\" donde se guarda cache sin namespace espec\u00EDfico.\n    \n    ### \u2705 Com\u00FAn para:\n    - Cache legacy\n    - Datos sin tenant espec\u00EDfico\n    - Refresh general\n    ",
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Namespace default limpiado' })];
        _getModules_decorators = [(0, common_1.Get)('modules'), (0, swagger_1.ApiOperation)({
                summary: '📦 Listar Módulos Disponibles',
                description: "\n    ## \uD83D\uDCE6 M\u00F3dulos con Cache\n    \n    Obtiene lista de todos los m\u00F3dulos que tienen datos en cache.\n    \n    ### \uD83D\uDCA1 \u00DAtil para:\n    - Ver qu\u00E9 m\u00F3dulos est\u00E1n usando cache\n    - Seleccionar m\u00F3dulos para limpiar\n    - Auditor\u00EDa de uso de cache\n    ",
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Lista de módulos',
                schema: {
                    example: ['order', 'customer', 'menu', 'item', 'branch', 'default'],
                },
            })];
        _getTenants_decorators = [(0, common_1.Get)('tenants'), (0, swagger_1.ApiOperation)({
                summary: '🏢 Listar Tenants con Cache',
                description: "\n    ## \uD83C\uDFE2 Tenants Activos\n    \n    Obtiene lista de todos los tenants que tienen datos en cache.\n    ",
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Lista de tenants',
                schema: {
                    example: ['tenant-1', 'tenant-2', 'tenant-3'],
                },
            })];
        _getOrganizations_decorators = [(0, common_1.Get)('organizations'), (0, swagger_1.ApiOperation)({
                summary: '🏛️ Listar Organizations con Cache',
                description: "\n    ## \uD83C\uDFDB\uFE0F Organizations Activas\n    \n    Obtiene lista de todas las organizaciones que tienen datos en cache.\n    ",
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Lista de organizations',
                schema: {
                    example: ['org-1', 'org-2'],
                },
            })];
        _getTeams_decorators = [(0, common_1.Get)('teams'), (0, swagger_1.ApiOperation)({
                summary: '👥 Listar Teams con Cache',
                description: "\n    ## \uD83D\uDC65 Teams Activos\n    \n    Obtiene lista de todos los equipos que tienen datos en cache.\n    ",
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Lista de teams',
                schema: {
                    example: ['team-alpha', 'team-beta', 'team-gamma'],
                },
            })];
        _setCacheValue_decorators = [(0, common_1.Post)('set'), (0, swagger_1.ApiOperation)({
                summary: '💾 Establecer Valor en Cache',
                description: "\n    ## \uD83D\uDCBE Guardar en Cache\n    \n    Guarda un valor en cache con clave y TTL opcionales.\n    \n    ### \uD83D\uDCA1 Casos de uso:\n    - Testing de cache\n    - Pre-carga de datos\n    - Cache manual\n    ",
            }), (0, swagger_1.ApiBody)({ type: cache_key_dto_1.SetCacheDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Valor guardado exitosamente' })];
        __esDecorate(_classThis, null, _getDashboard_decorators, { kind: "method", name: "getDashboard", static: false, private: false, access: { has: function (obj) { return "getDashboard" in obj; }, get: function (obj) { return obj.getDashboard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStats_decorators, { kind: "method", name: "getStats", static: false, private: false, access: { has: function (obj) { return "getStats" in obj; }, get: function (obj) { return obj.getStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _searchKeys_decorators, { kind: "method", name: "searchKeys", static: false, private: false, access: { has: function (obj) { return "searchKeys" in obj; }, get: function (obj) { return obj.searchKeys; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCacheValue_decorators, { kind: "method", name: "getCacheValue", static: false, private: false, access: { has: function (obj) { return "getCacheValue" in obj; }, get: function (obj) { return obj.getCacheValue; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _clearCache_decorators, { kind: "method", name: "clearCache", static: false, private: false, access: { has: function (obj) { return "clearCache" in obj; }, get: function (obj) { return obj.clearCache; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _clearTenant_decorators, { kind: "method", name: "clearTenant", static: false, private: false, access: { has: function (obj) { return "clearTenant" in obj; }, get: function (obj) { return obj.clearTenant; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _clearOrganization_decorators, { kind: "method", name: "clearOrganization", static: false, private: false, access: { has: function (obj) { return "clearOrganization" in obj; }, get: function (obj) { return obj.clearOrganization; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _clearTeam_decorators, { kind: "method", name: "clearTeam", static: false, private: false, access: { has: function (obj) { return "clearTeam" in obj; }, get: function (obj) { return obj.clearTeam; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _clearModule_decorators, { kind: "method", name: "clearModule", static: false, private: false, access: { has: function (obj) { return "clearModule" in obj; }, get: function (obj) { return obj.clearModule; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteCacheKey_decorators, { kind: "method", name: "deleteCacheKey", static: false, private: false, access: { has: function (obj) { return "deleteCacheKey" in obj; }, get: function (obj) { return obj.deleteCacheKey; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteByPattern_decorators, { kind: "method", name: "deleteByPattern", static: false, private: false, access: { has: function (obj) { return "deleteByPattern" in obj; }, get: function (obj) { return obj.deleteByPattern; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _clearMyTenant_decorators, { kind: "method", name: "clearMyTenant", static: false, private: false, access: { has: function (obj) { return "clearMyTenant" in obj; }, get: function (obj) { return obj.clearMyTenant; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _clearDefaultNamespace_decorators, { kind: "method", name: "clearDefaultNamespace", static: false, private: false, access: { has: function (obj) { return "clearDefaultNamespace" in obj; }, get: function (obj) { return obj.clearDefaultNamespace; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getModules_decorators, { kind: "method", name: "getModules", static: false, private: false, access: { has: function (obj) { return "getModules" in obj; }, get: function (obj) { return obj.getModules; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTenants_decorators, { kind: "method", name: "getTenants", static: false, private: false, access: { has: function (obj) { return "getTenants" in obj; }, get: function (obj) { return obj.getTenants; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getOrganizations_decorators, { kind: "method", name: "getOrganizations", static: false, private: false, access: { has: function (obj) { return "getOrganizations" in obj; }, get: function (obj) { return obj.getOrganizations; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTeams_decorators, { kind: "method", name: "getTeams", static: false, private: false, access: { has: function (obj) { return "getTeams" in obj; }, get: function (obj) { return obj.getTeams; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setCacheValue_decorators, { kind: "method", name: "setCacheValue", static: false, private: false, access: { has: function (obj) { return "setCacheValue" in obj; }, get: function (obj) { return obj.setCacheValue; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UnifiedCacheController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UnifiedCacheController = _classThis;
}();
exports.UnifiedCacheController = UnifiedCacheController;
