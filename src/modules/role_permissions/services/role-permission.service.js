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
exports.RolePermissionService = void 0;
var common_1 = require("@nestjs/common");
var role_permission_model_1 = require("../models/role-permission.model");
var base_paginated_service_1 = require("../../../../../../../../src/shared/common/services/base-paginated.service");
var service_cache_1 = require("../../../../../../../../src/shared/core/services/service-cache/service-cache");
var cacheable_factory_1 = require("../../../../../../../../src/shared/cache/factories/cacheable.factory");
var pagination_dto_1 = require("../../../../../../../../src/shared/common/dtos/pagination.dto");
var pagination_utils_1 = require("../../../../../../../../src/shared/common/utils/pagination.utils");
var hierarchy_validator_util_1 = require("../../../../../../../../src/shared/utils/hierarchy-validator.util");
var RolePermissionService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_paginated_service_1.BasePaginatedService;
    var RolePermissionService = _classThis = /** @class */ (function (_super) {
        __extends(RolePermissionService_1, _super);
        function RolePermissionService_1(cache, permissionService) {
            var _this = _super.call(this, cache) || this;
            _this.permissionService = permissionService;
            _this.rolePermissionCacheKey = 'role_permission';
            _this.rolePermissionListSuffixKey = '_list';
            return _this;
        }
        /**
         * 🎯 Obtiene el ID del rol del usuario desde el contexto global
         * @returns role ID del usuario o null si no está disponible
         */
        RolePermissionService_1.prototype.getUserRoleId = function () {
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
        RolePermissionService_1.prototype.create = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var role, currentUserRoleId, permission, existing, created, model;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
                                where: {
                                    idrole: dto.role_id,
                                },
                            })];
                        case 1:
                            role = _b.sent();
                            if (!role) {
                                throw new common_1.NotFoundException("Role with ID ".concat(dto.role_id, " not found"));
                            }
                            currentUserRoleId = this.getUserRoleId();
                            if (!currentUserRoleId) return [3 /*break*/, 3];
                            return [4 /*yield*/, hierarchy_validator_util_1.HierarchyValidator.validateRoleHierarchy(currentUserRoleId, dto.role_id, "assign permissions to role")];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3: return [4 /*yield*/, this.permissionService.findByCode(dto.permission_code, false)];
                        case 4:
                            permission = _b.sent();
                            if (!permission) {
                                throw new common_1.NotFoundException("Permission with code '".concat(dto.permission_code, "' not found"));
                            }
                            // Verificar si el permiso está activo en la tabla permissions
                            if (!permission.is_active) {
                                throw new common_1.ConflictException("Cannot assign permission '".concat(dto.permission_code, "' because it is currently inactive in the system"));
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.findFirst({
                                    where: {
                                        role_id: dto.role_id,
                                        permission_id: permission.id
                                    },
                                })];
                        case 5:
                            existing = _b.sent();
                            if (existing) {
                                // Si existe pero está inactivo en role_permissions
                                if (!existing.is_active) {
                                    throw new common_1.ConflictException("The relationship between role ".concat(dto.role_id, " and permission '").concat(dto.permission_code, "' already exists but is currently inactive. Please activate it instead of creating a new one"));
                                }
                                // Si existe y está activo
                                throw new common_1.ConflictException("Role ".concat(dto.role_id, " already has permission '").concat(dto.permission_code, "' assigned and active"));
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.create({
                                    data: {
                                        role_id: dto.role_id,
                                        permission_id: permission.id,
                                        is_active: (_a = dto.is_active) !== null && _a !== void 0 ? _a : true
                                    },
                                })];
                        case 6:
                            created = _b.sent();
                            model = cacheable_factory_1.CacheableFactory.create(created, role_permission_model_1.RolePermissionModel);
                            // Actualizar cache del item creado
                            return [4 /*yield*/, this.cacheSet(this.rolePermissionCacheKey, { id: created.id }, model, model.cacheTTL())];
                        case 7:
                            // Actualizar cache del item creado
                            _b.sent();
                            // Invalidar cache de la lista
                            return [4 /*yield*/, this.invalidateListCaches()];
                        case 8:
                            // Invalidar cache de la lista
                            _b.sent();
                            return [2 /*return*/, model];
                    }
                });
            });
        };
        RolePermissionService_1.prototype.findAll = function () {
            return __awaiter(this, arguments, void 0, function (useCache) {
                var cacheKey;
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                return __generator(this, function (_a) {
                    cacheKey = this.rolePermissionListSuffixKey;
                    return [2 /*return*/, this.tryCacheOrExecute(this.rolePermissionCacheKey, { key: cacheKey }, useCache, function () { return __awaiter(_this, void 0, void 0, function () {
                            var rolePermissions, rolesMap, _i, rolePermissions_1, rp, roleId;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
                                            include: {
                                                permissions: true,
                                                role: true,
                                            },
                                            orderBy: { role_id: 'asc' },
                                        })];
                                    case 1:
                                        rolePermissions = _a.sent();
                                        rolesMap = new Map();
                                        for (_i = 0, rolePermissions_1 = rolePermissions; _i < rolePermissions_1.length; _i++) {
                                            rp = rolePermissions_1[_i];
                                            if (!rp.role)
                                                continue;
                                            roleId = rp.role.idrole;
                                            if (!rolesMap.has(roleId)) {
                                                rolesMap.set(roleId, {
                                                    role: {
                                                        idrole: rp.role.idrole,
                                                        description: rp.role.description,
                                                    },
                                                    permissions: [],
                                                });
                                            }
                                            if (rp.permissions) {
                                                rolesMap.get(roleId).permissions.push({
                                                    id: rp.permissions.id,
                                                    code: rp.permissions.code,
                                                    name: rp.permissions.name,
                                                    description: rp.permissions.description,
                                                    is_active: rp.permissions.is_active,
                                                    action_id: rp.permissions.action_id,
                                                });
                                            }
                                        }
                                        return [2 /*return*/, {
                                                data: Array.from(rolesMap.values()),
                                            }];
                                }
                            });
                        }); })];
                });
            });
        };
        RolePermissionService_1.prototype.findAllPaginated = function (paginationDto_1) {
            return __awaiter(this, arguments, void 0, function (paginationDto, useCache) {
                var _a, page, _b, limit, role_id, permission_code, cacheKey;
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                return __generator(this, function (_c) {
                    _a = paginationDto.page, page = _a === void 0 ? 1 : _a, _b = paginationDto.limit, limit = _b === void 0 ? 10 : _b, role_id = paginationDto.role_id, permission_code = paginationDto.permission_code;
                    cacheKey = "".concat(this.rolePermissionListSuffixKey, "_paginated_").concat(page, "_").concat(limit, "_").concat(role_id, "_").concat(permission_code);
                    return [2 /*return*/, this.tryCacheOrExecute(this.rolePermissionCacheKey, { key: cacheKey }, useCache, function () { return __awaiter(_this, void 0, void 0, function () {
                            var where, permission, _a, rolePermissions, total, items;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        where = {};
                                        if (role_id !== undefined) {
                                            where.role_id = role_id;
                                        }
                                        if (!(permission_code !== undefined)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.permissionService.findByCode(permission_code, false)];
                                    case 1:
                                        permission = _b.sent();
                                        if (permission) {
                                            where.permission_id = permission.id;
                                        }
                                        else {
                                            // Si el código no existe, retornar lista vacía
                                            return [2 /*return*/, pagination_utils_1.PaginationUtils.createPaginatedResponse([], new pagination_dto_1.PaginationParams({ page: page, limit: limit }), 0)];
                                        }
                                        _b.label = 2;
                                    case 2: return [4 /*yield*/, Promise.all([
                                            service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
                                                where: where,
                                                include: {
                                                    permissions: true,
                                                    role: true,
                                                },
                                                skip: (page - 1) * limit,
                                                take: limit,
                                                orderBy: { id: 'asc' },
                                            }),
                                            service_cache_1.ServiceCache.Database.Prisma.role_permissions.count({ where: where }),
                                        ])];
                                    case 3:
                                        _a = _b.sent(), rolePermissions = _a[0], total = _a[1];
                                        items = rolePermissions.map(function (rp) { return (__assign(__assign({}, cacheable_factory_1.CacheableFactory.create(rp, role_permission_model_1.RolePermissionModel).toJSON()), { permission: rp.permissions ? {
                                                id: rp.permissions.id,
                                                code: rp.permissions.code,
                                                name: rp.permissions.name,
                                                description: rp.permissions.description,
                                                is_active: rp.permissions.is_active,
                                            } : null, role: rp.role ? {
                                                idrole: rp.role.idrole,
                                                description: rp.role.description,
                                            } : null })); });
                                        return [2 /*return*/, pagination_utils_1.PaginationUtils.createPaginatedResponse(items, new pagination_dto_1.PaginationParams({ page: page, limit: limit }), total)];
                                }
                            });
                        }); })];
                });
            });
        };
        RolePermissionService_1.prototype.findOne = function (id_1) {
            return __awaiter(this, arguments, void 0, function (id, useCache) {
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tryCacheOrExecute(this.rolePermissionCacheKey, { id: id }, useCache, function () { return __awaiter(_this, void 0, void 0, function () {
                            var rolePermission;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.findUnique({
                                            where: { id: id },
                                            include: {
                                                permissions: true,
                                                role: true,
                                            },
                                        })];
                                    case 1:
                                        rolePermission = _a.sent();
                                        if (!rolePermission) {
                                            throw new common_1.NotFoundException("RolePermission with ID ".concat(id, " not found"));
                                        }
                                        return [2 /*return*/, __assign(__assign({}, cacheable_factory_1.CacheableFactory.create(rolePermission, role_permission_model_1.RolePermissionModel).toJSON()), { permission: rolePermission.permissions ? {
                                                    id: rolePermission.permissions.id,
                                                    code: rolePermission.permissions.code,
                                                    name: rolePermission.permissions.name,
                                                    description: rolePermission.permissions.description,
                                                    is_active: rolePermission.permissions.is_active,
                                                } : null, role: rolePermission.role ? {
                                                    idrole: rolePermission.role.idrole,
                                                    description: rolePermission.role.description,
                                                } : null })];
                                }
                            });
                        }); })];
                });
            });
        };
        RolePermissionService_1.prototype.findByRoleId = function (roleId_1) {
            return __awaiter(this, arguments, void 0, function (roleId, useCache) {
                var cacheKey;
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                return __generator(this, function (_a) {
                    console.log('\n🔍 ========== FIND BY ROLE ID ==========');
                    console.log('📌 Role ID:', roleId);
                    console.log('💾 Use Cache:', useCache);
                    cacheKey = "by_role_".concat(roleId);
                    console.log('🔑 Cache Key:', cacheKey);
                    return [2 /*return*/, this.tryCacheOrExecute(this.rolePermissionCacheKey, { key: cacheKey }, useCache, function () { return __awaiter(_this, void 0, void 0, function () {
                            var where, rolePermissions, permissionCodes;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log('💽 Consultando base de datos...');
                                        where = { role_id: roleId };
                                        return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
                                                where: where,
                                                include: {
                                                    permissions: true,
                                                },
                                                orderBy: { id: 'asc' },
                                            })];
                                    case 1:
                                        rolePermissions = _a.sent();
                                        console.log('📊 Role Permissions encontrados:', rolePermissions.length);
                                        console.log('📋 Detalles:', JSON.stringify(rolePermissions.map(function (rp) {
                                            var _a;
                                            return ({
                                                id: rp.id,
                                                role_id: rp.role_id,
                                                permission_id: rp.permission_id,
                                                is_active: rp.is_active,
                                                permission_code: (_a = rp.permissions) === null || _a === void 0 ? void 0 : _a.code
                                            });
                                        }), null, 2));
                                        permissionCodes = rolePermissions
                                            .map(function (rp) { var _a; return ((_a = rp.permissions) === null || _a === void 0 ? void 0 : _a.code) || null; })
                                            .filter(function (code) { return code !== null; });
                                        console.log('✅ Códigos de permisos retornados:', permissionCodes);
                                        console.log('========== FIN FIND BY ROLE ID ==========\n');
                                        return [2 /*return*/, permissionCodes];
                                }
                            });
                        }); })];
                });
            });
        };
        RolePermissionService_1.prototype.findByPermissionId = function (permissionId_1) {
            return __awaiter(this, arguments, void 0, function (permissionId, useCache) {
                var cacheKey;
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                return __generator(this, function (_a) {
                    cacheKey = "by_permission_".concat(permissionId);
                    return [2 /*return*/, this.tryCacheOrExecute(this.rolePermissionCacheKey, { key: cacheKey }, useCache, function () { return __awaiter(_this, void 0, void 0, function () {
                            var where, rolePermissions;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        where = { permission_id: permissionId };
                                        return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
                                                where: where,
                                                include: {
                                                    permissions: true,
                                                    role: true,
                                                },
                                                orderBy: { id: 'asc' },
                                            })];
                                    case 1:
                                        rolePermissions = _a.sent();
                                        return [2 /*return*/, rolePermissions.map(function (rp) { return (__assign(__assign({}, cacheable_factory_1.CacheableFactory.create(rp, role_permission_model_1.RolePermissionModel).toJSON()), { permission: rp.permissions ? {
                                                    id: rp.permissions.id,
                                                    code: rp.permissions.code,
                                                    name: rp.permissions.name,
                                                    description: rp.permissions.description,
                                                    is_active: rp.permissions.is_active,
                                                } : null, role: rp.role ? {
                                                    idrole: rp.role.idrole,
                                                    description: rp.role.description,
                                                } : null })); })];
                                }
                            });
                        }); })];
                });
            });
        };
        RolePermissionService_1.prototype.findByPermissionCode = function (permissionCode_1) {
            return __awaiter(this, arguments, void 0, function (permissionCode, useCache) {
                var cacheKey;
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                return __generator(this, function (_a) {
                    cacheKey = "by_permission_code_".concat(permissionCode);
                    return [2 /*return*/, this.tryCacheOrExecute(this.rolePermissionCacheKey, { key: cacheKey }, useCache, function () { return __awaiter(_this, void 0, void 0, function () {
                            var permission, where, rolePermissions;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.permissionService.findByCode(permissionCode, false)];
                                    case 1:
                                        permission = _a.sent();
                                        if (!permission) {
                                            throw new common_1.NotFoundException("Permission with code '".concat(permissionCode, "' not found"));
                                        }
                                        where = { permission_id: permission.id };
                                        return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
                                                where: where,
                                                include: {
                                                    permissions: true,
                                                    role: true,
                                                },
                                                orderBy: { id: 'asc' },
                                            })];
                                    case 2:
                                        rolePermissions = _a.sent();
                                        return [2 /*return*/, rolePermissions.map(function (rp) { return (__assign(__assign({}, cacheable_factory_1.CacheableFactory.create(rp, role_permission_model_1.RolePermissionModel).toJSON()), { permission: rp.permissions ? {
                                                    id: rp.permissions.id,
                                                    code: rp.permissions.code,
                                                    name: rp.permissions.name,
                                                    description: rp.permissions.description,
                                                    is_active: rp.permissions.is_active,
                                                } : null, role: rp.role ? {
                                                    idrole: rp.role.idrole,
                                                    description: rp.role.description,
                                                } : null })); })];
                                }
                            });
                        }); })];
                });
            });
        };
        RolePermissionService_1.prototype.update = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var role, permissionId, permission, current, newRoleId, newPermissionId, whereExisting, existing, updated, model;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Verificar que el role_permission existe
                        return [4 /*yield*/, this.findOne(id, false)];
                        case 1:
                            // Verificar que el role_permission existe
                            _a.sent();
                            if (!dto.role_id) return [3 /*break*/, 3];
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
                                    where: { idrole: dto.role_id },
                                })];
                        case 2:
                            role = _a.sent();
                            if (!role) {
                                throw new common_1.NotFoundException("Role with ID ".concat(dto.role_id, " not found"));
                            }
                            _a.label = 3;
                        case 3:
                            if (!dto.permission_code) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.permissionService.findByCode(dto.permission_code, false)];
                        case 4:
                            permission = _a.sent();
                            if (!permission) {
                                throw new common_1.NotFoundException("Permission with code '".concat(dto.permission_code, "' not found"));
                            }
                            permissionId = permission.id;
                            _a.label = 5;
                        case 5:
                            if (!(dto.role_id || dto.permission_code)) return [3 /*break*/, 8];
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.findUnique({
                                    where: { id: id },
                                })];
                        case 6:
                            current = _a.sent();
                            newRoleId = dto.role_id || current.role_id;
                            newPermissionId = permissionId || current.permission_id;
                            whereExisting = {
                                role_id: newRoleId,
                                permission_id: newPermissionId,
                                id: { not: id },
                            };
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.findFirst({
                                    where: whereExisting,
                                })];
                        case 7:
                            existing = _a.sent();
                            if (existing) {
                                throw new common_1.ConflictException("Role ".concat(newRoleId, " already has permission with code '").concat(dto.permission_code, "'"));
                            }
                            _a.label = 8;
                        case 8: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.update({
                                where: { id: id },
                                data: __assign(__assign(__assign({}, (dto.role_id && { role_id: dto.role_id })), (permissionId && { permission_id: permissionId })), (dto.is_active !== undefined && { is_active: dto.is_active })),
                            })];
                        case 9:
                            updated = _a.sent();
                            model = cacheable_factory_1.CacheableFactory.create(updated, role_permission_model_1.RolePermissionModel);
                            // Actualizar cache del item
                            return [4 /*yield*/, this.cacheSet(this.rolePermissionCacheKey, { id: updated.id }, model, model.cacheTTL())];
                        case 10:
                            // Actualizar cache del item
                            _a.sent();
                            // Invalidar cache de la lista
                            return [4 /*yield*/, this.invalidateListCaches()];
                        case 11:
                            // Invalidar cache de la lista
                            _a.sent();
                            return [2 /*return*/, model];
                    }
                });
            });
        };
        RolePermissionService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var updated, model;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Verificar que el role_permission existe
                        return [4 /*yield*/, this.findOne(id, false)];
                        case 1:
                            // Verificar que el role_permission existe
                            _a.sent();
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.update({
                                    where: { id: id },
                                    data: { is_active: false },
                                })];
                        case 2:
                            updated = _a.sent();
                            model = cacheable_factory_1.CacheableFactory.create(updated, role_permission_model_1.RolePermissionModel);
                            // Actualizar cache del item
                            return [4 /*yield*/, this.cacheSet(this.rolePermissionCacheKey, { id: updated.id }, model, model.cacheTTL())];
                        case 3:
                            // Actualizar cache del item
                            _a.sent();
                            // Invalidar cache de la lista
                            return [4 /*yield*/, this.invalidateListCaches()];
                        case 4:
                            // Invalidar cache de la lista
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Verifica si ya existe un rol con exactamente los mismos permisos activos
         * @param roleIdToExclude - ID del rol a excluir de la búsqueda (útil al actualizar un rol existente)
         * @param permissionIds - Array de IDs de permisos a comparar
         * @returns El rol duplicado si existe, null si no
         */
        RolePermissionService_1.prototype.findRoleWithSamePermissions = function (permissionIds, roleIdToExclude) {
            return __awaiter(this, void 0, void 0, function () {
                var where, allRoles, sortedTargetPermissions, _i, allRoles_1, role, rolePermissionIds;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = roleIdToExclude ? { idrole: { not: roleIdToExclude } } : {};
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findMany({
                                    where: where,
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
        RolePermissionService_1.prototype.assignPermissionsToRole = function (roleId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var role, permissions, foundIds_1, missingIds, inactivePermissions, inactiveCodes, duplicateRole, currentRolePermissions, currentPermissionIds, newPermissionIds, permissionsToDeactivate, permissionsToActivate, permissionsToCreate, rolePermissions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
                                where: {
                                    idrole: roleId,
                                },
                            })];
                        case 1:
                            role = _a.sent();
                            if (!role) {
                                throw new common_1.NotFoundException("Role with ID ".concat(roleId, " not found"));
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.permissions.findMany({
                                    where: {
                                        id: { in: dto.permission_ids },
                                    },
                                })];
                        case 2:
                            permissions = _a.sent();
                            if (permissions.length !== dto.permission_ids.length) {
                                foundIds_1 = permissions.map(function (p) { return p.id; });
                                missingIds = dto.permission_ids.filter(function (id) { return !foundIds_1.includes(id); });
                                throw new common_1.NotFoundException("Permissions not found: ".concat(missingIds.join(', ')));
                            }
                            inactivePermissions = permissions.filter(function (p) { return !p.is_active; });
                            if (inactivePermissions.length > 0) {
                                inactiveCodes = inactivePermissions.map(function (p) { return p.code; }).join(', ');
                                throw new common_1.ConflictException("Cannot assign inactive permissions: ".concat(inactiveCodes, ". Please activate them first"));
                            }
                            return [4 /*yield*/, this.findRoleWithSamePermissions(dto.permission_ids, roleId)];
                        case 3:
                            duplicateRole = _a.sent();
                            if (duplicateRole) {
                                throw new common_1.ConflictException("A role with the same permission set already exists: '".concat(duplicateRole.description, "' (ID: ").concat(duplicateRole.idrole, "). Cannot assign duplicate permission configurations"));
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
                                    where: {
                                        role_id: roleId,
                                    },
                                })];
                        case 4:
                            currentRolePermissions = _a.sent();
                            currentPermissionIds = currentRolePermissions.map(function (rp) { return rp.permission_id; });
                            newPermissionIds = dto.permission_ids;
                            permissionsToDeactivate = currentPermissionIds.filter(function (id) { return !newPermissionIds.includes(id); });
                            permissionsToActivate = newPermissionIds.filter(function (id) { return currentPermissionIds.includes(id); });
                            permissionsToCreate = newPermissionIds.filter(function (id) { return !currentPermissionIds.includes(id); });
                            if (!(permissionsToDeactivate.length > 0)) return [3 /*break*/, 6];
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.updateMany({
                                    where: {
                                        role_id: roleId,
                                        permission_id: { in: permissionsToDeactivate },
                                    },
                                    data: { is_active: false },
                                })];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            if (!(permissionsToActivate.length > 0)) return [3 /*break*/, 8];
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.updateMany({
                                    where: {
                                        role_id: roleId,
                                        permission_id: { in: permissionsToActivate },
                                    },
                                    data: { is_active: true },
                                })];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8:
                            if (!(permissionsToCreate.length > 0)) return [3 /*break*/, 10];
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.createMany({
                                    data: permissionsToCreate.map(function (permissionId) { return ({
                                        role_id: roleId,
                                        permission_id: permissionId,
                                        is_active: true,
                                    }); }),
                                })];
                        case 9:
                            _a.sent();
                            _a.label = 10;
                        case 10: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
                                where: {
                                    role_id: roleId,
                                },
                            })];
                        case 11:
                            rolePermissions = _a.sent();
                            // Invalidar cache
                            return [4 /*yield*/, this.invalidateListCaches()];
                        case 12:
                            // Invalidar cache
                            _a.sent();
                            return [2 /*return*/, rolePermissions.map(function (rp) { return cacheable_factory_1.CacheableFactory.create(rp, role_permission_model_1.RolePermissionModel); })];
                    }
                });
            });
        };
        RolePermissionService_1.prototype.deactivateAllPermissionsFromRole = function (roleId) {
            return __awaiter(this, void 0, void 0, function () {
                var role;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
                                where: { idrole: roleId },
                            })];
                        case 1:
                            role = _a.sent();
                            if (!role) {
                                throw new common_1.NotFoundException("Role with ID ".concat(roleId, " not found"));
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.updateMany({
                                    where: { role_id: roleId },
                                    data: { is_active: false },
                                })];
                        case 2:
                            _a.sent();
                            // Invalidar cache
                            return [4 /*yield*/, this.invalidateListCaches()];
                        case 3:
                            // Invalidar cache
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        RolePermissionService_1.prototype.removeAllPermissionsFromRole = function (roleId) {
            return __awaiter(this, void 0, void 0, function () {
                var role;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
                                where: { idrole: roleId },
                            })];
                        case 1:
                            role = _a.sent();
                            if (!role) {
                                throw new common_1.NotFoundException("Role with ID ".concat(roleId, " not found"));
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.deleteMany({
                                    where: { role_id: roleId },
                                })];
                        case 2:
                            _a.sent();
                            // Invalidar cache
                            return [4 /*yield*/, this.invalidateListCaches()];
                        case 3:
                            // Invalidar cache
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        RolePermissionService_1.prototype.invalidateListCaches = function () {
            return __awaiter(this, void 0, void 0, function () {
                var pattern, patternByRole, patternByPermission, patternByPermissionCode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cacheDelete(this.rolePermissionCacheKey, {
                                key: this.rolePermissionListSuffixKey,
                            })];
                        case 1:
                            _a.sent();
                            pattern = "".concat(this.rolePermissionCacheKey, ":").concat(this.rolePermissionListSuffixKey, "_paginated_*");
                            return [4 /*yield*/, this.cache.deletePattern(pattern)];
                        case 2:
                            _a.sent();
                            patternByRole = "".concat(this.rolePermissionCacheKey, ":by_role_*");
                            return [4 /*yield*/, this.cache.deletePattern(patternByRole)];
                        case 3:
                            _a.sent();
                            patternByPermission = "".concat(this.rolePermissionCacheKey, ":by_permission_*");
                            return [4 /*yield*/, this.cache.deletePattern(patternByPermission)];
                        case 4:
                            _a.sent();
                            patternByPermissionCode = "".concat(this.rolePermissionCacheKey, ":by_permission_code_*");
                            return [4 /*yield*/, this.cache.deletePattern(patternByPermissionCode)];
                        case 5:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return RolePermissionService_1;
    }(_classSuper));
    __setFunctionName(_classThis, "RolePermissionService");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RolePermissionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RolePermissionService = _classThis;
}();
exports.RolePermissionService = RolePermissionService;
