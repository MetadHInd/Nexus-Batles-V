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
exports.PermissionController = void 0;
const common_1 = require("@nestjs/common");
const permission_service_1 = require("../services/permission.service");
const permission_dto_1 = require("../dtos/permission.dto");
const swagger_1 = require("@nestjs/swagger");
const permission_model_1 = require("../models/permission.model");
const jwt_auth_guard_1 = require("../../../shared/core/auth/guards/jwt-auth.guard");
let PermissionController = class PermissionController {
    permissionService;
    constructor(permissionService) {
        this.permissionService = permissionService;
    }
    async create(createDto) {
        return this.permissionService.create(createDto);
    }
    async findAll() {
        return this.permissionService.findAll();
    }
    async findAllPaginated(paginationDto) {
        return this.permissionService.findAllPaginated(paginationDto);
    }
    async findOne(id) {
        return this.permissionService.findOne(id);
    }
    async findByCode(code) {
        return this.permissionService.findByCode(code);
    }
    async update(id, updateDto) {
        return this.permissionService.update(id, updateDto);
    }
    async remove(id) {
        return this.permissionService.remove(id);
    }
};
exports.PermissionController = PermissionController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo permiso' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Permiso creado exitosamente',
        type: permission_model_1.PermissionModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Ya existe un permiso con ese código',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [permission_dto_1.CreatePermissionDto]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los permisos' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de todos los permisos',
        type: [permission_model_1.PermissionModel],
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('paginated'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener permisos paginados' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista paginada de permisos',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [permission_dto_1.PermissionPaginationDto]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "findAllPaginated", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un permiso por ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID del permiso',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Permiso encontrado',
        type: permission_model_1.PermissionModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Permiso no encontrado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un permiso por código' }),
    (0, swagger_1.ApiParam)({
        name: 'code',
        description: 'Código del permiso',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Permiso encontrado',
        type: permission_model_1.PermissionModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Permiso no encontrado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un permiso' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID del permiso',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Permiso actualizado exitosamente',
        type: permission_model_1.PermissionModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Permiso no encontrado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Ya existe un permiso con ese código',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, permission_dto_1.UpdatePermissionDto]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un permiso' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID del permiso',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Permiso eliminado exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Permiso no encontrado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'No se puede eliminar el permiso porque tiene roles asociados',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "remove", null);
exports.PermissionController = PermissionController = __decorate([
    (0, swagger_1.ApiTags)('22 - Permissions'),
    (0, common_1.Controller)('api/permissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [permission_service_1.PermissionService])
], PermissionController);
//# sourceMappingURL=permission.controller.js.map