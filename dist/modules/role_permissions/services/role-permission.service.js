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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionService = void 0;
const common_1 = require("@nestjs/common");
const role_permission_model_1 = require("../models/role-permission.model");
const redis_cache_service_1 = require("../../../shared/cache/redis-cache.service");
const base_paginated_service_1 = require("../../../shared/common/services/base-paginated.service");
const service_cache_1 = require("../../../shared/core/services/service-cache/service-cache");
const cacheable_factory_1 = require("../../../shared/cache/factories/cacheable.factory");
const pagination_dto_1 = require("../../../shared/common/dtos/pagination.dto");
const pagination_utils_1 = require("../../../shared/common/utils/pagination.utils");
const permission_service_1 = require("../../permissions/services/permission.service");
const hierarchy_validator_util_1 = require("../../../shared/utils/hierarchy-validator.util");
let RolePermissionService = class RolePermissionService extends base_paginated_service_1.BasePaginatedService {
    permissionService;
    constructor(cache, permissionService) {
        super(cache);
        this.permissionService = permissionService;
    }
    rolePermissionCacheKey = 'role_permission';
    rolePermissionListSuffixKey = '_list';
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
    async create(dto) {
        const role = await service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
            where: {
                idrole: dto.role_id,
            },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${dto.role_id} not found`);
        }
        const currentUserRoleId = this.getUserRoleId();
        if (currentUserRoleId) {
            await hierarchy_validator_util_1.HierarchyValidator.validateRoleHierarchy(currentUserRoleId, dto.role_id, `assign permissions to role`);
        }
        const permission = await this.permissionService.findByCode(dto.permission_code, false);
        if (!permission) {
            throw new common_1.NotFoundException(`Permission with code '${dto.permission_code}' not found`);
        }
        if (!permission.is_active) {
            throw new common_1.ConflictException(`Cannot assign permission '${dto.permission_code}' because it is currently inactive in the system`);
        }
        const existing = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.findFirst({
            where: {
                role_id: dto.role_id,
                permission_id: permission.id
            },
        });
        if (existing) {
            if (!existing.is_active) {
                throw new common_1.ConflictException(`The relationship between role ${dto.role_id} and permission '${dto.permission_code}' already exists but is currently inactive. Please activate it instead of creating a new one`);
            }
            throw new common_1.ConflictException(`Role ${dto.role_id} already has permission '${dto.permission_code}' assigned and active`);
        }
        const created = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.create({
            data: {
                role_id: dto.role_id,
                permission_id: permission.id,
                is_active: dto.is_active ?? true
            },
        });
        const model = cacheable_factory_1.CacheableFactory.create(created, role_permission_model_1.RolePermissionModel);
        await this.cacheSet(this.rolePermissionCacheKey, { id: created.id }, model, model.cacheTTL());
        await this.invalidateListCaches();
        return model;
    }
    async findAll(useCache = true) {
        const cacheKey = this.rolePermissionListSuffixKey;
        return this.tryCacheOrExecute(this.rolePermissionCacheKey, { key: cacheKey }, useCache, async () => {
            const rolePermissions = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
                include: {
                    permissions: true,
                    role: true,
                },
                orderBy: { role_id: 'asc' },
            });
            const rolesMap = new Map();
            for (const rp of rolePermissions) {
                if (!rp.role)
                    continue;
                const roleId = rp.role.idrole;
                if (!rolesMap.has(roleId)) {
                    rolesMap.set(roleId, {
                        role: {
                            idrole: rp.role.idrole,
                            description: rp.role.description,
                        },
                        permissions: [],
                    });
                }
                if (rp.permissions) {
                    rolesMap.get(roleId).permissions.push({
                        id: rp.permissions.id,
                        code: rp.permissions.code,
                        name: rp.permissions.name,
                        description: rp.permissions.description,
                        is_active: rp.permissions.is_active,
                        action_id: rp.permissions.action_id,
                    });
                }
            }
            return {
                data: Array.from(rolesMap.values()),
            };
        });
    }
    async findAllPaginated(paginationDto, useCache = true) {
        const { page = 1, limit = 10, role_id, permission_code } = paginationDto;
        const cacheKey = `${this.rolePermissionListSuffixKey}_paginated_${page}_${limit}_${role_id}_${permission_code}`;
        return this.tryCacheOrExecute(this.rolePermissionCacheKey, { key: cacheKey }, useCache, async () => {
            const where = {};
            if (role_id !== undefined) {
                where.role_id = role_id;
            }
            if (permission_code !== undefined) {
                const permission = await this.permissionService.findByCode(permission_code, false);
                if (permission) {
                    where.permission_id = permission.id;
                }
                else {
                    return pagination_utils_1.PaginationUtils.createPaginatedResponse([], new pagination_dto_1.PaginationParams({ page, limit }), 0);
                }
            }
            const [rolePermissions, total] = await Promise.all([
                service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
                    where,
                    include: {
                        permissions: true,
                        role: true,
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { id: 'asc' },
                }),
                service_cache_1.ServiceCache.Database.Prisma.role_permissions.count({ where }),
            ]);
            const items = rolePermissions.map((rp) => ({
                ...cacheable_factory_1.CacheableFactory.create(rp, role_permission_model_1.RolePermissionModel).toJSON(),
                permission: rp.permissions ? {
                    id: rp.permissions.id,
                    code: rp.permissions.code,
                    name: rp.permissions.name,
                    description: rp.permissions.description,
                    is_active: rp.permissions.is_active,
                } : null,
                role: rp.role ? {
                    idrole: rp.role.idrole,
                    description: rp.role.description,
                } : null,
            }));
            return pagination_utils_1.PaginationUtils.createPaginatedResponse(items, new pagination_dto_1.PaginationParams({ page, limit }), total);
        });
    }
    async findOne(id, useCache = true) {
        return this.tryCacheOrExecute(this.rolePermissionCacheKey, { id }, useCache, async () => {
            const rolePermission = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.findUnique({
                where: { id },
                include: {
                    permissions: true,
                    role: true,
                },
            });
            if (!rolePermission) {
                throw new common_1.NotFoundException(`RolePermission with ID ${id} not found`);
            }
            return {
                ...cacheable_factory_1.CacheableFactory.create(rolePermission, role_permission_model_1.RolePermissionModel).toJSON(),
                permission: rolePermission.permissions ? {
                    id: rolePermission.permissions.id,
                    code: rolePermission.permissions.code,
                    name: rolePermission.permissions.name,
                    description: rolePermission.permissions.description,
                    is_active: rolePermission.permissions.is_active,
                } : null,
                role: rolePermission.role ? {
                    idrole: rolePermission.role.idrole,
                    description: rolePermission.role.description,
                } : null,
            };
        });
    }
    async findByRoleId(roleId, useCache = true) {
        console.log('\n🔍 ========== FIND BY ROLE ID ==========');
        console.log('📌 Role ID:', roleId);
        console.log('💾 Use Cache:', useCache);
        const cacheKey = `by_role_${roleId}`;
        console.log('🔑 Cache Key:', cacheKey);
        return this.tryCacheOrExecute(this.rolePermissionCacheKey, { key: cacheKey }, useCache, async () => {
            console.log('💽 Consultando base de datos...');
            const where = { role_id: roleId };
            const rolePermissions = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
                where,
                include: {
                    permissions: true,
                },
                orderBy: { id: 'asc' },
            });
            console.log('📊 Role Permissions encontrados:', rolePermissions.length);
            console.log('📋 Detalles:', JSON.stringify(rolePermissions.map(rp => ({
                id: rp.id,
                role_id: rp.role_id,
                permission_id: rp.permission_id,
                is_active: rp.is_active,
                permission_code: rp.permissions?.code
            })), null, 2));
            const permissionCodes = rolePermissions
                .map((rp) => rp.permissions?.code || null)
                .filter((code) => code !== null);
            console.log('✅ Códigos de permisos retornados:', permissionCodes);
            console.log('========== FIN FIND BY ROLE ID ==========\n');
            return permissionCodes;
        });
    }
    async findByPermissionId(permissionId, useCache = true) {
        const cacheKey = `by_permission_${permissionId}`;
        return this.tryCacheOrExecute(this.rolePermissionCacheKey, { key: cacheKey }, useCache, async () => {
            const where = { permission_id: permissionId };
            const rolePermissions = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
                where,
                include: {
                    permissions: true,
                    role: true,
                },
                orderBy: { id: 'asc' },
            });
            return rolePermissions.map((rp) => ({
                ...cacheable_factory_1.CacheableFactory.create(rp, role_permission_model_1.RolePermissionModel).toJSON(),
                permission: rp.permissions ? {
                    id: rp.permissions.id,
                    code: rp.permissions.code,
                    name: rp.permissions.name,
                    description: rp.permissions.description,
                    is_active: rp.permissions.is_active,
                } : null,
                role: rp.role ? {
                    idrole: rp.role.idrole,
                    description: rp.role.description,
                } : null,
            }));
        });
    }
    async findByPermissionCode(permissionCode, useCache = true) {
        const cacheKey = `by_permission_code_${permissionCode}`;
        return this.tryCacheOrExecute(this.rolePermissionCacheKey, { key: cacheKey }, useCache, async () => {
            const permission = await this.permissionService.findByCode(permissionCode, false);
            if (!permission) {
                throw new common_1.NotFoundException(`Permission with code '${permissionCode}' not found`);
            }
            const where = { permission_id: permission.id };
            const rolePermissions = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
                where,
                include: {
                    permissions: true,
                    role: true,
                },
                orderBy: { id: 'asc' },
            });
            return rolePermissions.map((rp) => ({
                ...cacheable_factory_1.CacheableFactory.create(rp, role_permission_model_1.RolePermissionModel).toJSON(),
                permission: rp.permissions ? {
                    id: rp.permissions.id,
                    code: rp.permissions.code,
                    name: rp.permissions.name,
                    description: rp.permissions.description,
                    is_active: rp.permissions.is_active,
                } : null,
                role: rp.role ? {
                    idrole: rp.role.idrole,
                    description: rp.role.description,
                } : null,
            }));
        });
    }
    async update(id, dto) {
        await this.findOne(id, false);
        if (dto.role_id) {
            const role = await service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
                where: { idrole: dto.role_id },
            });
            if (!role) {
                throw new common_1.NotFoundException(`Role with ID ${dto.role_id} not found`);
            }
        }
        let permissionId;
        if (dto.permission_code) {
            const permission = await this.permissionService.findByCode(dto.permission_code, false);
            if (!permission) {
                throw new common_1.NotFoundException(`Permission with code '${dto.permission_code}' not found`);
            }
            permissionId = permission.id;
        }
        if (dto.role_id || dto.permission_code) {
            const current = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.findUnique({
                where: { id },
            });
            const newRoleId = dto.role_id || current.role_id;
            const newPermissionId = permissionId || current.permission_id;
            const whereExisting = {
                role_id: newRoleId,
                permission_id: newPermissionId,
                id: { not: id },
            };
            const existing = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.findFirst({
                where: whereExisting,
            });
            if (existing) {
                throw new common_1.ConflictException(`Role ${newRoleId} already has permission with code '${dto.permission_code}'`);
            }
        }
        const updated = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.update({
            where: { id },
            data: {
                ...(dto.role_id && { role_id: dto.role_id }),
                ...(permissionId && { permission_id: permissionId }),
                ...(dto.is_active !== undefined && { is_active: dto.is_active }),
            },
        });
        const model = cacheable_factory_1.CacheableFactory.create(updated, role_permission_model_1.RolePermissionModel);
        await this.cacheSet(this.rolePermissionCacheKey, { id: updated.id }, model, model.cacheTTL());
        await this.invalidateListCaches();
        return model;
    }
    async remove(id) {
        await this.findOne(id, false);
        const updated = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.update({
            where: { id },
            data: { is_active: false },
        });
        const model = cacheable_factory_1.CacheableFactory.create(updated, role_permission_model_1.RolePermissionModel);
        await this.cacheSet(this.rolePermissionCacheKey, { id: updated.id }, model, model.cacheTTL());
        await this.invalidateListCaches();
    }
    async findRoleWithSamePermissions(permissionIds, roleIdToExclude) {
        const where = roleIdToExclude ? { idrole: { not: roleIdToExclude } } : {};
        const allRoles = await service_cache_1.ServiceCache.Database.Prisma.role.findMany({
            where,
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
    async assignPermissionsToRole(roleId, dto) {
        const role = await service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
            where: {
                idrole: roleId,
            },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${roleId} not found`);
        }
        const permissions = await service_cache_1.ServiceCache.Database.Prisma.permissions.findMany({
            where: {
                id: { in: dto.permission_ids },
            },
        });
        if (permissions.length !== dto.permission_ids.length) {
            const foundIds = permissions.map((p) => p.id);
            const missingIds = dto.permission_ids.filter((id) => !foundIds.includes(id));
            throw new common_1.NotFoundException(`Permissions not found: ${missingIds.join(', ')}`);
        }
        const inactivePermissions = permissions.filter((p) => !p.is_active);
        if (inactivePermissions.length > 0) {
            const inactiveCodes = inactivePermissions.map((p) => p.code).join(', ');
            throw new common_1.ConflictException(`Cannot assign inactive permissions: ${inactiveCodes}. Please activate them first`);
        }
        const duplicateRole = await this.findRoleWithSamePermissions(dto.permission_ids, roleId);
        if (duplicateRole) {
            throw new common_1.ConflictException(`A role with the same permission set already exists: '${duplicateRole.description}' (ID: ${duplicateRole.idrole}). Cannot assign duplicate permission configurations`);
        }
        const currentRolePermissions = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
            where: {
                role_id: roleId,
            },
        });
        const currentPermissionIds = currentRolePermissions.map((rp) => rp.permission_id);
        const newPermissionIds = dto.permission_ids;
        const permissionsToDeactivate = currentPermissionIds.filter((id) => !newPermissionIds.includes(id));
        const permissionsToActivate = newPermissionIds.filter((id) => currentPermissionIds.includes(id));
        const permissionsToCreate = newPermissionIds.filter((id) => !currentPermissionIds.includes(id));
        if (permissionsToDeactivate.length > 0) {
            await service_cache_1.ServiceCache.Database.Prisma.role_permissions.updateMany({
                where: {
                    role_id: roleId,
                    permission_id: { in: permissionsToDeactivate },
                },
                data: { is_active: false },
            });
        }
        if (permissionsToActivate.length > 0) {
            await service_cache_1.ServiceCache.Database.Prisma.role_permissions.updateMany({
                where: {
                    role_id: roleId,
                    permission_id: { in: permissionsToActivate },
                },
                data: { is_active: true },
            });
        }
        if (permissionsToCreate.length > 0) {
            await service_cache_1.ServiceCache.Database.Prisma.role_permissions.createMany({
                data: permissionsToCreate.map((permissionId) => ({
                    role_id: roleId,
                    permission_id: permissionId,
                    is_active: true,
                })),
            });
        }
        const rolePermissions = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
            where: {
                role_id: roleId,
            },
        });
        await this.invalidateListCaches();
        return rolePermissions.map((rp) => cacheable_factory_1.CacheableFactory.create(rp, role_permission_model_1.RolePermissionModel));
    }
    async deactivateAllPermissionsFromRole(roleId) {
        const role = await service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
            where: { idrole: roleId },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${roleId} not found`);
        }
        await service_cache_1.ServiceCache.Database.Prisma.role_permissions.updateMany({
            where: { role_id: roleId },
            data: { is_active: false },
        });
        await this.invalidateListCaches();
    }
    async removeAllPermissionsFromRole(roleId) {
        const role = await service_cache_1.ServiceCache.Database.Prisma.role.findFirst({
            where: { idrole: roleId },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${roleId} not found`);
        }
        await service_cache_1.ServiceCache.Database.Prisma.role_permissions.deleteMany({
            where: { role_id: roleId },
        });
        await this.invalidateListCaches();
    }
    async invalidateListCaches() {
        await this.cacheDelete(this.rolePermissionCacheKey, {
            key: this.rolePermissionListSuffixKey,
        });
        const pattern = `${this.rolePermissionCacheKey}:${this.rolePermissionListSuffixKey}_paginated_*`;
        await this.cache.deletePattern(pattern);
        const patternByRole = `${this.rolePermissionCacheKey}:by_role_*`;
        await this.cache.deletePattern(patternByRole);
        const patternByPermission = `${this.rolePermissionCacheKey}:by_permission_*`;
        await this.cache.deletePattern(patternByPermission);
        const patternByPermissionCode = `${this.rolePermissionCacheKey}:by_permission_code_*`;
        await this.cache.deletePattern(patternByPermissionCode);
    }
};
exports.RolePermissionService = RolePermissionService;
exports.RolePermissionService = RolePermissionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_cache_service_1.RedisCacheService,
        permission_service_1.PermissionService])
], RolePermissionService);
//# sourceMappingURL=role-permission.service.js.map