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
exports.ModuleController = void 0;
const common_1 = require("@nestjs/common");
const module_service_1 = require("../services/module.service");
const module_dto_1 = require("../dtos/module.dto");
const swagger_1 = require("@nestjs/swagger");
const module_model_1 = require("../models/module.model");
const jwt_auth_guard_1 = require("../../../shared/core/auth/guards/jwt-auth.guard");
let ModuleController = class ModuleController {
    moduleService;
    constructor(moduleService) {
        this.moduleService = moduleService;
    }
    async create(createDto) {
        return this.moduleService.create(createDto);
    }
    async findAll() {
        return this.moduleService.findAll();
    }
    async findByUuid(uuid) {
        return this.moduleService.findByUuid(uuid);
    }
    async findOne(id) {
        return this.moduleService.findOne(id);
    }
    async update(id, updateDto) {
        return this.moduleService.update(id, updateDto);
    }
    async delete(id) {
        return this.moduleService.delete(id);
    }
    async bulkDelete(bulkDeleteDto) {
        return this.moduleService.bulkDelete(bulkDeleteDto);
    }
};
exports.ModuleController = ModuleController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo módulo' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Módulo creado exitosamente',
        type: module_model_1.ModuleModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Ya existe un módulo con ese nombre',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [module_dto_1.CreateModuleDto]),
    __metadata("design:returntype", Promise)
], ModuleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los módulos' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de todos los módulos',
        type: [module_model_1.ModuleModel],
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ModuleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('uuid/:uuid'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un módulo por UUID' }),
    (0, swagger_1.ApiParam)({
        name: 'uuid',
        description: 'UUID del módulo',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Módulo encontrado',
        type: module_model_1.ModuleModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Módulo no encontrado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __param(0, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModuleController.prototype, "findByUuid", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un módulo por ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID del módulo',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Módulo encontrado',
        type: module_model_1.ModuleModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Módulo no encontrado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ModuleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un módulo' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID del módulo',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Módulo actualizado exitosamente',
        type: module_model_1.ModuleModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Módulo no encontrado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Ya existe un módulo con ese nombre',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, module_dto_1.UpdateModuleDto]),
    __metadata("design:returntype", Promise)
], ModuleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un módulo' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID del módulo',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Módulo eliminado exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Módulo no encontrado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ModuleController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('bulk-delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar múltiples módulos' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Módulos eliminados exitosamente',
        schema: {
            type: 'object',
            properties: {
                deleted: { type: 'number', example: 3 },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [module_dto_1.BulkDeleteModuleDto]),
    __metadata("design:returntype", Promise)
], ModuleController.prototype, "bulkDelete", null);
exports.ModuleController = ModuleController = __decorate([
    (0, swagger_1.ApiTags)('24 - Modules'),
    (0, common_1.Controller)('api/modules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [module_service_1.ModuleService])
], ModuleController);
//# sourceMappingURL=module.controller.js.map