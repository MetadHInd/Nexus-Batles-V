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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const users_service_1 = require("../services/users.service");
const list_users_dto_1 = require("../dtos/list-users.dto");
const update_user_dto_1 = require("../dtos/update-user.dto");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async listUsers(dto) {
        return this.usersService.listUsers(dto);
    }
    async getUserById(id) {
        return this.usersService.getUserById(id);
    }
    async getUserByUuid(uuid) {
        return this.usersService.getUserByUuid(uuid);
    }
    async updateUser(id, dto) {
        return this.usersService.updateUser(id, dto);
    }
    async deleteUser(id) {
        return this.usersService.deleteUser(id);
    }
    async changePassword(id, dto) {
        return this.usersService.changePassword(id, dto);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar usuarios con paginación y filtros',
        description: 'Retorna una lista paginada de usuarios con soporte para filtros y búsqueda'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de usuarios obtenida exitosamente',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            idsysUser: { type: 'number' },
                            uuid: { type: 'string' },
                            userEmail: { type: 'string' },
                            userName: { type: 'string' },
                            userLastName: { type: 'string' },
                            userPhone: { type: 'string' },
                            is_active: { type: 'boolean' },
                            role: {
                                type: 'object',
                                properties: {
                                    idrole: { type: 'number' },
                                    rolename: { type: 'string' },
                                    description: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' },
                        hasNextPage: { type: 'boolean' },
                        hasPreviousPage: { type: 'boolean' },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_users_dto_1.ListUsersDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener usuario por ID',
        description: 'Retorna la información detallada de un usuario específico'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del usuario', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Get)('uuid/:uuid'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener usuario por UUID',
        description: 'Retorna la información detallada de un usuario usando su UUID'
    }),
    (0, swagger_1.ApiParam)({ name: 'uuid', description: 'UUID del usuario', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserByUuid", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Actualizar usuario',
        description: 'Actualiza la información de un usuario existente'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del usuario', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario actualizado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos o email ya en uso' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Desactivar usuario',
        description: 'Desactiva un usuario (soft delete) en lugar de eliminarlo permanentemente'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del usuario', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario desactivado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Put)(':id/change-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Cambiar contraseña de usuario',
        description: 'Permite a un usuario cambiar su contraseña actual por una nueva'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del usuario', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contraseña cambiada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Contraseña actual incorrecta' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('02 - Users Management'),
    (0, common_1.Controller)('api/users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map