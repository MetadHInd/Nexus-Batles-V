"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionController = void 0;
const common_1 = require("@nestjs/common");
const role_permission_service_1 = require("../services/role-permission.service");
const role_permission_dto_1 = require("../dtos/role-permission.dto");
const swagger_1 = require("@nestjs/swagger");
const role_permission_model_1 = require("../models/role-permission.model");
const jwt_auth_guard_1 = require("../../../shared/core/auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../../shared/core/auth/decorators/current-user.decorator");
let RolePermissionController = class RolePermissionController {
    rolePermissionService;
    constructor(rolePermissionService) {
        this.rolePermissionService = rolePermissionService;
    }
    async create(createDto) {
        return this.rolePermissionService.create(createDto);
    }
    async findAll() {
        return this.rolePermissionService.findAll();
    }
    async findAllPaginated(paginationDto) {
        return this.rolePermissionService.findAllPaginated(paginationDto);
    }
    async getMyPermissions(user) {
        const roleId = user.role?.id || user.role?.idrole || user.idrole || user.role;
        return this.rolePermissionService.findByRoleId(roleId);
    }
    async findByRoleId(roleId) {
        return this.rolePermissionService.findByRoleId(roleId);
    }
    async findByPermissionCode(code) {
        return this.rolePermissionService.findByPermissionCode(code);
    }
    async findOne(id) {
        return this.rolePermissionService.findOne(id);
    }
    async update(id, updateDto) {
        return this.rolePermissionService.update(id, updateDto);
    }
    async remove(id) {
        return this.rolePermissionService.remove(id);
    }
    async assignPermissionsToRole(roleId, dto) {
        return this.rolePermissionService.assignPermissionsToRole(roleId, dto);
    }
    async removeAllPermissionsFromRole(roleId) {
        return this.rolePermissionService.removeAllPermissionsFromRole(roleId);
    }
};
exports.RolePermissionController = RolePermissionController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a permission to a role' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Permission assigned successfully',
        type: role_permission_model_1.RolePermissionModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Role or permission not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'The role already has that permission assigned',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'You do not have sufficient hierarchy to modify this role',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_permission_dto_1.CreateRolePermissionDto]),
    __metadata("design:returntype", Promise)
], RolePermissionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all permission assignments to roles' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all assignments',
        type: [role_permission_model_1.RolePermissionDetailModel],
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolePermissionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('paginated'),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated assignments' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of assignments',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_permission_dto_1.RolePermissionPaginationDto]),
    __metadata("design:returntype", Promise)
], RolePermissionController.prototype, "findAllPaginated", null);
__decorate([
    (0, common_1.Get)('my-permissions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get authenticated user permissions',
        description: 'Returns all permissions assigned to the logged-in user\'s role'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of authenticated user permissions',
        type: [role_permission_model_1.RolePermissionDetailModel],
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RolePermissionController.prototype, "getMyPermissions", null);
__decorate([
    (0, common_1.Get)('role/:roleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all permissions for a role' }),
    (0, swagger_1.ApiParam)({
        name: 'roleId',
        description: 'Role ID',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of role permissions',
        type: [role_permission_model_1.RolePermissionDetailModel],
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    __param(0, (0, common_1.Param)('roleId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RolePermissionController.prototype, "findByRoleId", null);
__decorate([
    (0, common_1.Get)('permission/code/:code'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all roles that have a permission' }),
    (0, swagger_1.ApiParam)({
        name: 'code',
        description: 'Permission code',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of roles with that permission',
        type: [role_permission_model_1.RolePermissionDetailModel],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Permission not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolePermissionController.prototype, "findByPermissionCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an assignment by ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Assignment ID',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Assignment found',
        type: role_permission_model_1.RolePermissionDetailModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Assignment not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RolePermissionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an assignment' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Assignment ID',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Assignment updated successfully',
        type: role_permission_model_1.RolePermissionModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Assignment, role, or permission not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'The role already has that permission assigned',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, role_permission_dto_1.UpdateRolePermissionDto]),
    __metadata("design:returntype", Promise)
], RolePermissionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an assignment' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Assignment ID',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Assignment deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Assignment not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RolePermissionController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('role/:roleId/assign-permissions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Assign multiple permissions to a role',
        description: 'Removes all existing assignments for the role and creates new ones with the provided permissions',
    }),
    (0, swagger_1.ApiParam)({
        name: 'roleId',
        description: 'Role ID',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Permissions assigned successfully',
        type: [role_permission_model_1.RolePermissionModel],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Role or some permission not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'You do not have sufficient hierarchy to modify this role',
    }),
    __param(0, (0, common_1.Param)('roleId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, role_permission_dto_1.AssignPermissionsToRoleDto]),
    __metadata("design:returntype", Promise)
], RolePermissionController.prototype, "assignPermissionsToRole", null);
__decorate([
    (0, common_1.Delete)('role/:roleId/remove-all'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove all permissions from a role',
    }),
    (0, swagger_1.ApiParam)({
        name: 'roleId',
        description: 'Role ID',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'All permissions removed successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Role not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'You do not have sufficient hierarchy to modify this role',
    }),
    __param(0, (0, common_1.Param)('roleId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RolePermissionController.prototype, "removeAllPermissionsFromRole", null);
exports.RolePermissionController = RolePermissionController = __decorate([
    (0, swagger_1.ApiTags)('22 - Role Permissions'),
    (0, common_1.Controller)('api/role-permissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [role_permission_service_1.RolePermissionService])
], RolePermissionController);
//# sourceMappingURL=role-permission.controller.js.map