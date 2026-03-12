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
exports.ActionController = void 0;
const common_1 = require("@nestjs/common");
const action_service_1 = require("../services/action.service");
const action_dto_1 = require("../dtos/action.dto");
const swagger_1 = require("@nestjs/swagger");
const action_model_1 = require("../models/action.model");
const jwt_auth_guard_1 = require("../../../shared/core/auth/guards/jwt-auth.guard");
let ActionController = class ActionController {
    actionService;
    constructor(actionService) {
        this.actionService = actionService;
    }
    async create(createDto) {
        return this.actionService.create(createDto);
    }
    async findAll() {
        return this.actionService.findAll();
    }
    async findOne(id) {
        return this.actionService.findOne(id);
    }
    async update(id, updateDto) {
        return this.actionService.update(id, updateDto);
    }
    async delete(id) {
        return this.actionService.delete(id);
    }
    async bulkDelete(bulkDeleteDto) {
        return this.actionService.bulkDelete(bulkDeleteDto);
    }
};
exports.ActionController = ActionController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva acción' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Acción creada exitosamente',
        type: action_model_1.ActionModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Ya existe una acción con ese nombre',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [action_dto_1.CreateActionDto]),
    __metadata("design:returntype", Promise)
], ActionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las acciones' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de todas las acciones',
        type: [action_model_1.ActionModel],
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ActionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una acción por ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de la acción',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Acción encontrada',
        type: action_model_1.ActionModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Acción no encontrada',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ActionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una acción' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de la acción',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Acción actualizada exitosamente',
        type: action_model_1.ActionModel,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Acción no encontrada',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Ya existe una acción con ese nombre',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, action_dto_1.UpdateActionDto]),
    __metadata("design:returntype", Promise)
], ActionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una acción' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de la acción',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Acción eliminada exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Acción no encontrada',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o faltante',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ActionController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('bulk-delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar múltiples acciones' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Acciones eliminadas exitosamente',
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
    __metadata("design:paramtypes", [action_dto_1.BulkDeleteActionDto]),
    __metadata("design:returntype", Promise)
], ActionController.prototype, "bulkDelete", null);
exports.ActionController = ActionController = __decorate([
    (0, swagger_1.ApiTags)('23 - Actions'),
    (0, common_1.Controller)('api/actions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [action_service_1.ActionService])
], ActionController);
//# sourceMappingURL=action.controller.js.map