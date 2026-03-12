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
exports.PermissionService = void 0;
const common_1 = require("@nestjs/common");
const permission_model_1 = require("../models/permission.model");
const redis_cache_service_1 = require("../../../shared/cache/redis-cache.service");
const base_paginated_service_1 = require("../../../shared/common/services/base-paginated.service");
const service_cache_1 = require("../../../shared/core/services/service-cache/service-cache");
const cacheable_factory_1 = require("../../../shared/cache/factories/cacheable.factory");
const pagination_dto_1 = require("../../../shared/common/dtos/pagination.dto");
const pagination_utils_1 = require("../../../shared/common/utils/pagination.utils");
let PermissionService = class PermissionService extends base_paginated_service_1.BasePaginatedService {
    constructor(cache) {
        super(cache);
    }
    permissionCacheKey = 'permission';
    permissionListSuffixKey = '_list';
    async create(dto) {
        const moduleExists = await service_cache_1.ServiceCache.Database.Prisma.module.findUnique({
            where: { id: dto.module_id },
        });
        if (!moduleExists) {
            throw new common_1.NotFoundException(`Module with ID ${dto.module_id} not found`);
        }
        if (!moduleExists.slug) {
            throw new common_1.ConflictException(`Module with ID ${dto.module_id} does not have a slug defined`);
        }
        const actionExists = await service_cache_1.ServiceCache.Database.Prisma.actions.findUnique({
            where: { id: dto.action_id },
        });
        if (!actionExists) {
            throw new common_1.NotFoundException(`Action with ID ${dto.action_id} not found`);
        }
        if (!actionExists.slug) {
            throw new common_1.ConflictException(`Action with ID ${dto.action_id} does not have a slug defined`);
        }
        const generatedCode = `${actionExists.slug}:${moduleExists.slug}`;
        const generatedName = `${actionExists.description || actionExists.slug} ${moduleExists.slug}`;
        const existing = await service_cache_1.ServiceCache.Database.Prisma.permissions.findFirst({
            where: { code: generatedCode },
        });
        if (existing) {
            throw new common_1.ConflictException(`Permission with code '${generatedCode}' already exists (module: ${moduleExists.slug}, action: ${actionExists.slug})`);
        }
        const created = await service_cache_1.ServiceCache.Database.Prisma.permissions.create({
            data: {
                code: generatedCode,
                name: dto.name || generatedName,
                description: dto.description || null,
                is_active: dto.is_active ?? true,
                action_id: dto.action_id,
                module_id: dto.module_id,
            },
        });
        const model = cacheable_factory_1.CacheableFactory.create(created, permission_model_1.PermissionModel);
        await this.cacheSet(this.permissionCacheKey, { id: created.id }, model, model.cacheTTL());
        await this.invalidateListCaches();
        await this.createRolePermissionsForNewPermission(created.id);
        return model;
    }
    async findAll(useCache = true) {
        return this.tryCacheOrExecute(this.permissionCacheKey, { key: this.permissionListSuffixKey }, useCache, async () => {
            const permissions = await service_cache_1.ServiceCache.Database.Prisma.permissions.findMany({
                orderBy: { code: 'asc' },
            });
            return permissions.map((permission) => cacheable_factory_1.CacheableFactory.create(permission, permission_model_1.PermissionModel));
        });
    }
    async findAllPaginated(paginationDto, useCache = true) {
        const { page = 1, limit = 10, is_active, search } = paginationDto;
        const cacheKey = `${this.permissionListSuffixKey}_paginated_${page}_${limit}_${is_active}_${search}`;
        return this.tryCacheOrExecute(this.permissionCacheKey, { key: cacheKey }, useCache, async () => {
            const where = {};
            if (is_active !== undefined) {
                where.is_active = is_active;
            }
            if (search) {
                where.OR = [
                    { code: { contains: search, mode: 'insensitive' } },
                    { name: { contains: search, mode: 'insensitive' } },
                ];
            }
            const [permissions, total] = await Promise.all([
                service_cache_1.ServiceCache.Database.Prisma.permissions.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { code: 'asc' },
                }),
                service_cache_1.ServiceCache.Database.Prisma.permissions.count({ where }),
            ]);
            const items = permissions.map((permission) => cacheable_factory_1.CacheableFactory.create(permission, permission_model_1.PermissionModel));
            return pagination_utils_1.PaginationUtils.createPaginatedResponse(items, new pagination_dto_1.PaginationParams({ page, limit }), total);
        });
    }
    async findOne(id, useCache = true) {
        return this.tryCacheOrExecute(this.permissionCacheKey, { id }, useCache, async () => {
            const permission = await service_cache_1.ServiceCache.Database.Prisma.permissions.findUnique({
                where: { id },
            });
            if (!permission) {
                throw new common_1.NotFoundException(`Permission with ID ${id} not found`);
            }
            return cacheable_factory_1.CacheableFactory.create(permission, permission_model_1.PermissionModel);
        });
    }
    async findByCode(code, useCache = true) {
        const cacheKey = `by_code_${code}`;
        return this.tryCacheOrExecute(this.permissionCacheKey, { key: cacheKey }, useCache, async () => {
            const permission = await service_cache_1.ServiceCache.Database.Prisma.permissions.findFirst({
                where: { code },
            });
            if (!permission) {
                return null;
            }
            return cacheable_factory_1.CacheableFactory.create(permission, permission_model_1.PermissionModel);
        });
    }
    async update(id, dto) {
        const currentPermission = await this.findOne(id, false);
        let newCode;
        if (dto.module_id || dto.action_id) {
            const moduleId = dto.module_id ?? currentPermission.module_id;
            const actionId = dto.action_id ?? currentPermission.action_id;
            const moduleExists = await service_cache_1.ServiceCache.Database.Prisma.module.findUnique({
                where: { id: moduleId },
            });
            if (!moduleExists) {
                throw new common_1.NotFoundException(`Module with ID ${moduleId} not found`);
            }
            if (!moduleExists.slug) {
                throw new common_1.ConflictException(`Module with ID ${moduleId} does not have a slug defined`);
            }
            if (!actionId) {
                throw new common_1.ConflictException(`Action ID is required to generate permission code`);
            }
            const actionExists = await service_cache_1.ServiceCache.Database.Prisma.actions.findUnique({
                where: { id: actionId },
            });
            if (!actionExists) {
                throw new common_1.NotFoundException(`Action with ID ${actionId} not found`);
            }
            if (!actionExists.slug) {
                throw new common_1.ConflictException(`Action with ID ${actionId} does not have a slug defined`);
            }
            newCode = `${actionExists.slug}:${moduleExists.slug}`;
            if (newCode !== currentPermission.code) {
                const existing = await service_cache_1.ServiceCache.Database.Prisma.permissions.findFirst({
                    where: {
                        code: newCode,
                        id: { not: id },
                    },
                });
                if (existing) {
                    throw new common_1.ConflictException(`Permission with code '${newCode}' already exists (module: ${moduleExists.slug}, action: ${actionExists.slug})`);
                }
            }
        }
        const updated = await service_cache_1.ServiceCache.Database.Prisma.permissions.update({
            where: { id },
            data: {
                ...(newCode && { code: newCode }),
                ...(dto.name && { name: dto.name }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.is_active !== undefined && { is_active: dto.is_active }),
                ...(dto.action_id !== undefined && { action_id: dto.action_id }),
                ...(dto.module_id !== undefined && { module_id: dto.module_id }),
            },
        });
        const model = cacheable_factory_1.CacheableFactory.create(updated, permission_model_1.PermissionModel);
        await this.cacheSet(this.permissionCacheKey, { id: updated.id }, model, model.cacheTTL());
        await this.invalidateListCaches();
        return model;
    }
    async remove(id) {
        await this.findOne(id, false);
        const rolePermissions = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.count({
            where: { permission_id: id },
        });
        if (rolePermissions > 0) {
            throw new common_1.ConflictException(`Cannot delete permission with ID ${id} because it has ${rolePermissions} role(s) associated`);
        }
        await service_cache_1.ServiceCache.Database.Prisma.permissions.delete({
            where: { id },
        });
        await this.cacheDelete(this.permissionCacheKey, { id });
        await this.invalidateListCaches();
    }
    async createRolePermissionsForNewPermission(permissionId) {
        const allRoles = await service_cache_1.ServiceCache.Database.Prisma.role.findMany({
            select: {
                idrole: true,
                description: true,
                is_super: true,
            },
        });
        console.log(`🔍 Found ${allRoles.length} roles to process`);
        const rolePermissionsToCreate = [];
        for (const role of allRoles) {
            const recordToCreate = {
                role_id: role.idrole,
                permission_id: permissionId,
                is_active: role.is_super === true,
            };
            console.log(`  ➕ Preparing record: role_id=${recordToCreate.role_id}, permission_id=${recordToCreate.permission_id}, is_active=${recordToCreate.is_active}`);
            rolePermissionsToCreate.push(recordToCreate);
        }
        console.log(`📦 Prepared ${rolePermissionsToCreate.length} role_permissions to create`);
        console.log(`📊 Breakdown: ${JSON.stringify(rolePermissionsToCreate, null, 2)}`);
        if (rolePermissionsToCreate.length > 0) {
            const existingRecords = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
                where: {
                    permission_id: permissionId,
                },
                select: {
                    id: true,
                    role_id: true,
                    permission_id: true,
                    is_active: true,
                },
            });
            console.log(`🔍 Found ${existingRecords.length} existing role_permissions for permission ${permissionId}:`);
            if (existingRecords.length > 0) {
                console.log(JSON.stringify(existingRecords, null, 2));
            }
            try {
                const result = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.createMany({
                    data: rolePermissionsToCreate,
                    skipDuplicates: true,
                });
                console.log(`✅ Successfully created ${result.count} role_permissions for permission ${permissionId}`);
                if (result.count !== rolePermissionsToCreate.length) {
                    console.warn(`⚠️ WARNING: Prepared ${rolePermissionsToCreate.length} but only created ${result.count}. This means ${rolePermissionsToCreate.length - result.count} were skipped as duplicates.`);
                    const afterCreate = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.findMany({
                        where: {
                            permission_id: permissionId,
                        },
                        select: {
                            id: true,
                            role_id: true,
                            permission_id: true,
                            is_active: true,
                        },
                    });
                    console.log(`📊 After creation, total records for permission ${permissionId}: ${afterCreate.length}`);
                    console.log(JSON.stringify(afterCreate, null, 2));
                }
            }
            catch (error) {
                console.error(`❌ Error creating role_permissions:`, error);
                throw error;
            }
        }
    }
    async invalidateListCaches() {
        await this.cacheDelete(this.permissionCacheKey, {
            key: this.permissionListSuffixKey,
        });
        const pattern = `${this.permissionCacheKey}:${this.permissionListSuffixKey}_paginated_*`;
        await this.cache.deletePattern(pattern);
        const patternByCode = `${this.permissionCacheKey}:by_code_*`;
        await this.cache.deletePattern(patternByCode);
    }
};
exports.PermissionService = PermissionService;
exports.PermissionService = PermissionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_cache_service_1.RedisCacheService])
], PermissionService);
//# sourceMappingURL=permission.service.js.map