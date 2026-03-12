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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var base_paginated_service_1 = require("../../../../../../../../../src/shared/common/services/base-paginated.service");
var service_cache_1 = require("../../../../../../../../../src/shared/core/services/service-cache/service-cache");
var error_factory_1 = require("../../../../../../../../../src/shared/errors/error.factory");
var error_codes_enum_1 = require("../../../../../../../../../src/shared/errors/error-codes.enum");
var UsersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_paginated_service_1.BasePaginatedService;
    var UsersService = _classThis = /** @class */ (function (_super) {
        __extends(UsersService_1, _super);
        function UsersService_1(cache) {
            return _super.call(this, cache) || this;
        }
        /**
         * Listar usuarios con paginación y filtros
         */
        UsersService_1.prototype.listUsers = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var filters;
                var _this = this;
                return __generator(this, function (_a) {
                    filters = {};
                    // Aplicar filtros
                    if (dto.userEmail) {
                        filters.userEmail = { contains: dto.userEmail, mode: 'insensitive' };
                    }
                    if (dto.userName) {
                        filters.userName = { contains: dto.userName, mode: 'insensitive' };
                    }
                    if (dto.role_idrole !== undefined) {
                        filters.role = dto.role_idrole;
                    }
                    if (dto.is_active !== undefined) {
                        filters.is_active = dto.is_active;
                    }
                    // Búsqueda general
                    if (dto.search) {
                        filters.OR = [
                            { userEmail: { contains: dto.search, mode: 'insensitive' } },
                            { userName: { contains: dto.search, mode: 'insensitive' } },
                            { userLastName: { contains: dto.search, mode: 'insensitive' } },
                        ];
                    }
                    return [2 /*return*/, this.executePaginatedQuery('users_list', dto, function (params) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, data, total;
                            var _b;
                            var _this = this;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, Promise.all([
                                            service_cache_1.ServiceCache.Database.Prisma.sysUser.findMany({
                                                where: filters,
                                                skip: params.skip,
                                                take: params.limit,
                                                orderBy: (_b = {}, _b[params.sortBy] = params.sortOrder, _b),
                                                select: {
                                                    idsysUser: true,
                                                    uuid: true,
                                                    userEmail: true,
                                                    userName: true,
                                                    userLastName: true,
                                                    userPhone: true,
                                                    is_active: true,
                                                    created_at: true,
                                                    role_sysUser_roleTorole: {
                                                        select: {
                                                            idrole: true,
                                                            description: true,
                                                        },
                                                    },
                                                },
                                            }),
                                            service_cache_1.ServiceCache.Database.Prisma.sysUser.count({ where: filters }),
                                        ])];
                                    case 1:
                                        _a = _c.sent(), data = _a[0], total = _a[1];
                                        return [2 /*return*/, { data: data.map(function (user) { return _this.mapUserRole(user); }), total: total }];
                                }
                            });
                        }); }, true, { filters: filters })];
                });
            });
        };
        /**
         * Obtener usuario por UUID
         */
        UsersService_1.prototype.getUserByUuid = function (uuid) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey;
                var _this = this;
                return __generator(this, function (_a) {
                    cacheKey = "user_uuid_".concat(uuid);
                    return [2 /*return*/, this.tryCacheOrExecute('user_by_uuid', { key: cacheKey }, true, function () { return __awaiter(_this, void 0, void 0, function () {
                            var user;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.findFirst({
                                            where: { uuid: uuid },
                                            select: {
                                                idsysUser: true,
                                                uuid: true,
                                                userEmail: true,
                                                userName: true,
                                                userLastName: true,
                                                userPhone: true,
                                                is_active: true,
                                                created_at: true,
                                                role_sysUser_roleTorole: {
                                                    select: {
                                                        idrole: true,
                                                        description: true,
                                                    },
                                                },
                                            },
                                        })];
                                    case 1:
                                        user = _a.sent();
                                        if (!user) {
                                            error_factory_1.ErrorFactory.throw({
                                                status: error_codes_enum_1.ErrorCodesEnum.NOT_FOUND,
                                                message: 'User not found',
                                            });
                                        }
                                        return [2 /*return*/, this.mapUserRole(user)];
                                }
                            });
                        }); })];
                });
            });
        };
        /**
         * Obtener usuario por ID
         */
        UsersService_1.prototype.getUserById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey;
                var _this = this;
                return __generator(this, function (_a) {
                    cacheKey = "user_id_".concat(id);
                    return [2 /*return*/, this.tryCacheOrExecute('user_by_id', { key: cacheKey }, true, function () { return __awaiter(_this, void 0, void 0, function () {
                            var user;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.findUnique({
                                            where: { idsysUser: id },
                                            select: {
                                                idsysUser: true,
                                                uuid: true,
                                                userEmail: true,
                                                userName: true,
                                                userLastName: true,
                                                userPhone: true,
                                                is_active: true,
                                                created_at: true,
                                                role_sysUser_roleTorole: {
                                                    select: {
                                                        idrole: true,
                                                        description: true,
                                                    },
                                                },
                                            },
                                        })];
                                    case 1:
                                        user = _a.sent();
                                        if (!user) {
                                            error_factory_1.ErrorFactory.throw({
                                                status: error_codes_enum_1.ErrorCodesEnum.NOT_FOUND,
                                                message: 'User not found',
                                            });
                                        }
                                        return [2 /*return*/, this.mapUserRole(user)];
                                }
                            });
                        }); })];
                });
            });
        };
        /**
         * Actualizar usuario
         */
        UsersService_1.prototype.updateUser = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existingUser, role_idrole, rest, updatedUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Verificar que el usuario existe
                        return [4 /*yield*/, this.getUserById(id)];
                        case 1:
                            // Verificar que el usuario existe
                            _a.sent();
                            if (!dto.userEmail) return [3 /*break*/, 3];
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.findFirst({
                                    where: {
                                        userEmail: dto.userEmail,
                                        idsysUser: { not: id },
                                    },
                                })];
                        case 2:
                            existingUser = _a.sent();
                            if (existingUser) {
                                error_factory_1.ErrorFactory.throw({
                                    status: error_codes_enum_1.ErrorCodesEnum.BAD_REQUEST,
                                    message: 'Email already in use by another user',
                                });
                            }
                            _a.label = 3;
                        case 3:
                            role_idrole = dto.role_idrole, rest = __rest(dto, ["role_idrole"]);
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.update({
                                    where: { idsysUser: id },
                                    data: __assign(__assign({}, rest), (role_idrole !== undefined ? { role: role_idrole } : {})),
                                    select: {
                                        idsysUser: true,
                                        uuid: true,
                                        userEmail: true,
                                        userName: true,
                                        userLastName: true,
                                        userPhone: true,
                                        is_active: true,
                                        role_sysUser_roleTorole: {
                                            select: {
                                                idrole: true,
                                                description: true,
                                            },
                                        },
                                    },
                                })];
                        case 4:
                            updatedUser = _a.sent();
                            // Invalidar caches
                            return [4 /*yield*/, this.invalidateUserCaches(id, updatedUser.uuid)];
                        case 5:
                            // Invalidar caches
                            _a.sent();
                            return [2 /*return*/, this.mapUserRole(updatedUser)];
                    }
                });
            });
        };
        /**
         * Eliminar usuario (soft delete)
         */
        UsersService_1.prototype.deleteUser = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getUserById(id)];
                        case 1:
                            user = _a.sent();
                            // Desactivar usuario en lugar de eliminarlo
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.update({
                                    where: { idsysUser: id },
                                    data: { is_active: false },
                                })];
                        case 2:
                            // Desactivar usuario en lugar de eliminarlo
                            _a.sent();
                            // Invalidar caches
                            return [4 /*yield*/, this.invalidateUserCaches(id, user.uuid)];
                        case 3:
                            // Invalidar caches
                            _a.sent();
                            return [2 /*return*/, { message: 'User deactivated successfully' }];
                    }
                });
            });
        };
        /**
         * Cambiar contraseña de usuario
         */
        UsersService_1.prototype.changePassword = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isValidPassword, hashedPassword;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.findUnique({
                                where: { idsysUser: id },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                error_factory_1.ErrorFactory.throw({
                                    status: error_codes_enum_1.ErrorCodesEnum.NOT_FOUND,
                                    message: 'User not found',
                                });
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Authorization.PasswordService.validatePassword(dto.currentPassword, user.userPassword || '')];
                        case 2:
                            isValidPassword = _a.sent();
                            if (!isValidPassword) {
                                error_factory_1.ErrorFactory.throw({
                                    status: error_codes_enum_1.ErrorCodesEnum.UNAUTHORIZED,
                                    message: 'Current password is incorrect',
                                });
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Authorization.PasswordService.hashPassword(dto.newPassword)];
                        case 3:
                            hashedPassword = _a.sent();
                            // Actualizar contraseña
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.update({
                                    where: { idsysUser: id },
                                    data: { userPassword: hashedPassword },
                                })];
                        case 4:
                            // Actualizar contraseña
                            _a.sent();
                            return [2 /*return*/, { message: 'Password changed successfully' }];
                    }
                });
            });
        };
        /**
         * Invalidar todas las caches relacionadas con un usuario
         */
        UsersService_1.prototype.invalidateUserCaches = function (userId, uuid) {
            return __awaiter(this, void 0, void 0, function () {
                var tasks;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tasks = [
                                this.cache.delete("user_id_".concat(userId)),
                                this.invalidatePaginationCaches('users_list'),
                            ];
                            if (uuid) {
                                tasks.push(this.cache.delete("user_uuid_".concat(uuid)));
                            }
                            return [4 /*yield*/, Promise.all(tasks)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        UsersService_1.prototype.mapUserRole = function (user) {
            if (!user) {
                return user;
            }
            var _a = user, role_sysUser_roleTorole = _a.role_sysUser_roleTorole, rest = __rest(_a, ["role_sysUser_roleTorole"]);
            return __assign(__assign({}, rest), { role: role_sysUser_roleTorole !== null && role_sysUser_roleTorole !== void 0 ? role_sysUser_roleTorole : null });
        };
        return UsersService_1;
    }(_classSuper));
    __setFunctionName(_classThis, "UsersService");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UsersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsersService = _classThis;
}();
exports.UsersService = UsersService;
