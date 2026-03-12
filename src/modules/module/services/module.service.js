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
exports.ModuleService = void 0;
var common_1 = require("@nestjs/common");
var module_model_1 = require("../models/module.model");
var base_paginated_service_1 = require("../../../../../../../../src/shared/common/services/base-paginated.service");
var service_cache_1 = require("../../../../../../../../src/shared/core/services/service-cache/service-cache");
var cacheable_factory_1 = require("../../../../../../../../src/shared/cache/factories/cacheable.factory");
var ModuleService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_paginated_service_1.BasePaginatedService;
    var ModuleService = _classThis = /** @class */ (function (_super) {
        __extends(ModuleService_1, _super);
        function ModuleService_1(cache, permissionService) {
            var _this = _super.call(this, cache) || this;
            _this.permissionService = permissionService;
            _this.moduleCacheKey = 'module';
            _this.moduleListSuffixKey = '_list';
            return _this;
        }
        ModuleService_1.prototype.create = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, created, model, _i, _a, actionId, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.module.findFirst({
                                where: { name: dto.name },
                            })];
                        case 1:
                            existing = _b.sent();
                            if (existing) {
                                throw new common_1.ConflictException("Module with name '".concat(dto.name, "' already exists"));
                            }
                            // Verificar que el módulo tenga slug si se van a crear permisos
                            if (dto.action_ids && dto.action_ids.length > 0 && !dto.slug) {
                                throw new common_1.ConflictException('Module must have a slug to create permissions automatically');
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.module.create({
                                    data: {
                                        name: dto.name,
                                        module: dto.module,
                                        description: dto.description || null,
                                        slug: dto.slug || null,
                                    },
                                })];
                        case 2:
                            created = _b.sent();
                            model = cacheable_factory_1.CacheableFactory.create(created, module_model_1.ModuleModel);
                            // Actualizar cache del item creado
                            return [4 /*yield*/, this.cacheSet(this.moduleCacheKey, { id: created.id }, model, model.cacheTTL())];
                        case 3:
                            // Actualizar cache del item creado
                            _b.sent();
                            // Invalidar cache de la lista
                            return [4 /*yield*/, this.invalidateListCaches()];
                        case 4:
                            // Invalidar cache de la lista
                            _b.sent();
                            if (!(dto.action_ids && dto.action_ids.length > 0)) return [3 /*break*/, 10];
                            _i = 0, _a = dto.action_ids;
                            _b.label = 5;
                        case 5:
                            if (!(_i < _a.length)) return [3 /*break*/, 10];
                            actionId = _a[_i];
                            _b.label = 6;
                        case 6:
                            _b.trys.push([6, 8, , 9]);
                            return [4 /*yield*/, this.permissionService.create({
                                    module_id: created.id,
                                    action_id: actionId,
                                    is_active: true,
                                })];
                        case 7:
                            _b.sent();
                            return [3 /*break*/, 9];
                        case 8:
                            error_1 = _b.sent();
                            // Si el permiso ya existe, continuar con el siguiente
                            if (error_1 instanceof common_1.ConflictException) {
                                console.log("Permission already exists for module ".concat(created.id, " and action ").concat(actionId));
                                return [3 /*break*/, 9];
                            }
                            throw error_1;
                        case 9:
                            _i++;
                            return [3 /*break*/, 5];
                        case 10: return [2 /*return*/, model];
                    }
                });
            });
        };
        ModuleService_1.prototype.findAll = function () {
            return __awaiter(this, arguments, void 0, function (useCache) {
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tryCacheOrExecute(this.moduleCacheKey, { key: this.moduleListSuffixKey }, useCache, function () { return __awaiter(_this, void 0, void 0, function () {
                            var modules;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.module.findMany({
                                            orderBy: { name: 'asc' },
                                        })];
                                    case 1:
                                        modules = _a.sent();
                                        return [2 /*return*/, modules.map(function (module) {
                                                return cacheable_factory_1.CacheableFactory.create(module, module_model_1.ModuleModel);
                                            })];
                                }
                            });
                        }); })];
                });
            });
        };
        ModuleService_1.prototype.findOne = function (id_1) {
            return __awaiter(this, arguments, void 0, function (id, useCache) {
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tryCacheOrExecute(this.moduleCacheKey, { id: id }, useCache, function () { return __awaiter(_this, void 0, void 0, function () {
                            var module;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.module.findUnique({
                                            where: { id: id },
                                        })];
                                    case 1:
                                        module = _a.sent();
                                        if (!module) {
                                            throw new common_1.NotFoundException("Module with ID ".concat(id, " not found"));
                                        }
                                        return [2 /*return*/, cacheable_factory_1.CacheableFactory.create(module, module_model_1.ModuleModel)];
                                }
                            });
                        }); })];
                });
            });
        };
        ModuleService_1.prototype.findByUuid = function (uuid_1) {
            return __awaiter(this, arguments, void 0, function (uuid, useCache) {
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tryCacheOrExecute(this.moduleCacheKey, { uuid: uuid }, useCache, function () { return __awaiter(_this, void 0, void 0, function () {
                            var module;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.module.findFirst({
                                            where: { uuid: uuid },
                                        })];
                                    case 1:
                                        module = _a.sent();
                                        if (!module) {
                                            throw new common_1.NotFoundException("Module with UUID ".concat(uuid, " not found"));
                                        }
                                        return [2 /*return*/, cacheable_factory_1.CacheableFactory.create(module, module_model_1.ModuleModel)];
                                }
                            });
                        }); })];
                });
            });
        };
        ModuleService_1.prototype.update = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, updated, model;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Verificar si existe
                        return [4 /*yield*/, this.findOne(id, false)];
                        case 1:
                            // Verificar si existe
                            _a.sent();
                            if (!dto.name) return [3 /*break*/, 3];
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.module.findFirst({
                                    where: {
                                        name: dto.name,
                                        NOT: { id: id },
                                    },
                                })];
                        case 2:
                            existing = _a.sent();
                            if (existing) {
                                throw new common_1.ConflictException("Module with name '".concat(dto.name, "' already exists"));
                            }
                            _a.label = 3;
                        case 3: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.module.update({
                                where: { id: id },
                                data: dto,
                            })];
                        case 4:
                            updated = _a.sent();
                            model = cacheable_factory_1.CacheableFactory.create(updated, module_model_1.ModuleModel);
                            // Actualizar cache del item
                            return [4 /*yield*/, this.cacheSet(this.moduleCacheKey, { id: updated.id }, model, model.cacheTTL())];
                        case 5:
                            // Actualizar cache del item
                            _a.sent();
                            // Invalidar cache de la lista
                            return [4 /*yield*/, this.invalidateListCaches()];
                        case 6:
                            // Invalidar cache de la lista
                            _a.sent();
                            return [2 /*return*/, model];
                    }
                });
            });
        };
        ModuleService_1.prototype.delete = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var permissions, permissionIds, deletedRolePermissions, deletedPermissions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Verificar si existe
                        return [4 /*yield*/, this.findOne(id, false)];
                        case 1:
                            // Verificar si existe
                            _a.sent();
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.permissions.findMany({
                                    where: { module_id: id },
                                    select: { id: true },
                                })];
                        case 2:
                            permissions = _a.sent();
                            permissionIds = permissions.map(function (p) { return p.id; });
                            console.log("\uD83D\uDDD1\uFE0F Module ".concat(id, " has ").concat(permissionIds.length, " permissions to delete"));
                            if (!(permissionIds.length > 0)) return [3 /*break*/, 6];
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.deleteMany({
                                    where: {
                                        permission_id: { in: permissionIds },
                                    },
                                })];
                        case 3:
                            deletedRolePermissions = _a.sent();
                            console.log("\uD83D\uDDD1\uFE0F Deleted ".concat(deletedRolePermissions.count, " role_permissions records"));
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.permissions.deleteMany({
                                    where: {
                                        module_id: id,
                                    },
                                })];
                        case 4:
                            deletedPermissions = _a.sent();
                            console.log("\uD83D\uDDD1\uFE0F Deleted ".concat(deletedPermissions.count, " permissions"));
                            // Invalidar cache de permisos
                            return [4 /*yield*/, this.permissionService['invalidateListCaches']()];
                        case 5:
                            // Invalidar cache de permisos
                            _a.sent();
                            _a.label = 6;
                        case 6: 
                        // 4. Finalmente eliminar el módulo
                        return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.module.delete({
                                where: { id: id },
                            })];
                        case 7:
                            // 4. Finalmente eliminar el módulo
                            _a.sent();
                            console.log("\u2705 Module ".concat(id, " deleted successfully"));
                            // Invalidar cache del item
                            return [4 /*yield*/, this.cacheDelete(this.moduleCacheKey, { id: id })];
                        case 8:
                            // Invalidar cache del item
                            _a.sent();
                            // Invalidar cache de la lista
                            return [4 /*yield*/, this.invalidateListCaches()];
                        case 9:
                            // Invalidar cache de la lista
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ModuleService_1.prototype.bulkDelete = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var ids, permissions, permissionIds, deletedRolePermissions, deletedPermissions, result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ids = dto.ids;
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.permissions.findMany({
                                    where: { module_id: { in: ids } },
                                    select: { id: true },
                                })];
                        case 1:
                            permissions = _a.sent();
                            permissionIds = permissions.map(function (p) { return p.id; });
                            console.log("\uD83D\uDDD1\uFE0F Modules ".concat(ids.join(', '), " have ").concat(permissionIds.length, " permissions to delete"));
                            if (!(permissionIds.length > 0)) return [3 /*break*/, 5];
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role_permissions.deleteMany({
                                    where: {
                                        permission_id: { in: permissionIds },
                                    },
                                })];
                        case 2:
                            deletedRolePermissions = _a.sent();
                            console.log("\uD83D\uDDD1\uFE0F Deleted ".concat(deletedRolePermissions.count, " role_permissions records"));
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.permissions.deleteMany({
                                    where: {
                                        module_id: { in: ids },
                                    },
                                })];
                        case 3:
                            deletedPermissions = _a.sent();
                            console.log("\uD83D\uDDD1\uFE0F Deleted ".concat(deletedPermissions.count, " permissions"));
                            // Invalidar cache de permisos
                            return [4 /*yield*/, this.permissionService['invalidateListCaches']()];
                        case 4:
                            // Invalidar cache de permisos
                            _a.sent();
                            _a.label = 5;
                        case 5: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.module.deleteMany({
                                where: {
                                    id: { in: ids },
                                },
                            })];
                        case 6:
                            result = _a.sent();
                            console.log("\u2705 ".concat(result.count, " modules deleted successfully"));
                            // Invalidar cache de todos los items eliminados
                            return [4 /*yield*/, Promise.all(ids.map(function (id) { return _this.cacheDelete(_this.moduleCacheKey, { id: id }); }))];
                        case 7:
                            // Invalidar cache de todos los items eliminados
                            _a.sent();
                            // Invalidar cache de la lista
                            return [4 /*yield*/, this.invalidateListCaches()];
                        case 8:
                            // Invalidar cache de la lista
                            _a.sent();
                            return [2 /*return*/, { deleted: result.count }];
                    }
                });
            });
        };
        ModuleService_1.prototype.invalidateListCaches = function () {
            return __awaiter(this, void 0, void 0, function () {
                var pattern;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pattern = "".concat(this.moduleCacheKey, ":").concat(this.moduleListSuffixKey, "*");
                            return [4 /*yield*/, this.cache.deletePattern(pattern)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return ModuleService_1;
    }(_classSuper));
    __setFunctionName(_classThis, "ModuleService");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ModuleService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ModuleService = _classThis;
}();
exports.ModuleService = ModuleService;
