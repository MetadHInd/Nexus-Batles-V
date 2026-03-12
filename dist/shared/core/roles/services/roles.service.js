"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RolesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const role_model_1 = require("../models/role.model");
const service_cache_1 = require("../../services/service-cache/service-cache");
const common_2 = require("@nestjs/common");
let RolesService = RolesService_1 = class RolesService {
    logger = new common_1.Logger(RolesService_1.name);
    async create(createRoleDto) {
        try {
            const role = await service_cache_1.ServiceCache.Database.Prisma.role.create({
                data: createRoleDto,
            });
            return role_model_1.RoleModel.fromEntity(role);
        }
        catch (error) {
            this.logger.error(`Error al crear rol: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findAll() {
        try {
            const roles = await service_cache_1.ServiceCache.Database.Prisma.role.findMany({
                orderBy: { idrole: 'asc' },
            });
            return roles.map((role) => role_model_1.RoleModel.fromEntity(role));
        }
        catch (error) {
            this.logger.error(`Error al buscar roles: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findOne(id) {
        try {
            const role = await service_cache_1.ServiceCache.Database.Prisma.role.findUnique({
                where: { idrole: id },
            });
            if (!role) {
                throw new common_2.NotFoundException('Rol no encontrado');
            }
            return role_model_1.RoleModel.fromEntity(role);
        }
        catch (error) {
            this.logger.error(`Error al buscar rol: ${error.message}`, error.stack);
            throw error;
        }
    }
    async update(id, updateRoleDto) {
        try {
            await this.findOne(id);
            const updatedRole = await service_cache_1.ServiceCache.Database.Prisma.role.update({
                where: { idrole: id },
                data: updateRoleDto,
            });
            return role_model_1.RoleModel.fromEntity(updatedRole);
        }
        catch (error) {
            this.logger.error(`Error al actualizar rol: ${error.message}`, error.stack);
            throw error;
        }
    }
    async remove(id) {
        try {
            await this.findOne(id);
            await service_cache_1.ServiceCache.Database.Prisma.role.delete({
                where: { idrole: id },
            });
        }
        catch (error) {
            this.logger.error(`Error al eliminar rol: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findByDescription(description) {
        try {
            const role = await service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
                where: { description },
            });
            if (!role) {
                throw new common_2.NotFoundException('Rol no encontrado');
            }
            return role_model_1.RoleModel.fromEntity(role);
        }
        catch (error) {
            this.logger.error(`Error al buscar rol por descripción: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = RolesService_1 = __decorate([
    (0, common_1.Injectable)()
], RolesService);
//# sourceMappingURL=roles.service.js.map