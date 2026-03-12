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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionService = void 0;
var common_1 = require("@nestjs/common");
var permission_model_1 = require("../models/permission.model");
var base_paginated_service_1 = require("../../../../../../../../src/shared/common/services/base-paginated.service");
var service_cache_1 = require("../../../../../../../../src/shared/core/services/service-cache/service-cache");
var cacheable_factory_1 = require("../../../../../../../../src/shared/cache/factories/cacheable.factory");
var pagination_dto_1 = require("../../../../../../../../src/shared/common/dtos/pagination.dto");
var pagination_utils_1 = require("../../../../../../../../src/shared/common/utils/pagination.utils");
var PermissionService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_paginated_service_1.BasePaginatedService;
    var PermissionService = _classThis = /** @class */ (function (_super) {
        __extends(PermissionService_1, _super);
        function PermissionService_1(cache) {
            var _this = _super.call(this, cache) || this;
            _this.permissionCacheKey = 'permission';
            _this.permissionListSuffixKey = '_list';
            return _this;
        }
        PermissionService_1.prototype.create = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var moduleExists, actionExists, generatedCode, generatedName, existing, created, model;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.module.findUnique({
                                where: { id: dto.module_id },
                            })];
                        case 1:
                            moduleExists = _b.sent();
                            if (!moduleExists) {
                                throw new common_1.NotFoundException("Module with ID ".concat(dto.module_id, " not found"));
                            }
                            if (!moduleExists.slug) {
                                throw new common_1.ConflictException("Module with ID ".concat(dto.module_id, " does not have a slug defined"));
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.actions.findUnique({
                                    where: { id: dto.action_id },
                                })];
                        case 2:
                            actionExists = _b.sent();
                            if (!actionExists) {
                                throw new common_1.NotFoundException("Action with ID ".concat(dto.action_id, " not found"));
                            }
                            if (!actionExists.slug) {
                                throw new common_1.ConflictException("Action with ID ".concat(dto.action_id, " does not have a slug defined"));
                            }
                            generatedCode = "".concat(actionExists.slug, ":").concat(moduleExists.slug);
                            generatedName = "".concat(actionExists.description || actionExists.slug, " ").concat(moduleExists.slug);
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.permissions.findFirst({
                                    where: { code: generatedCode },
                                })];
                        case 3:
                            existing = _b.sent();
                            if (existing) {
                                throw new common_1.ConflictException("Permission with code '".concat(generatedCode, "' already exists (module: ").concat(moduleExists.slug, ", action: ").concat(actionExists.slug, ")"));
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.permissions.create({
                                    data: {
                                        code: generatedCode,
                                        name: dto.name || generatedName,
                                        description: dto.description || null,
                                        is_active: (_a = dto.is_active) !== null && _a !== void 0 ? _a : true,
                                        action_id: dto.action_id,
                                        module_id: dto.module_id,
                                    },
                                })];
                        case 4:
                            created = _b.sent();
                            model = cacheable_factory_1.CacheableFactory.create(created, permission_model_1.PermissionModel);
                            // Actualizar cache del item creado
                            return [4 /*yield*/, this.cacheSet(this.permissionCacheKey, { id: created.id }, model, model.cacheTTL())];
                        case 5:
                            // Actualizar cache del item creado
                            _b.sent();
                            // Invalidar cache de la lista
                            return [4 /*yield*/, this.invalidateListCaches()];
                        case 6:
                            // Invalidar cache de la lista
                            _b.sent();
                            // Crear automáticamente role_permissions para todos los roles en todos los tenants
                            return [4 /*yield*/, this.createRolePermissionsForNewPermission(created.id)];
                        case 7:
                            // Crear automáticamente role_permissions para todos los roles en todos los tenants
                            _b.sent();
                            return [2 /*return*/, model];
                    }
                });
            });
        };
        PermissionService_1.prototype.findAll = function () {
            return __awaiter(this, arguments, void 0, function (useCache) {
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tryCacheOrExecute(this.permissionCacheKey, { key: this.permissionListSuffixKey }, useCache, function () { return __awaiter(_this, void 0, void 0, function () {
                            var permissions;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.permissions.findMany({
                                            orderBy: { code: 'asc' },
                                        })];
                                    case 1:
                                        permissions = _a.sent();
                                        return [2 /*return*/, permissions.map(function (permission) {
                                                return cacheable_factory_1.CacheableFactory.create(permission, permission_model_1.PermissionModel);
                                            })];
                                }
                            });
                        }); })];
                });
            });
        };
        PermissionService_1.prototype.findAllPaginated = function (paginationDto_1) {
            return __awaiter(this, arguments, void 0, function (paginationDto, useCache) {
                var _a, page, _b, limit, is_active, search, cacheKey;
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                return __generator(this, function (_c) {
                    _a = paginationDto.page, page = _a === void 0 ? 1 : _a, _b = paginationDto.limit, limit = _b === void 0 ? 10 : _b, is_active = paginationDto.is_active, search = paginationDto.search;
                    cacheKey = "".concat(this.permissionListSuffixKey, "_paginated_").concat(page, "_").concat(limit, "_").concat(is_active, "_").concat(search);
                    return [2 /*return*/, this.tryCacheOrExecute(this.permissionCacheKey, { key: cacheKey }, useCache, function () { return __awaiter(_this, void 0, void 0, function () {
                            var where, _a, permissions, total, items;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        where = {};
                                        if (is_active !== undefined) {
                                            where.is_active = is_active;
                                        }
                                        if (search) {
                                            where.OR = [
                                                { code: { contains: search, mode: 'insensitive' } },
                                                { name: { contains: search, mode: 'insensitive' } },
                                            ];
                                        }
                                        return [4 /*yield*/, Promise.all([
                                                service_cache_1.ServiceCache.Database.Prisma.permissions.findMany({
                                                    where: where,
                                                    skip: (page - 1) * limit,
                                                    take: limit,
                                                    orderBy: { code: 'asc' },
                                                }),
                                                service_cache_1.ServiceCache.Database.Prisma.permissions.count({ where: where }),
                                            ])];
                                    case 1:
                                        _a = _b.sent(), permissions = _a[0], total = _a[1];
                                        items = permissions.map(function (permission) {
                                            return cacheable_factory_1.CacheableFactory.create(permission, permission_model_1.PermissionModel);
                                        });
                                        return [2 /*return*/, pagination_utils_1.PaginationUtils.createPaginatedResponse(items, new pagination_dto_1.PaginationParams({ page: page, limit: limit }), total)];
                                }
                            });
                        }); })];
                });
            });
        };
        PermissionService_1.prototype.findOne = function (id_1) {
            return __awaiter(this, arguments, void 0, function (id, useCache) {
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tryCacheOrExecute(this.permissionCacheKey, { id: id }, useCache, function () { return __awaiter(_this, void 0, void 0, function () {
                            var permission;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.permissions.findUnique({
                                            where: { id: id },
                                        })];
                                    case 1:
                                        permission = _a.sent();
                                        if (!permission) {
                                            throw new common_1.NotFoundException("Permission with ID ".concat(id, " not found"));
                                        }
                                        return [2 /*return*/, cacheable_factory_1.CacheableFactory.create(permission, permission_model_1.PermissionModel)];
                                }
                            });
                        }); })];
                });
            });
        };
        PermissionService_1.prototype.findByCode = function (code_1) {
            return __awaiter(this, arguments, void 0, function (code, useCache) {
                var cacheKey;
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                return __generator(this, function (_a) {
                    cacheKey = "by_code_".concat(code);
                    return [2 /*return*/, this.tryCacheOrExecute(this.permissionCacheKey, { key: cacheKey }, useCache, function () { return __awaiter(_this, void 0, void 0, function () {
                            var permission;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.permissions.findFirst({
                                            where: { code: code },
                                        })];
                                    case 1:
                                        permission = _a.sent();
                                        if (!permission) {
                                            return [2 /*return*/, null];
                                        }
                                        return [2 /*return*/, cacheable_factory_1.CacheableFactory.create(permission, permission_model_1.PermissionModel)];
                                }
                            });
                        }); })];
                });
            });
        };
        PermissionService_1.prototype.update = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var currentPermission, newCode, moduleId, actionId, moduleExists, actionExists, existing, updated, model;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.findOne(id, false)];
                        case 1:
                            currentPermission = _c.sent();
                            if (!(dto.module_id || dto.action_id)) return [3 /*break*/, 5];
                            moduleId = (_a = dto.module_id) !== null && _a !== void 0 ? _a : currentPermission.module_id;
                            actionId = (_b = dto.action_id) !== null && _b !== void 0 ? _b : currentPermission.action_id;
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.module.findUnique({
                                    where: { id: moduleId },
                                })];
                        case 2:
                            moduleExists = _c.sent();
                            if (!moduleExists) {
                                throw new common_1.NotFoundException("Module with ID ".concat(moduleId, " not found"));
                            }
                            if (!moduleExists.slug) {
                                throw new common_1.ConflictException("Module with ID ".concat(moduleId, " does not have a slug defined"));
                            }
                            // Verificar que el action existe y tiene slug
                            if (!actionId) {
                                throw new common_1.ConflictException("Action ID is required to generate permission code");
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.actions.findUnique({
                                    where: { id: actionId },
                                })];
                        case 3:
                            actionExists = _c.sent();
                            if (!actionExists) {
                                throw new common_1.NotFoundException("Action with ID ".concat(actionId, " not found"));
                            }
                            if (!actionExists.slug) {
                                throw new common_1.ConflictException("Action with ID ".concat(actionId, " does not have a slug defined"));
                            }
                            // Generar nuevo código: action:module
                            newCode = "".concat(actionExists.slug, ":").concat(moduleExists.slug);
                            if (!(newCode !== currentPermission.code)) return [3 /*break*/, 5];
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.permissions.findFirst({
                                    where: {
                                        code: newCode,
                                        id: { not: id },
                                    },
                                })];
                        case 4:
                            existing = _c.sent();
                            if (existing) {
                                throw new common_1.ConflictException("Permission with code '".concat(newCode, "' already exists (module: ").concat(moduleExists.slug, ", action: ").concat(actionExists.slug, ")"));
                            }
                            _c.label = 5;
                        case 5: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.permissions.update({
                                where: { id: id },
                                data: __assign(__assign(__assign(__assign(__assign(__assign({}, (newCode && { code: newCode })), (dto.name && { name: dto.name })), (dto.description !== undefined && { description: dto.description })), (dto.is_active !== undefined && { is_active: dto.is_active })), (dto.action_id !== undefined && { action_id: dto.action_id })), (dto.module_id !== undefined && { module_id: dto.module_id })),
                            })];
                        case 6:
                            updated = _c.sent();
                            model = cacheable_factory_1.CacheableFactory.create(updated, permission_model_1.PermissionModel);
                            // Actualizar cache del item
                            return [4 /*yield*/, this.cacheSet(this.permissionCacheKey, { id: updated.id }, model, model.cacheTTL())];
                        case 7:
                            // Actualizar cache del item
                            _c.sent();
                            // Invalidar cache de la lista
                            return [4 /*yield*/, this.invalidateListCaches()];
                        case 8:
                            // Invalidar cache de la lista
                            _c.sent();
                            return [2 /*return*/, model];
                    }
                });
            });
        };
        PermissionService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var rolePermissions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Verificar que el permiso existe
                        return [4 /*yield*/, this.findOne(id, false)];
                        case 1:
                            // Verificar que el permiso existe
                            _a.sent();
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.count({
                                    where: { permission_id: id },
                                })];
                        case 2:
                            rolePermissions = _a.sent();
                            if (rolePermissions > 0) {
                                throw new common_1.ConflictException("Cannot delete permission with ID ".concat(id, " because it has ").concat(rolePermissions, " role(s) associated"));
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.permissions.delete({
                                    where: { id: id },
                                })];
                        case 3:
                            _a.sent();
                            // Invalidar cache
                            return [4 /*yield*/, this.cacheDelete(this.permissionCacheKey, { id: id })];
                        case 4:
                            // Invalidar cache
                            _a.sent();
                            return [4 /*yield*/, this.invalidateListCaches()];
                        case 5:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Crea automáticamente registros en role_permissions para todos los roles
         * @param permissionId - ID del permiso recién creado
         */
        PermissionService_1.prototype.createRolePermissionsForNewPermission = function (permissionId) {
            return __awaiter(this, void 0, void 0, function () {
                var allRoles, rolePermissionsToCreate, _i, allRoles_1, role, recordToCreate, existingRecords, result, afterCreate, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findMany({
                                select: {
                                    idrole: true,
                                    description: true,
                                    is_super: true,
                                },
                            })];
                        case 1:
                            allRoles = _a.sent();
                            console.log("\uD83D\uDD0D Found ".concat(allRoles.length, " roles to process"));
                            rolePermissionsToCreate = [];
                            // Para cada rol, crear un registro
                            for (_i = 0, allRoles_1 = allRoles; _i < allRoles_1.length; _i++) {
                                role = allRoles_1[_i];
                                recordToCreate = {
                                    role_id: role.idrole,
                                    permission_id: permissionId,
                                    is_active: role.is_super === true, // Solo activo si es super role
                                };
                                console.log("  \u2795 Preparing record: role_id=".concat(recordToCreate.role_id, ", permission_id=").concat(recordToCreate.permission_id, ", is_active=").concat(recordToCreate.is_active));
                                rolePermissionsToCreate.push(recordToCreate);
                            }
                            console.log("\uD83D\uDCE6 Prepared ".concat(rolePermissionsToCreate.length, " role_permissions to create"));
                            console.log("\uD83D\uDCCA Breakdown: ".concat(JSON.stringify(rolePermissionsToCreate, null, 2)));
                            if (!(rolePermissionsToCreate.length > 0)) return [3 /*break*/, 8];
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
                                    where: {
                                        permission_id: permissionId,
                                    },
                                    select: {
                                        id: true,
                                        role_id: true,
                                        permission_id: true,
                                        is_active: true,
                                    },
                                })];
                        case 2:
                            existingRecords = _a.sent();
                            console.log("\uD83D\uDD0D Found ".concat(existingRecords.length, " existing role_permissions for permission ").concat(permissionId, ":"));
                            if (existingRecords.length > 0) {
                                console.log(JSON.stringify(existingRecords, null, 2));
                            }
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 7, , 8]);
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.createMany({
                                    data: rolePermissionsToCreate,
                                    skipDuplicates: true,
                                })];
                        case 4:
                            result = _a.sent();
                            console.log("\u2705 Successfully created ".concat(result.count, " role_permissions for permission ").concat(permissionId));
                            if (!(result.count !== rolePermissionsToCreate.length)) return [3 /*break*/, 6];
                            console.warn("\u26A0\uFE0F WARNING: Prepared ".concat(rolePermissionsToCreate.length, " but only created ").concat(result.count, ". This means ").concat(rolePermissionsToCreate.length - result.count, " were skipped as duplicates."));
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
                                    where: {
                                        permission_id: permissionId,
                                    },
                                    select: {
                                        id: true,
                                        role_id: true,
                                        permission_id: true,
                                        is_active: true,
                                    },
                                })];
                        case 5:
                            afterCreate = _a.sent();
                            console.log("\uD83D\uDCCA After creation, total records for permission ".concat(permissionId, ": ").concat(afterCreate.length));
                            console.log(JSON.stringify(afterCreate, null, 2));
                            _a.label = 6;
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            error_1 = _a.sent();
                            console.error("\u274C Error creating role_permissions:", error_1);
                            throw error_1;
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        PermissionService_1.prototype.invalidateListCaches = function () {
            return __awaiter(this, void 0, void 0, function () {
                var pattern, patternByCode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cacheDelete(this.permissionCacheKey, {
                                key: this.permissionListSuffixKey,
                            })];
                        case 1:
                            _a.sent();
                            pattern = "".concat(this.permissionCacheKey, ":").concat(this.permissionListSuffixKey, "_paginated_*");
                            return [4 /*yield*/, this.cache.deletePattern(pattern)];
                        case 2:
                            _a.sent();
                            patternByCode = "".concat(this.permissionCacheKey, ":by_code_*");
                            return [4 /*yield*/, this.cache.deletePattern(patternByCode)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return PermissionService_1;
    }(_classSuper));
    __setFunctionName(_classThis, "PermissionService");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PermissionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PermissionService = _classThis;
}();
exports.PermissionService = PermissionService;
