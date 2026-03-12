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
exports.UsersExampleController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
var dual_role_guard_1 = require("../guards/dual-role.guard");
var dual_roles_decorator_1 = require("../decorators/dual-roles.decorator");
var roles_enum_1 = require("../constants/roles.enum");
var UsersExampleController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Users Management'), (0, swagger_1.ApiBearerAuth)('Authorization'), (0, common_1.Controller)('api/users'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, dual_role_guard_1.DualRoleGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getUsers_decorators;
    var _getMyProfile_decorators;
    var _createUser_decorators;
    var _updateUser_decorators;
    var _deleteUser_decorators;
    var _changeUserRole_decorators;
    var _getManagerData_decorators;
    var _getSupervisorData_decorators;
    var _updateSensitiveData_decorators;
    var UsersExampleController = _classThis = /** @class */ (function () {
        function UsersExampleController_1() {
            __runInitializers(this, _instanceExtraInitializers);
        }
        UsersExampleController_1.prototype.getUsers = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            message: 'Usuarios obtenidos exitosamente',
                            data: {
                                requiredRole: 'SUPER_ADMIN o ADMIN_AUTHORIZED_ORIGIN',
                                currentUser: {
                                    id: user.userId,
                                    authRole: user.authorizationRoleName,
                                    localRole: user.localRoleName,
                                    isSuperAdmin: user.isSuperAdmin,
                                },
                            },
                        }];
                });
            });
        };
        UsersExampleController_1.prototype.getMyProfile = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            message: 'Perfil obtenido exitosamente',
                            data: {
                                user: {
                                    id: user.userId,
                                    name: user.fullName,
                                    email: user.email,
                                    authorizationRole: user.authorizationRoleName,
                                    localRole: user.localRoleName,
                                    isAIA: user.isAIAUser,
                                    branches: user.branches.length,
                                },
                            },
                        }];
                });
            });
        };
        UsersExampleController_1.prototype.createUser = function (userData, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            message: 'Usuario creado exitosamente',
                            data: {
                                note: 'Solo SUPER_ADMIN puede crear usuarios',
                                createdBy: {
                                    id: user.userId,
                                    role: user.authorizationRoleName,
                                },
                                userData: userData,
                            },
                        }];
                });
            });
        };
        UsersExampleController_1.prototype.updateUser = function (id, updateData, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            message: 'Usuario actualizado exitosamente',
                            data: {
                                targetUserId: id,
                                note: 'Si el usuario objetivo es AIA, solo SUPER_ADMIN puede modificarlo',
                                updatedBy: {
                                    id: user.userId,
                                    authRole: user.authorizationRoleName,
                                    canModifyAIA: user.isSuperAdmin || user.isGlobalAdmin,
                                },
                                updateData: updateData,
                            },
                        }];
                });
            });
        };
        UsersExampleController_1.prototype.deleteUser = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            message: 'Usuario eliminado exitosamente',
                            data: {
                                targetUserId: id,
                                note: 'Requiere ser ADMIN+ de authorization Y Owner/Regional Manager local. AIA protegido.',
                                deletedBy: {
                                    id: user.userId,
                                    authRole: user.authorizationRoleName,
                                    localRole: user.localRoleName,
                                },
                            },
                        }];
                });
            });
        };
        UsersExampleController_1.prototype.changeUserRole = function (id, roleData, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            message: 'Rol de usuario actualizado exitosamente',
                            data: {
                                targetUserId: id,
                                newRoleId: roleData.newRoleId,
                                note: 'Solo Owner/Regional Manager pueden cambiar roles. AIA protegido.',
                                changedBy: {
                                    id: user.userId,
                                    localRole: user.localRoleName,
                                },
                            },
                        }];
                });
            });
        };
        UsersExampleController_1.prototype.getManagerData = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            message: 'Datos de manager obtenidos',
                            data: {
                                note: 'Solo Owner y Regional Manager locales pueden acceder',
                                manager: {
                                    id: user.userId,
                                    localRole: user.localRoleName,
                                    authRole: user.authorizationRoleName,
                                },
                            },
                        }];
                });
            });
        };
        UsersExampleController_1.prototype.getSupervisorData = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            message: 'Datos de supervisor obtenidos',
                            data: {
                                note: 'Solo SUPERVISOR, ADMIN, ADMIN_AUTHORIZED_ORIGIN o SUPER_ADMIN',
                                supervisor: {
                                    id: user.userId,
                                    authRole: user.authorizationRoleName,
                                    hasGlobalAccess: user.isGlobalAdmin,
                                },
                            },
                        }];
                });
            });
        };
        UsersExampleController_1.prototype.updateSensitiveData = function (id, sensitiveData, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            message: 'Datos sensibles actualizados',
                            data: {
                                targetUserId: id,
                                note: 'Requiere ADMIN+ de authorization Y Manager+ local. AIA protegido.',
                                updatedBy: {
                                    id: user.userId,
                                    authRole: user.authorizationRoleName,
                                    localRole: user.localRoleName,
                                    meets: {
                                        authRequirement: [
                                            'ADMIN',
                                            'ADMIN_AUTHORIZED_ORIGIN',
                                            'SUPER_ADMIN',
                                        ].includes(user.authorizationRoleName),
                                        localRequirement: ['MANAGER', 'REGIONAL_MANAGER', 'OWNER'].includes(user.localRoleName),
                                    },
                                },
                            },
                        }];
                });
            });
        };
        return UsersExampleController_1;
    }());
    __setFunctionName(_classThis, "UsersExampleController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getUsers_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Listar usuarios - Solo administradores globales' }), (0, dual_roles_decorator_1.GlobalAdminOnly)()];
        _getMyProfile_decorators = [(0, common_1.Get)('profile'), (0, swagger_1.ApiOperation)({ summary: 'Ver mi perfil - Cualquier usuario autenticado' })];
        _createUser_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({ summary: 'Crear usuario - Solo SUPER_ADMIN' }), (0, dual_roles_decorator_1.SuperAdminOnly)()];
        _updateUser_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({
                summary: 'Actualizar usuario - Protege usuarios AIA',
                description: 'Los usuarios AIA solo pueden ser modificados por SUPER_ADMIN o ADMIN_AUTHORIZED_ORIGIN',
            }), (0, dual_roles_decorator_1.AIAProtected)()];
        _deleteUser_decorators = [(0, common_1.Delete)(':id'), (0, swagger_1.ApiOperation)({
                summary: 'Eliminar usuario - Requiere ADMIN de authorization Y Owner/Regional Manager local + Protege AIA',
            }), (0, dual_roles_decorator_1.RequireDualRolesAndProtectAIA)({
                authorizationRoles: [
                    roles_enum_1.AuthorizationRole.ADMIN,
                    roles_enum_1.AuthorizationRole.SUPER_ADMIN,
                ],
                localRoles: [roles_enum_1.LocalRole.OWNER, roles_enum_1.LocalRole.REGIONAL_MANAGER],
            })];
        _changeUserRole_decorators = [(0, common_1.Put)(':id/role'), (0, swagger_1.ApiOperation)({
                summary: 'Cambiar rol de usuario - Solo administradores locales Owner/Regional Manager',
            }), (0, dual_roles_decorator_1.RequireLocalRole)(roles_enum_1.LocalRole.OWNER, roles_enum_1.LocalRole.REGIONAL_MANAGER), (0, dual_roles_decorator_1.AIAProtected)()];
        _getManagerData_decorators = [(0, common_1.Get)('managers-only'), (0, swagger_1.ApiOperation)({ summary: 'Endpoint solo para managers locales' }), (0, dual_roles_decorator_1.ManagersOnly)()];
        _getSupervisorData_decorators = [(0, common_1.Get)('supervisors-and-above'), (0, swagger_1.ApiOperation)({ summary: 'Solo roles de authorization SUPERVISOR+' }), (0, dual_roles_decorator_1.RequireAuthorizationRole)(roles_enum_1.AuthorizationRole.SUPERVISOR, roles_enum_1.AuthorizationRole.ADMIN, roles_enum_1.AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN, roles_enum_1.AuthorizationRole.SUPER_ADMIN)];
        _updateSensitiveData_decorators = [(0, common_1.Put)(':id/sensitive-data'), (0, swagger_1.ApiOperation)({
                summary: 'Modificar datos sensibles - Requiere ADMIN de authorization Y Manager local mínimo',
            }), (0, dual_roles_decorator_1.RequireDualRoles)({
                authorizationRoles: [
                    roles_enum_1.AuthorizationRole.ADMIN,
                    roles_enum_1.AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN,
                    roles_enum_1.AuthorizationRole.SUPER_ADMIN,
                ],
                localRoles: [
                    roles_enum_1.LocalRole.MANAGER,
                    roles_enum_1.LocalRole.REGIONAL_MANAGER,
                    roles_enum_1.LocalRole.OWNER,
                ],
            }), (0, dual_roles_decorator_1.AIAProtected)()];
        __esDecorate(_classThis, null, _getUsers_decorators, { kind: "method", name: "getUsers", static: false, private: false, access: { has: function (obj) { return "getUsers" in obj; }, get: function (obj) { return obj.getUsers; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyProfile_decorators, { kind: "method", name: "getMyProfile", static: false, private: false, access: { has: function (obj) { return "getMyProfile" in obj; }, get: function (obj) { return obj.getMyProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createUser_decorators, { kind: "method", name: "createUser", static: false, private: false, access: { has: function (obj) { return "createUser" in obj; }, get: function (obj) { return obj.createUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateUser_decorators, { kind: "method", name: "updateUser", static: false, private: false, access: { has: function (obj) { return "updateUser" in obj; }, get: function (obj) { return obj.updateUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteUser_decorators, { kind: "method", name: "deleteUser", static: false, private: false, access: { has: function (obj) { return "deleteUser" in obj; }, get: function (obj) { return obj.deleteUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _changeUserRole_decorators, { kind: "method", name: "changeUserRole", static: false, private: false, access: { has: function (obj) { return "changeUserRole" in obj; }, get: function (obj) { return obj.changeUserRole; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getManagerData_decorators, { kind: "method", name: "getManagerData", static: false, private: false, access: { has: function (obj) { return "getManagerData" in obj; }, get: function (obj) { return obj.getManagerData; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSupervisorData_decorators, { kind: "method", name: "getSupervisorData", static: false, private: false, access: { has: function (obj) { return "getSupervisorData" in obj; }, get: function (obj) { return obj.getSupervisorData; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateSensitiveData_decorators, { kind: "method", name: "updateSensitiveData", static: false, private: false, access: { has: function (obj) { return "updateSensitiveData" in obj; }, get: function (obj) { return obj.updateSensitiveData; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UsersExampleController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsersExampleController = _classThis;
}();
exports.UsersExampleController = UsersExampleController;
