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
exports.RolePermissionController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var role_permission_model_1 = require("../models/role-permission.model");
var jwt_auth_guard_1 = require("../../../../../../../../src/shared/core/auth/guards/jwt-auth.guard");
var RolePermissionController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('22 - Role Permissions'), (0, common_1.Controller)('api/role-permissions'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)('Authorization')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _findAllPaginated_decorators;
    var _getMyPermissions_decorators;
    var _findByRoleId_decorators;
    var _findByPermissionCode_decorators;
    var _findOne_decorators;
    var _update_decorators;
    var _remove_decorators;
    var _assignPermissionsToRole_decorators;
    var _removeAllPermissionsFromRole_decorators;
    var RolePermissionController = _classThis = /** @class */ (function () {
        function RolePermissionController_1(rolePermissionService) {
            this.rolePermissionService = (__runInitializers(this, _instanceExtraInitializers), rolePermissionService);
        }
        RolePermissionController_1.prototype.create = function (createDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.rolePermissionService.create(createDto)];
                });
            });
        };
        RolePermissionController_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.rolePermissionService.findAll()];
                });
            });
        };
        RolePermissionController_1.prototype.findAllPaginated = function (paginationDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.rolePermissionService.findAllPaginated(paginationDto)];
                });
            });
        };
        RolePermissionController_1.prototype.getMyPermissions = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var roleId;
                var _a, _b;
                return __generator(this, function (_c) {
                    roleId = ((_a = user.role) === null || _a === void 0 ? void 0 : _a.id) || ((_b = user.role) === null || _b === void 0 ? void 0 : _b.idrole) || user.idrole || user.role;
                    return [2 /*return*/, this.rolePermissionService.findByRoleId(roleId)];
                });
            });
        };
        RolePermissionController_1.prototype.findByRoleId = function (roleId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.rolePermissionService.findByRoleId(roleId)];
                });
            });
        };
        RolePermissionController_1.prototype.findByPermissionCode = function (code) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.rolePermissionService.findByPermissionCode(code)];
                });
            });
        };
        RolePermissionController_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.rolePermissionService.findOne(id)];
                });
            });
        };
        RolePermissionController_1.prototype.update = function (id, updateDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.rolePermissionService.update(id, updateDto)];
                });
            });
        };
        RolePermissionController_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.rolePermissionService.remove(id)];
                });
            });
        };
        RolePermissionController_1.prototype.assignPermissionsToRole = function (roleId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.rolePermissionService.assignPermissionsToRole(roleId, dto)];
                });
            });
        };
        RolePermissionController_1.prototype.removeAllPermissionsFromRole = function (roleId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.rolePermissionService.removeAllPermissionsFromRole(roleId)];
                });
            });
        };
        return RolePermissionController_1;
    }());
    __setFunctionName(_classThis, "RolePermissionController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({ summary: 'Assign a permission to a role' }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Permission assigned successfully',
                type: role_permission_model_1.RolePermissionModel,
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Role or permission not found',
            }), (0, swagger_1.ApiResponse)({
                status: 409,
                description: 'The role already has that permission assigned',
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            }), (0, swagger_1.ApiResponse)({
                status: 403,
                description: 'You do not have sufficient hierarchy to modify this role',
            })];
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get all permission assignments to roles' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'List of all assignments',
                type: [role_permission_model_1.RolePermissionDetailModel],
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            })];
        _findAllPaginated_decorators = [(0, common_1.Get)('paginated'), (0, swagger_1.ApiOperation)({ summary: 'Get paginated assignments' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Paginated list of assignments',
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            })];
        _getMyPermissions_decorators = [(0, common_1.Get)('my-permissions'), (0, swagger_1.ApiOperation)({
                summary: 'Get authenticated user permissions',
                description: 'Returns all permissions assigned to the logged-in user\'s role'
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'List of authenticated user permissions',
                type: [role_permission_model_1.RolePermissionDetailModel],
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            })];
        _findByRoleId_decorators = [(0, common_1.Get)('role/:roleId'), (0, swagger_1.ApiOperation)({ summary: 'Get all permissions for a role' }), (0, swagger_1.ApiParam)({
                name: 'roleId',
                description: 'Role ID',
                type: Number,
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'List of role permissions',
                type: [role_permission_model_1.RolePermissionDetailModel],
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            })];
        _findByPermissionCode_decorators = [(0, common_1.Get)('permission/code/:code'), (0, swagger_1.ApiOperation)({ summary: 'Get all roles that have a permission' }), (0, swagger_1.ApiParam)({
                name: 'code',
                description: 'Permission code',
                type: String,
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'List of roles with that permission',
                type: [role_permission_model_1.RolePermissionDetailModel],
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Permission not found',
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get an assignment by ID' }), (0, swagger_1.ApiParam)({
                name: 'id',
                description: 'Assignment ID',
                type: Number,
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Assignment found',
                type: role_permission_model_1.RolePermissionDetailModel,
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Assignment not found',
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            })];
        _update_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update an assignment' }), (0, swagger_1.ApiParam)({
                name: 'id',
                description: 'Assignment ID',
                type: Number,
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Assignment updated successfully',
                type: role_permission_model_1.RolePermissionModel,
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Assignment, role, or permission not found',
            }), (0, swagger_1.ApiResponse)({
                status: 409,
                description: 'The role already has that permission assigned',
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            })];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, swagger_1.ApiOperation)({ summary: 'Delete an assignment' }), (0, swagger_1.ApiParam)({
                name: 'id',
                description: 'Assignment ID',
                type: Number,
            }), (0, swagger_1.ApiResponse)({
                status: 204,
                description: 'Assignment deleted successfully',
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Assignment not found',
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            })];
        _assignPermissionsToRole_decorators = [(0, common_1.Post)('role/:roleId/assign-permissions'), (0, swagger_1.ApiOperation)({
                summary: 'Assign multiple permissions to a role',
                description: 'Removes all existing assignments for the role and creates new ones with the provided permissions',
            }), (0, swagger_1.ApiParam)({
                name: 'roleId',
                description: 'Role ID',
                type: Number,
            }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Permissions assigned successfully',
                type: [role_permission_model_1.RolePermissionModel],
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Role or some permission not found',
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            }), (0, swagger_1.ApiResponse)({
                status: 403,
                description: 'You do not have sufficient hierarchy to modify this role',
            })];
        _removeAllPermissionsFromRole_decorators = [(0, common_1.Delete)('role/:roleId/remove-all'), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, swagger_1.ApiOperation)({
                summary: 'Remove all permissions from a role',
            }), (0, swagger_1.ApiParam)({
                name: 'roleId',
                description: 'Role ID',
                type: Number,
            }), (0, swagger_1.ApiResponse)({
                status: 204,
                description: 'All permissions removed successfully',
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Role not found',
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            }), (0, swagger_1.ApiResponse)({
                status: 403,
                description: 'You do not have sufficient hierarchy to modify this role',
            })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllPaginated_decorators, { kind: "method", name: "findAllPaginated", static: false, private: false, access: { has: function (obj) { return "findAllPaginated" in obj; }, get: function (obj) { return obj.findAllPaginated; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyPermissions_decorators, { kind: "method", name: "getMyPermissions", static: false, private: false, access: { has: function (obj) { return "getMyPermissions" in obj; }, get: function (obj) { return obj.getMyPermissions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByRoleId_decorators, { kind: "method", name: "findByRoleId", static: false, private: false, access: { has: function (obj) { return "findByRoleId" in obj; }, get: function (obj) { return obj.findByRoleId; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByPermissionCode_decorators, { kind: "method", name: "findByPermissionCode", static: false, private: false, access: { has: function (obj) { return "findByPermissionCode" in obj; }, get: function (obj) { return obj.findByPermissionCode; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _assignPermissionsToRole_decorators, { kind: "method", name: "assignPermissionsToRole", static: false, private: false, access: { has: function (obj) { return "assignPermissionsToRole" in obj; }, get: function (obj) { return obj.assignPermissionsToRole; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removeAllPermissionsFromRole_decorators, { kind: "method", name: "removeAllPermissionsFromRole", static: false, private: false, access: { has: function (obj) { return "removeAllPermissionsFromRole" in obj; }, get: function (obj) { return obj.removeAllPermissionsFromRole; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RolePermissionController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RolePermissionController = _classThis;
}();
exports.RolePermissionController = RolePermissionController;
