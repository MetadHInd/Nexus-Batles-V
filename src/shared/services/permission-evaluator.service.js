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
exports.PermissionEvaluatorService = void 0;
var common_1 = require("@nestjs/common");
var service_cache_1 = require("../core/services/service-cache/service-cache");
/**
 * 🔐 Servicio para evaluar permisos de usuarios
 *
 * Resuelve permisos efectivos considerando:
 * - Permisos del rol del usuario
 * - Permisos directos del usuario
 * - Cache de 5 minutos para optimizar performance
 */
var PermissionEvaluatorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PermissionEvaluatorService = _classThis = /** @class */ (function () {
        function PermissionEvaluatorService_1(cache) {
            this.cache = cache;
            this.logger = new common_1.Logger(PermissionEvaluatorService.name);
            this.CACHE_TTL = 300; // 5 minutos
        }
        /**
         * Verificar si usuario tiene un permiso específico
         *
         * @param userId - ID del usuario
         * @param moduleCode - Código del módulo (ej: 'users')
         * @param actionCode - Código de la acción (ej: 'create')
         * @param scope - Scope del permiso (opcional, default: 'organization')
         * @returns true si tiene el permiso
         */
        PermissionEvaluatorService_1.prototype.hasPermission = function (userId_1, moduleCode_1, actionCode_1) {
            return __awaiter(this, arguments, void 0, function (userId, moduleCode, actionCode, scope) {
                var permissionCode_1, effectivePermissions, hasPermission, error_1;
                if (scope === void 0) { scope = 'organization'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            permissionCode_1 = "".concat(moduleCode, ".").concat(actionCode, ".").concat(scope);
                            return [4 /*yield*/, this.getUserEffectivePermissions(userId)];
                        case 1:
                            effectivePermissions = _a.sent();
                            hasPermission = effectivePermissions.some(function (p) { return p.code === permissionCode_1 && p.is_active; });
                            this.logger.debug("User ".concat(userId, " ").concat(hasPermission ? 'HAS' : 'DOES NOT HAVE', " permission: ").concat(permissionCode_1));
                            return [2 /*return*/, hasPermission];
                        case 2:
                            error_1 = _a.sent();
                            this.logger.error("Error checking permission: ".concat(error_1.message));
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Obtener todos los permisos efectivos de un usuario
         * (permisos de rol + permisos directos)
         *
         * @param userId - ID del usuario
         * @returns Array de definiciones de permisos
         */
        PermissionEvaluatorService_1.prototype.getUserEffectivePermissions = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, user, rolePermissions, userPermissions, allPermissions_1, effectivePermissions, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = "user:".concat(userId, ":effective-permissions");
                            return [4 /*yield*/, this.cache.get(cacheKey)];
                        case 1:
                            cached = _a.sent();
                            if (cached) {
                                this.logger.debug("Returning cached permissions for user ".concat(userId));
                                return [2 /*return*/, cached];
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 7, , 8]);
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.sysUser.findUnique({
                                    where: { idsysUser: userId },
                                    include: { role_sysUser_roleTorole: true },
                                })];
                        case 3:
                            user = _a.sent();
                            if (!user) {
                                this.logger.warn("User ".concat(userId, " not found"));
                                return [2 /*return*/, []];
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.role_permissions.findMany({
                                    where: {
                                        role_id: user.role,
                                        is_active: true,
                                    },
                                    include: {
                                        permission_definition: true,
                                    },
                                })];
                        case 4:
                            rolePermissions = _a.sent();
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.user_permissions.findMany({
                                    where: {
                                        user_id: userId,
                                        is_active: true,
                                    },
                                    include: {
                                        permission_definition: true,
                                    },
                                })];
                        case 5:
                            userPermissions = _a.sent();
                            allPermissions_1 = new Map();
                            // Agregar permisos de rol
                            rolePermissions.forEach(function (rp) {
                                if (rp.permission_definition) {
                                    allPermissions_1.set(rp.permission_definition.id, rp.permission_definition);
                                }
                            });
                            // Agregar permisos directos (sobrescriben si ya existen)
                            userPermissions.forEach(function (up) {
                                if (up.permission_definition) {
                                    allPermissions_1.set(up.permission_definition.id, up.permission_definition);
                                }
                            });
                            effectivePermissions = Array.from(allPermissions_1.values());
                            // Guardar en cache
                            return [4 /*yield*/, this.cache.set({ key: cacheKey }, effectivePermissions, this.CACHE_TTL)];
                        case 6:
                            // Guardar en cache
                            _a.sent();
                            this.logger.debug("User ".concat(userId, " has ").concat(effectivePermissions.length, " effective permissions"));
                            return [2 /*return*/, effectivePermissions];
                        case 7:
                            error_2 = _a.sent();
                            this.logger.error("Error getting effective permissions: ".concat(error_2.message));
                            return [2 /*return*/, []];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Verificar si usuario tiene AL MENOS UNO de los permisos especificados
         *
         * @param userId - ID del usuario
         * @param permissionCodes - Array de códigos de permisos (ej: ['users.create.organization', 'users.read.organization'])
         * @returns true si tiene al menos uno
         */
        PermissionEvaluatorService_1.prototype.hasAnyPermission = function (userId, permissionCodes) {
            return __awaiter(this, void 0, void 0, function () {
                var effectivePermissions, permissionCodesSet_1, hasAny, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.getUserEffectivePermissions(userId)];
                        case 1:
                            effectivePermissions = _a.sent();
                            permissionCodesSet_1 = new Set(effectivePermissions.map(function (p) { return p.code; }));
                            hasAny = permissionCodes.some(function (code) { return permissionCodesSet_1.has(code); });
                            this.logger.debug("User ".concat(userId, " ").concat(hasAny ? 'HAS' : 'DOES NOT HAVE', " any of: ").concat(permissionCodes.join(', ')));
                            return [2 /*return*/, hasAny];
                        case 2:
                            error_3 = _a.sent();
                            this.logger.error("Error checking any permission: ".concat(error_3.message));
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Verificar si usuario tiene TODOS los permisos especificados
         *
         * @param userId - ID del usuario
         * @param permissionCodes - Array de códigos de permisos
         * @returns true si tiene todos
         */
        PermissionEvaluatorService_1.prototype.hasAllPermissions = function (userId, permissionCodes) {
            return __awaiter(this, void 0, void 0, function () {
                var effectivePermissions, permissionCodesSet_2, hasAll, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.getUserEffectivePermissions(userId)];
                        case 1:
                            effectivePermissions = _a.sent();
                            permissionCodesSet_2 = new Set(effectivePermissions.map(function (p) { return p.code; }));
                            hasAll = permissionCodes.every(function (code) { return permissionCodesSet_2.has(code); });
                            this.logger.debug("User ".concat(userId, " ").concat(hasAll ? 'HAS' : 'DOES NOT HAVE', " all of: ").concat(permissionCodes.join(', ')));
                            return [2 /*return*/, hasAll];
                        case 2:
                            error_4 = _a.sent();
                            this.logger.error("Error checking all permissions: ".concat(error_4.message));
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Verificar si usuario es dueño de un recurso
         *
         * @param userId - ID del usuario
         * @param resourceType - Tipo de recurso (ej: 'order', 'customer')
         * @param resourceId - ID del recurso
         * @returns true si es el dueño
         */
        PermissionEvaluatorService_1.prototype.checkOwnership = function (userId, resourceType, resourceId) {
            return __awaiter(this, void 0, void 0, function () {
                var resourceModelMap, modelName, model, resource, isOwner, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            resourceModelMap = {
                                order: 'orders',
                                customer: 'client',
                                user: 'sysUser',
                                agent: 'agent',
                                // Agregar más según sea necesario
                            };
                            modelName = resourceModelMap[resourceType];
                            if (!modelName) {
                                this.logger.warn("Unknown resource type: ".concat(resourceType));
                                return [2 /*return*/, false];
                            }
                            model = service_cache_1.ServiceCache.Database[modelName];
                            if (!model) {
                                this.logger.warn("Model not found: ".concat(modelName));
                                return [2 /*return*/, false];
                            }
                            return [4 /*yield*/, model.findUnique({
                                    where: { id: resourceId },
                                })];
                        case 1:
                            resource = _a.sent();
                            if (!resource) {
                                this.logger.warn("Resource not found: ".concat(resourceType, "#").concat(resourceId));
                                return [2 /*return*/, false];
                            }
                            isOwner = resource.user_id === userId ||
                                resource.created_by === userId ||
                                resource.idsysUser === userId;
                            this.logger.debug("User ".concat(userId, " ").concat(isOwner ? 'IS' : 'IS NOT', " owner of ").concat(resourceType, "#").concat(resourceId));
                            return [2 /*return*/, isOwner];
                        case 2:
                            error_5 = _a.sent();
                            this.logger.error("Error checking ownership: ".concat(error_5.message));
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Limpiar cache de permisos de un usuario
         *
         * @param userId - ID del usuario
         */
        PermissionEvaluatorService_1.prototype.clearUserPermissionsCache = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = "user:".concat(userId, ":effective-permissions");
                            return [4 /*yield*/, this.cache.delete(cacheKey)];
                        case 1:
                            _a.sent();
                            this.logger.debug("Cleared permissions cache for user ".concat(userId));
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Verificar si usuario es administrador
         *
         * @param userId - ID del usuario
         * @returns true si es admin
         */
        PermissionEvaluatorService_1.prototype.isAdmin = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var user, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.sysUser.findUnique({
                                    where: { idsysUser: userId },
                                })];
                        case 1:
                            user = _a.sent();
                            // role = 1 es ADMIN
                            return [2 /*return*/, (user === null || user === void 0 ? void 0 : user.role) === 1];
                        case 2:
                            error_6 = _a.sent();
                            this.logger.error("Error checking if user is admin: ".concat(error_6.message));
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return PermissionEvaluatorService_1;
    }());
    __setFunctionName(_classThis, "PermissionEvaluatorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PermissionEvaluatorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PermissionEvaluatorService = _classThis;
}();
exports.PermissionEvaluatorService = PermissionEvaluatorService;
