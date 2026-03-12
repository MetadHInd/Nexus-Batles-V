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
exports.RoleController = void 0;
const common_1 = require("@nestjs/common");
const role_service_1 = require("../services/role.service");
const role_dto_1 = require("../dtos/role.dto");
const swagger_1 = require("@nestjs/swagger");
const role_model_1 = require("../models/role.model");
const jwt_auth_guard_1 = require("../../../shared/core/auth/guards/jwt-auth.guard");
let RoleController = class RoleController {
    roleService;
    constructor(roleService) {
        this.roleService = roleService;
    }
    async create(createDto) {
        return this.roleService.create(createDto);
    }
    async findAll() {
        return this.roleService.findAll();
    }
    async findAllPaginated(paginationDto) {
        return this.roleService.findAllPaginated(paginationDto);
    }
    async findOne(id) {
        return this.roleService.findOne(id);
    }
    async findByDescription(description) {
        return this.roleService.findByDescription(description);
    }
    async update(id, updateDto) {
        return this.roleService.update(id, updateDto);
    }
    async remove(id) {
        return this.roleService.remove(id);
    }
};
exports.RoleController = RoleController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new role' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Role created successfully',
        type: role_model_1.RoleModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'A role with that description already exists or you do not have sufficient hierarchy',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_dto_1.CreateRoleDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all roles' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all roles',
        type: [role_model_1.RoleModel],
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('paginated'),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated roles' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of roles',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_dto_1.RolePaginationDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "findAllPaginated", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a role by ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Role ID',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Role found',
        type: role_model_1.RoleModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Role not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('description/:description'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a role by description' }),
    (0, swagger_1.ApiParam)({
        name: 'description',
        description: 'Role description',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Role found',
        type: role_model_1.RoleModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Role not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    __param(0, (0, common_1.Param)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "findByDescription", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a role' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Role ID',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Role updated successfully',
        type: role_model_1.RoleModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Role not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'A role with that description already exists',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'You do not have sufficient hierarchy to update this role',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, role_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a role' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Role ID',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Role deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Role not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Cannot delete role because it has associated agent versions or permissions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'You do not have sufficient hierarchy to delete this role',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "remove", null);
exports.RoleController = RoleController = __decorate([
    (0, swagger_1.ApiTags)('23 - Roles'),
    (0, common_1.Controller)('api/roles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [role_service_1.RoleService])
], RoleController);
//# sourceMappingURL=role.controller.js.map