"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
var common_1 = require("@nestjs/common");
var role_model_1 = require("../models/role.model");
var base_paginated_service_1 = require("../../../../../../../../src/shared/common/services/base-paginated.service");
var service_cache_1 = require("../../../../../../../../src/shared/core/services/service-cache/service-cache");
var cacheable_factory_1 = require("../../../../../../../../src/shared/cache/factories/cacheable.factory");
var pagination_dto_1 = require("../../../../../../../../src/shared/common/dtos/pagination.dto");
var pagination_utils_1 = require("../../../../../../../../src/shared/common/utils/pagination.utils");
var hierarchy_validator_util_1 = require("../../../../../../../../src/shared/utils/hierarchy-validator.util");
var RoleService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_paginated_service_1.BasePaginatedService;
    var RoleService = _classThis = /** @class */ (function (_super) {
        __extends(RoleService_1, _super);
        function RoleService_1(cache, rolePermissionService, permissionService) {
            var _this = _super.call(this, cache) || this;
            _this.rolePermissionService = rolePermissionService;
            _this.permissionService = permissionService;
            _this.roleCacheKey = 'role';
            _this.roleListSuffixKey = '_list';
            return _this;
        }
        /**
         * ðŸ”’ Obtiene el tenant_id del contexto global
         * @returns tenant_id activo o null si no existe
         */
        RoleService_1.prototype.getTenantId = function () {
            var _a, _b;
            try {
                var request = global.currentRequest;
                var tenantId = ((_a = request === null || request === void 0 ? void 0 : request.selectedRestaurant) === null || _a === void 0 ? void 0 : _a.database_connection) || null;
                console.log('ðŸ” [getTenantId] Tenant obtenido del contexto global:', tenantId);
                console.log('ðŸ” [getTenantId] Selected restaurant:', (_b = request === null || request === void 0 ? void 0 : request.selectedRestaurant) === null || _b === void 0 ? void 0 : _b.name);
                return tenantId;
            }
            catch (error) {
                console.log('âŒ [getTenantId] Error al obtener tenant:', error);
                return null;
            }
        };
        /**
         * ðŸ”’ Obtiene el tenant_id del contexto global y lanza error si no existe
         * @returns tenant_id activo
         * @throws Error si el tenant_id no estÃ¡ disponible
         */
        RoleService_1.prototype.getTenantIdOrFail = function () {
            var tenantId = this.getTenantId();
            if (!tenantId) {
                throw new Error('tenant_id no encontrado en el contexto. AsegÃºrate de que el middleware de tenant estÃ© configurado correctamente.');
            }
            return tenantId;
        };
        /**   * 🎯 Obtiene el ID del rol del usuario desde el contexto global
         * @returns role ID del usuario o null si no está disponible
         */
        RoleService_1.prototype.getUserRoleId = function () {
            var _a, _b;
            try {
                var request = global.currentRequest;
                var user = request === null || request === void 0 ? void 0 : request.user;
                if (!user) {
                    return null;
                }
                // Extraer el ID del rol desde diferentes posibles ubicaciones en el JWT
                var roleId = ((_a = user.role) === null || _a === void 0 ? void 0 : _a.id) || ((_b = user.role) === null || _b === void 0 ? void 0 : _b.idrole) || user.localRole || user.role;
                return roleId || null;
            }
            catch (error) {
                return null;
            }
        };
        /**   * ðŸŽ¯ Obtiene la jerarquÃ­a del rol del usuario desde el contexto global
         * @returns hierarchy_level del rol del usuario o null si no estÃ¡ disponible
         */
        RoleService_1.prototype.getUserHierarchy = function () {
            return __awaiter(this, void 0, void 0, function () {
                var request, user, roleId, role, error_1;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            request = global.currentRequest;
                            user = request === null || request === void 0 ? void 0 : request.user;
                            if (!user) {
                                console.log('âš ï¸ [getUserHierarchy] No hay usuario en el contexto');
                                return [2 /*return*/, null];
                            }
                            roleId = ((_a = user.role) === null || _a === void 0 ? void 0 : _a.id) || ((_b = user.role) === null || _b === void 0 ? void 0 : _b.idrole) || user.localRole || user.role;
                            if (!roleId) {
                                console.log('âš ï¸ [getUserHierarchy] No se encontrÃ³ role ID en el usuario');
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findUnique({
                                    where: { idrole: roleId },
                                    select: { hierarchy_level: true },
                                })];
                        case 1:
                            role = _c.sent();
                            if (!role) {
                                console.log("\u00E2\u0161\u00A0\u00EF\u00B8\u008F [getUserHierarchy] No se encontr\u00C3\u00B3 el rol con ID ".concat(roleId));
                                return [2 /*return*/, null];
                            }
                            console.log("\u00E2\u0153\u2026 [getUserHierarchy] Usuario con rol ID ".concat(roleId, " tiene jerarqu\u00C3\u00ADa: ").concat(role.hierarchy_level));
                            return [2 /*return*/, role.hierarchy_level || 50];
                        case 2:
                            error_1 = _c.sent();
                            console.log('âŒ [getUserHierarchy] Error al obtener jerarquÃ­a:', error_1);
                            return [2 /*return*/, null];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * ðŸ›¡ï¸ Valida que el usuario tenga jerarquÃ­a suficiente para una operaciÃ³n
         * @param targetHierarchy - JerarquÃ­a del rol objetivo
         * @param operation - Nombre de la operaciÃ³n (para mensajes de error)
         * @throws ForbiddenException si el usuario no tiene jerarquÃ­a suficiente
         */
        RoleService_1.prototype.validateHierarchy = function (targetHierarchy, operation) {
            return __awaiter(this, void 0, void 0, function () {
                var userHierarchy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getUserHierarchy()];
                        case 1:
                            userHierarchy = _a.sent();
                            // Si no se puede determinar la jerarquÃ­a del usuario, permitir por defecto
                            // (esto mantiene compatibilidad con versiones anteriores)
                            if (userHierarchy === null) {
                                console.log('âš ï¸ [validateHierarchy] No se pudo determinar jerarquÃ­a del usuario, permitiendo operaciÃ³n');
                                return [2 /*return*/];
                            }
                            if (userHierarchy <= targetHierarchy) {
                                throw new common_1.ConflictException("You do not have sufficient hierarchy to ".concat(operation, ". Your level: ").concat(userHierarchy, ", Required level: > ").concat(targetHierarchy));
                            }
                            console.log("\u00E2\u0153\u2026 [validateHierarchy] Validaci\u00C3\u00B3n exitosa: ".concat(userHierarchy, " > ").concat(targetHierarchy, " para ").concat(operation));
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * ðŸ” Verifica si ya existe un rol con exactamente los mismos permisos activos
         * @param permissionIds - Array de IDs de permisos a comparar
         * @param roleIdToExclude - ID del rol a excluir de la bÃºsqueda (Ãºtil al actualizar un rol existente)
         * @returns El rol duplicado si existe, null si no
         */
        RoleService_1.prototype.checkForDuplicateRolePermissions = function (permissionIds, roleIdToExclude) {
            return __awaiter(this, void 0, void 0, function () {
                var allRoles, sortedTargetPermissions, _i, allRoles_1, role, rolePermissionIds;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findMany({
                                where: roleIdToExclude ? { idrole: { not: roleIdToExclude } } : undefined,
                                include: {
                                    role_permissions: {
                                        where: { is_active: true },
                                        select: { permission_id: true },
                                    },
                                },
                            })];
                        case 1:
                            allRoles = _a.sent();
                            sortedTargetPermissions = __spreadArray([], permissionIds, true).sort(function (a, b) { return a - b; });
                            // Buscar un rol con exactamente los mismos permisos
                            for (_i = 0, allRoles_1 = allRoles; _i < allRoles_1.length; _i++) {
                                role = allRoles_1[_i];
                                rolePermissionIds = role.role_permissions
                                    .map(function (rp) { return rp.permission_id; })
                                    .sort(function (a, b) { return a - b; });
                                // Comparar si tienen exactamente los mismos permisos
                                if (rolePermissionIds.length === sortedTargetPermissions.length &&
                                    rolePermissionIds.every(function (id, index) { return id === sortedTargetPermissions[index]; })) {
                                    return [2 /*return*/, {
                                            idrole: role.idrole,
                                            description: role.description || '',
                                        }];
                                }
                            }
                            return [2 /*return*/, null];
                    }
                });
            });
        };
        RoleService_1.prototype.create = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, existingSuperRole, targetHierarchy, currentUserRoleId, currentUserRole, currentHierarchy, permissions, inactivePermissions, inactiveCodes, duplicateRole, created, allPermissions, activePermissionIds, rolePermissionsData, model;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            console.log('ðŸ“ [create] DTO recibido:', JSON.stringify(dto, null, 2));
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
                                    where: {
                                        description: dto.description,
                                    },
                                })];
                        case 1:
                            existing = _c.sent();
                            if (existing) {
                                throw new common_1.ConflictException("Role with description '".concat(dto.description, "' already exists"));
                            }
                            if (!(dto.is_super === true)) return [3 /*break*/, 3];
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
                                    where: {
                                        is_super: true,
                                    },
                                })];
                        case 2:
                            existingSuperRole = _c.sent();
                            if (existingSuperRole) {
                                throw new common_1.ConflictException('A super role already exists. Only one super role is allowed.');
                            }
                            _c.label = 3;
                        case 3:
                            targetHierarchy = (_a = dto.hierarchy_level) !== null && _a !== void 0 ? _a : 50;
                            currentUserRoleId = this.getUserRoleId();
                            if (!currentUserRoleId) return [3 /*break*/, 5];
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findUnique({
                                    where: { idrole: currentUserRoleId },
                                    select: { hierarchy_level: true },
                                })];
                        case 4:
                            currentUserRole = _c.sent();
                            if (currentUserRole) {
                                currentHierarchy = currentUserRole.hierarchy_level || 50;
                                // Validar que el usuario solo pueda crear roles con jerarquía inferior (números menores)
                                // Jerarquía: números mayores = más privilegios, números menores = menos privilegios
                                if (currentHierarchy <= targetHierarchy) {
                                    throw new common_1.ConflictException("You do not have sufficient hierarchy to create a role with level ".concat(targetHierarchy, ". Your level: ").concat(currentHierarchy, ". You can only create roles with hierarchy levels less than ").concat(currentHierarchy));
                                }
                            }
                            _c.label = 5;
                        case 5:
                            if (!(dto.permission_ids && dto.permission_ids.length > 0)) return [3 /*break*/, 8];
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.permissions.findMany({
                                    where: {
                                        id: { in: dto.permission_ids },
                                    },
                                })];
                        case 6:
                            permissions = _c.sent();
                            inactivePermissions = permissions.filter(function (p) { return !p.is_active; });
                            if (inactivePermissions.length > 0) {
                                inactiveCodes = inactivePermissions.map(function (p) { return p.code; }).join(', ');
                                throw new common_1.ConflictException("Cannot assign inactive permissions: ".concat(inactiveCodes, ". Please activate them first"));
                            }
                            return [4 /*yield*/, this.checkForDuplicateRolePermissions(dto.permission_ids)];
                        case 7:
                            duplicateRole = _c.sent();
                            if (duplicateRole) {
                                throw new common_1.ConflictException("A role with the same permission set already exists: '".concat(duplicateRole.description, "' (ID: ").concat(duplicateRole.idrole, "). Cannot create roles with duplicate permission configurations"));
                            }
                            _c.label = 8;
                        case 8: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.create({
                                data: {
                                    description: dto.description,
                                    is_super: (_b = dto.is_super) !== null && _b !== void 0 ? _b : false,
                                    hierarchy_level: targetHierarchy,
                                },
                            })];
                        case 9:
                            created = _c.sent();
                            return [4 /*yield*/, this.permissionService.findAll(false)];
                        case 10:
                            allPermissions = _c.sent();
                            activePermissionIds = dto.permission_ids || [];
                            rolePermissionsData = allPermissions.map(function (permission) { return ({
                                role_id: created.idrole,
                                permission_id: permission.id,
                                is_active: activePermissionIds.includes(permission.id),
                            }); });
                            if (!(rolePermissionsData.length > 0)) return [3 /*break*/, 12];
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.createMany({
                                    data: rolePermissionsData,
                                })];
                        case 11:
                            _c.sent();
                            _c.label = 12;
                        case 12:
                            model = cacheable_factory_1.CacheableFactory.create(created, role_model_1.RoleModel);
                            // Actualizar cache del item creado
                            return [4 /*yield*/, this.cacheSet(this.roleCacheKey, { id: created.idrole }, model, model.cacheTTL())];
                        case 13:
                            // Actualizar cache del item creado
                            _c.sent();
                            // Invalidar cache de la lista
                            return [4 /*yield*/, this.invalidateListCaches()];
                        case 14:
                            // Invalidar cache de la lista
                            _c.sent();
                            return [2 /*return*/, model];
                    }
                });
            });
        };
        RoleService_1.prototype.findAll = function () {
            return __awaiter(this, arguments, void 0, function (useCache) {
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tryCacheOrExecute(this.roleCacheKey, { key: this.roleListSuffixKey }, useCache, function () { return __awaiter(_this, void 0, void 0, function () {
                            var roles;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findMany({
                                            orderBy: { idrole: 'asc' },
                                        })];
                                    case 1:
                                        roles = _a.sent();
                                        return [2 /*return*/, roles.map(function (role) {
                                                return cacheable_factory_1.CacheableFactory.create(role, role_model_1.RoleModel);
                                            })];
                                }
                            });
                        }); })];
                });
            });
        };
        RoleService_1.prototype.findAllPaginated = function (paginationDto_1) {
            return __awaiter(this, arguments, void 0, function (paginationDto, useCache) {
                var _a, page, _b, limit, search, tenant_id, cacheKey;
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                return __generator(this, function (_c) {
                    _a = paginationDto.page, page = _a === void 0 ? 1 : _a, _b = paginationDto.limit, limit = _b === void 0 ? 10 : _b, search = paginationDto.search, tenant_id = paginationDto.tenant_id;
                    cacheKey = "".concat(this.roleListSuffixKey, "_paginated_").concat(page, "_").concat(limit, "_").concat(search, "_").concat(tenant_id);
                    return [2 /*return*/, this.tryCacheOrExecute(this.roleCacheKey, { key: cacheKey }, useCache, function () { return __awaiter(_this, void 0, void 0, function () {
                            var where, _a, roles, total, items;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        where = {};
                                        if (search) {
                                            where.description = { contains: search, mode: 'insensitive' };
                                        }
                                        if (tenant_id) {
                                            where.tenant_ids = { has: tenant_id };
                                        }
                                        return [4 /*yield*/, Promise.all([
                                                service_cache_1.ServiceCache.Database.Prisma.role.findMany({
                                                    where: where,
                                                    skip: (page - 1) * limit,
                                                    take: limit,
                                                    orderBy: { idrole: 'asc' },
                                                }),
                                                service_cache_1.ServiceCache.Database.Prisma.role.count({ where: where }),
                                            ])];
                                    case 1:
                                        _a = _b.sent(), roles = _a[0], total = _a[1];
                                        items = roles.map(function (role) {
                                            return cacheable_factory_1.CacheableFactory.create(role, role_model_1.RoleModel);
                                        });
                                        return [2 /*return*/, pagination_utils_1.PaginationUtils.createPaginatedResponse(items, new pagination_dto_1.PaginationParams({ page: page, limit: limit }), total)];
                                }
                            });
                        }); })];
                });
            });
        };
        RoleService_1.prototype.findOne = function (id_1) {
            return __awaiter(this, arguments, void 0, function (id, useCache) {
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tryCacheOrExecute(this.roleCacheKey, { id: id }, useCache, function () { return __awaiter(_this, void 0, void 0, function () {
                            var role;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findUnique({
                                            where: { idrole: id },
                                        })];
                                    case 1:
                                        role = _a.sent();
                                        if (!role) {
                                            throw new common_1.NotFoundException("Role with ID ".concat(id, " not found"));
                                        }
                                        return [2 /*return*/, cacheable_factory_1.CacheableFactory.create(role, role_model_1.RoleModel)];
                                }
                            });
                        }); })];
                });
            });
        };
        RoleService_1.prototype.findByDescription = function (description_1) {
            return __awaiter(this, arguments, void 0, function (description, useCache) {
                var cacheKey;
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                return __generator(this, function (_a) {
                    cacheKey = "by_description_".concat(description);
                    return [2 /*return*/, this.tryCacheOrExecute(this.roleCacheKey, { key: cacheKey }, useCache, function () { return __awaiter(_this, void 0, void 0, function () {
                            var role;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
                                            where: { description: description },
                                        })];
                                    case 1:
                                        role = _a.sent();
                                        if (!role) {
                                            return [2 /*return*/, null];
                                        }
                                        return [2 /*return*/, cacheable_factory_1.CacheableFactory.create(role, role_model_1.RoleModel)];
                                }
                            });
                        }); })];
                });
            });
        };
        RoleService_1.prototype.update = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var currentRole, currentUserRoleId, existing, existingSuperRole, updated, model;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id, false)];
                        case 1:
                            currentRole = _a.sent();
                            currentUserRoleId = this.getUserRoleId();
                            if (!currentUserRoleId) return [3 /*break*/, 3];
                            return [4 /*yield*/, hierarchy_validator_util_1.HierarchyValidator.validateRoleHierarchy(currentUserRoleId, id, "update role '".concat(currentRole.description, "'"))];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            if (!dto.description) return [3 /*break*/, 5];
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
                                    where: {
                                        description: dto.description,
                                        idrole: { not: id },
                                    },
                                })];
                        case 4:
                            existing = _a.sent();
                            if (existing) {
                                throw new common_1.ConflictException("Role with description '".concat(dto.description, "' already exists"));
                            }
                            _a.label = 5;
                        case 5:
                            if (!(dto.is_super === true && !currentRole.is_super)) return [3 /*break*/, 7];
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
                                    where: {
                                        is_super: true,
                                        idrole: { not: id },
                                    },
                                })];
                        case 6:
                            existingSuperRole = _a.sent();
                            if (existingSuperRole) {
                                throw new common_1.ConflictException('A super role already exists. Only one super role is allowed.');
                            }
                            _a.label = 7;
                        case 7: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.update({
                                where: { idrole: id },
                                data: __assign(__assign(__assign({}, (dto.description && { description: dto.description })), (dto.is_super !== undefined && { is_super: dto.is_super })), (dto.hierarchy_level !== undefined && { hierarchy_level: dto.hierarchy_level })),
                            })];
                        case 8:
                            updated = _a.sent();
                            if (!(dto.permission_ids !== undefined)) return [3 /*break*/, 12];
                            if (!(dto.permission_ids.length > 0)) return [3 /*break*/, 10];
                            return [4 /*yield*/, this.rolePermissionService.assignPermissionsToRole(id, {
                                    permission_ids: dto.permission_ids,
                                })];
                        case 9:
                            _a.sent();
                            return [3 /*break*/, 12];
                        case 10: 
                        // Si se envÃ­a un arreglo vacÃ­o, desactivar todos los permisos
                        return [4 /*yield*/, this.rolePermissionService.deactivateAllPermissionsFromRole(id)];
                        case 11:
                            // Si se envÃ­a un arreglo vacÃ­o, desactivar todos los permisos
                            _a.sent();
                            _a.label = 12;
                        case 12:
                            model = cacheable_factory_1.CacheableFactory.create(updated, role_model_1.RoleModel);
                            // Actualizar cache del item
                            return [4 /*yield*/, this.cacheSet(this.roleCacheKey, { id: updated.idrole }, model, model.cacheTTL())];
                        case 13:
                            // Actualizar cache del item
                            _a.sent();
                            // Invalidar cache de la lista
                            return [4 /*yield*/, this.invalidateListCaches()];
                        case 14:
                            // Invalidar cache de la lista
                            _a.sent();
                            return [2 /*return*/, model];
                    }
                });
            });
        };
        RoleService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var role, currentUserRoleId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id, false)];
                        case 1:
                            role = _a.sent();
                            currentUserRoleId = this.getUserRoleId();
                            if (!currentUserRoleId) return [3 /*break*/, 3];
                            return [4 /*yield*/, hierarchy_validator_util_1.HierarchyValidator.validateRoleHierarchy(currentUserRoleId, id, "delete role '".concat(role.description, "'"))];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: 
                        // Eliminar todos los permisos asociados al rol antes de eliminarlo
                        return [4 /*yield*/, this.rolePermissionService.removeAllPermissionsFromRole(id)];
                        case 4:
                            // Eliminar todos los permisos asociados al rol antes de eliminarlo
                            _a.sent();
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.delete({
                                    where: { idrole: id },
                                })];
                        case 5:
                            _a.sent();
                            // Invalidar cache
                            return [4 /*yield*/, this.cacheDelete(this.roleCacheKey, { id: id })];
                        case 6:
                            // Invalidar cache
                            _a.sent();
                            return [4 /*yield*/, this.invalidateListCaches()];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        RoleService_1.prototype.invalidateListCaches = function () {
            return __awaiter(this, void 0, void 0, function () {
                var pattern, patternByDesc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cacheDelete(this.roleCacheKey, {
                                key: this.roleListSuffixKey,
                            })];
                        case 1:
                            _a.sent();
                            pattern = "".concat(this.roleCacheKey, ":").concat(this.roleListSuffixKey, "_paginated_*");
                            return [4 /*yield*/, this.cache.deletePattern(pattern)];
                        case 2:
                            _a.sent();
                            patternByDesc = "".concat(this.roleCacheKey, ":by_description_*");
                            return [4 /*yield*/, this.cache.deletePattern(patternByDesc)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return RoleService_1;
    }(_classSuper));
    __setFunctionName(_classThis, "RoleService");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RoleService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RoleService = _classThis;
}();
exports.RoleService = RoleService;
