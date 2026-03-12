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
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const role_model_1 = require("../models/role.model");
const redis_cache_service_1 = require("../../../shared/cache/redis-cache.service");
const base_paginated_service_1 = require("../../../shared/common/services/base-paginated.service");
const service_cache_1 = require("../../../shared/core/services/service-cache/service-cache");
const cacheable_factory_1 = require("../../../shared/cache/factories/cacheable.factory");
const pagination_dto_1 = require("../../../shared/common/dtos/pagination.dto");
const pagination_utils_1 = require("../../../shared/common/utils/pagination.utils");
const role_permission_service_1 = require("../../role_permissions/services/role-permission.service");
const permission_service_1 = require("../../permissions/services/permission.service");
const hierarchy_validator_util_1 = require("../../../shared/utils/hierarchy-validator.util");
let RoleService = class RoleService extends base_paginated_service_1.BasePaginatedService {
    rolePermissionService;
    permissionService;
    constructor(cache, rolePermissionService, permissionService) {
        super(cache);
        this.rolePermissionService = rolePermissionService;
        this.permissionService = permissionService;
    }
    roleCacheKey = 'role';
    roleListSuffixKey = '_list';
    getTenantId() {
        try {
            const request = global.currentRequest;
            const tenantId = request?.selectedRestaurant?.database_connection || null;
            console.log('ðŸ” [getTenantId] Tenant obtenido del contexto global:', tenantId);
            console.log('ðŸ” [getTenantId] Selected restaurant:', request?.selectedRestaurant?.name);
            return tenantId;
        }
        catch (error) {
            console.log('âŒ [getTenantId] Error al obtener tenant:', error);
            return null;
        }
    }
    getTenantIdOrFail() {
        const tenantId = this.getTenantId();
        if (!tenantId) {
            throw new Error('tenant_id no encontrado en el contexto. AsegÃºrate de que el middleware de tenant estÃ© configurado correctamente.');
        }
        return tenantId;
    }
    getUserRoleId() {
        try {
            const request = global.currentRequest;
            const user = request?.user;
            if (!user) {
                return null;
            }
            const roleId = user.role?.id || user.role?.idrole || user.localRole || user.role;
            return roleId || null;
        }
        catch (error) {
            return null;
        }
    }
    async getUserHierarchy() {
        try {
            const request = global.currentRequest;
            const user = request?.user;
            if (!user) {
                console.log('âš ï¸ [getUserHierarchy] No hay usuario en el contexto');
                return null;
            }
            const roleId = user.role?.id || user.role?.idrole || user.localRole || user.role;
            if (!roleId) {
                console.log('âš ï¸ [getUserHierarchy] No se encontrÃ³ role ID en el usuario');
                return null;
            }
            const role = await service_cache_1.ServiceCache.Database.Prisma.role.findUnique({
                where: { idrole: roleId },
                select: { hierarchy_level: true },
            });
            if (!role) {
                console.log(`âš ï¸ [getUserHierarchy] No se encontrÃ³ el rol con ID ${roleId}`);
                return null;
            }
            console.log(`âœ… [getUserHierarchy] Usuario con rol ID ${roleId} tiene jerarquÃ­a: ${role.hierarchy_level}`);
            return role.hierarchy_level || 50;
        }
        catch (error) {
            console.log('âŒ [getUserHierarchy] Error al obtener jerarquÃ­a:', error);
            return null;
        }
    }
    async validateHierarchy(targetHierarchy, operation) {
        const userHierarchy = await this.getUserHierarchy();
        if (userHierarchy === null) {
            console.log('âš ï¸ [validateHierarchy] No se pudo determinar jerarquÃ­a del usuario, permitiendo operaciÃ³n');
            return;
        }
        if (userHierarchy <= targetHierarchy) {
            throw new common_1.ConflictException(`You do not have sufficient hierarchy to ${operation}. Your level: ${userHierarchy}, Required level: > ${targetHierarchy}`);
        }
        console.log(`âœ… [validateHierarchy] ValidaciÃ³n exitosa: ${userHierarchy} > ${targetHierarchy} para ${operation}`);
    }
    async checkForDuplicateRolePermissions(permissionIds, roleIdToExclude) {
        const allRoles = await service_cache_1.ServiceCache.Database.Prisma.role.findMany({
            where: roleIdToExclude ? { idrole: { not: roleIdToExclude } } : undefined,
            include: {
                role_permissions: {
                    where: { is_active: true },
                    select: { permission_id: true },
                },
            },
        });
        const sortedTargetPermissions = [...permissionIds].sort((a, b) => a - b);
        for (const role of allRoles) {
            const rolePermissionIds = role.role_permissions
                .map((rp) => rp.permission_id)
                .sort((a, b) => a - b);
            if (rolePermissionIds.length === sortedTargetPermissions.length &&
                rolePermissionIds.every((id, index) => id === sortedTargetPermissions[index])) {
                return {
                    idrole: role.idrole,
                    description: role.description || '',
                };
            }
        }
        return null;
    }
    async create(dto) {
        console.log('ðŸ“ [create] DTO recibido:', JSON.stringify(dto, null, 2));
        const existing = await service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
            where: {
                description: dto.description,
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Role with description '${dto.description}' already exists`);
        }
        if (dto.is_super === true) {
            const existingSuperRole = await service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
                where: {
                    is_super: true,
                },
            });
            if (existingSuperRole) {
                throw new common_1.ConflictException('A super role already exists. Only one super role is allowed.');
            }
        }
        const targetHierarchy = dto.hierarchy_level ?? 50;
        const currentUserRoleId = this.getUserRoleId();
        if (currentUserRoleId) {
            const currentUserRole = await service_cache_1.ServiceCache.Database.Prisma.role.findUnique({
                where: { idrole: currentUserRoleId },
                select: { hierarchy_level: true },
            });
            if (currentUserRole) {
                const currentHierarchy = currentUserRole.hierarchy_level || 50;
                if (currentHierarchy <= targetHierarchy) {
                    throw new common_1.ConflictException(`You do not have sufficient hierarchy to create a role with level ${targetHierarchy}. Your level: ${currentHierarchy}. You can only create roles with hierarchy levels less than ${currentHierarchy}`);
                }
            }
        }
        if (dto.permission_ids && dto.permission_ids.length > 0) {
            const permissions = await service_cache_1.ServiceCache.Database.Prisma.permissions.findMany({
                where: {
                    id: { in: dto.permission_ids },
                },
            });
            const inactivePermissions = permissions.filter((p) => !p.is_active);
            if (inactivePermissions.length > 0) {
                const inactiveCodes = inactivePermissions.map((p) => p.code).join(', ');
                throw new common_1.ConflictException(`Cannot assign inactive permissions: ${inactiveCodes}. Please activate them first`);
            }
            const duplicateRole = await this.checkForDuplicateRolePermissions(dto.permission_ids);
            if (duplicateRole) {
                throw new common_1.ConflictException(`A role with the same permission set already exists: '${duplicateRole.description}' (ID: ${duplicateRole.idrole}). Cannot create roles with duplicate permission configurations`);
            }
        }
        const created = await service_cache_1.ServiceCache.Database.Prisma.role.create({
            data: {
                description: dto.description,
                is_super: dto.is_super ?? false,
                hierarchy_level: targetHierarchy,
            },
        });
        const allPermissions = await this.permissionService.findAll(false);
        const activePermissionIds = dto.permission_ids || [];
        const rolePermissionsData = allPermissions.map(permission => ({
            role_id: created.idrole,
            permission_id: permission.id,
            is_active: activePermissionIds.includes(permission.id),
        }));
        if (rolePermissionsData.length > 0) {
            await service_cache_1.ServiceCache.Database.Prisma.role_permissions.createMany({
                data: rolePermissionsData,
            });
        }
        const model = cacheable_factory_1.CacheableFactory.create(created, role_model_1.RoleModel);
        await this.cacheSet(this.roleCacheKey, { id: created.idrole }, model, model.cacheTTL());
        await this.invalidateListCaches();
        return model;
    }
    async findAll(useCache = true) {
        return this.tryCacheOrExecute(this.roleCacheKey, { key: this.roleListSuffixKey }, useCache, async () => {
            const roles = await service_cache_1.ServiceCache.Database.Prisma.role.findMany({
                orderBy: { idrole: 'asc' },
            });
            return roles.map((role) => cacheable_factory_1.CacheableFactory.create(role, role_model_1.RoleModel));
        });
    }
    async findAllPaginated(paginationDto, useCache = true) {
        const { page = 1, limit = 10, search, tenant_id } = paginationDto;
        const cacheKey = `${this.roleListSuffixKey}_paginated_${page}_${limit}_${search}_${tenant_id}`;
        return this.tryCacheOrExecute(this.roleCacheKey, { key: cacheKey }, useCache, async () => {
            const where = {};
            if (search) {
                where.description = { contains: search, mode: 'insensitive' };
            }
            if (tenant_id) {
                where.tenant_ids = { has: tenant_id };
            }
            const [roles, total] = await Promise.all([
                service_cache_1.ServiceCache.Database.Prisma.role.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { idrole: 'asc' },
                }),
                service_cache_1.ServiceCache.Database.Prisma.role.count({ where }),
            ]);
            const items = roles.map((role) => cacheable_factory_1.CacheableFactory.create(role, role_model_1.RoleModel));
            return pagination_utils_1.PaginationUtils.createPaginatedResponse(items, new pagination_dto_1.PaginationParams({ page, limit }), total);
        });
    }
    async findOne(id, useCache = true) {
        return this.tryCacheOrExecute(this.roleCacheKey, { id }, useCache, async () => {
            const role = await service_cache_1.ServiceCache.Database.Prisma.role.findUnique({
                where: { idrole: id },
            });
            if (!role) {
                throw new common_1.NotFoundException(`Role with ID ${id} not found`);
            }
            return cacheable_factory_1.CacheableFactory.create(role, role_model_1.RoleModel);
        });
    }
    async findByDescription(description, useCache = true) {
        const cacheKey = `by_description_${description}`;
        return this.tryCacheOrExecute(this.roleCacheKey, { key: cacheKey }, useCache, async () => {
            const role = await service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
                where: { description },
            });
            if (!role) {
                return null;
            }
            return cacheable_factory_1.CacheableFactory.create(role, role_model_1.RoleModel);
        });
    }
    async update(id, dto) {
        const currentRole = await this.findOne(id, false);
        const currentUserRoleId = this.getUserRoleId();
        if (currentUserRoleId) {
            await hierarchy_validator_util_1.HierarchyValidator.validateRoleHierarchy(currentUserRoleId, id, `update role '${currentRole.description}'`);
        }
        if (dto.description) {
            const existing = await service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
                where: {
                    description: dto.description,
                    idrole: { not: id },
                },
            });
            if (existing) {
                throw new common_1.ConflictException(`Role with description '${dto.description}' already exists`);
            }
        }
        if (dto.is_super === true && !currentRole.is_super) {
            const existingSuperRole = await service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
                where: {
                    is_super: true,
                    idrole: { not: id },
                },
            });
            if (existingSuperRole) {
                throw new common_1.ConflictException('A super role already exists. Only one super role is allowed.');
            }
        }
        const updated = await service_cache_1.ServiceCache.Database.Prisma.role.update({
            where: { idrole: id },
            data: {
                ...(dto.description && { description: dto.description }),
                ...(dto.is_super !== undefined && { is_super: dto.is_super }),
                ...(dto.hierarchy_level !== undefined && { hierarchy_level: dto.hierarchy_level }),
            },
        });
        if (dto.permission_ids !== undefined) {
            if (dto.permission_ids.length > 0) {
                await this.rolePermissionService.assignPermissionsToRole(id, {
                    permission_ids: dto.permission_ids,
                });
            }
            else {
                await this.rolePermissionService.deactivateAllPermissionsFromRole(id);
            }
        }
        const model = cacheable_factory_1.CacheableFactory.create(updated, role_model_1.RoleModel);
        await this.cacheSet(this.roleCacheKey, { id: updated.idrole }, model, model.cacheTTL());
        await this.invalidateListCaches();
        return model;
    }
    async remove(id) {
        const role = await this.findOne(id, false);
        const currentUserRoleId = this.getUserRoleId();
        if (currentUserRoleId) {
            await hierarchy_validator_util_1.HierarchyValidator.validateRoleHierarchy(currentUserRoleId, id, `delete role '${role.description}'`);
        }
        await this.rolePermissionService.removeAllPermissionsFromRole(id);
        await service_cache_1.ServiceCache.Database.Prisma.role.delete({
            where: { idrole: id },
        });
        await this.cacheDelete(this.roleCacheKey, { id });
        await this.invalidateListCaches();
    }
    async invalidateListCaches() {
        await this.cacheDelete(this.roleCacheKey, {
            key: this.roleListSuffixKey,
        });
        const pattern = `${this.roleCacheKey}:${this.roleListSuffixKey}_paginated_*`;
        await this.cache.deletePattern(pattern);
        const patternByDesc = `${this.roleCacheKey}:by_description_*`;
        await this.cache.deletePattern(patternByDesc);
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => role_permission_service_1.RolePermissionService))),
    __metadata("design:paramtypes", [redis_cache_service_1.RedisCacheService,
        role_permission_service_1.RolePermissionService,
        permission_service_1.PermissionService])
], RoleService);
//# sourceMappingURL=role.service.js.map