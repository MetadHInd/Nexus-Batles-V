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
exports.ModuleService = void 0;
const common_1 = require("@nestjs/common");
const module_model_1 = require("../models/module.model");
const redis_cache_service_1 = require("../../../shared/cache/redis-cache.service");
const base_paginated_service_1 = require("../../../shared/common/services/base-paginated.service");
const service_cache_1 = require("../../../shared/core/services/service-cache/service-cache");
const cacheable_factory_1 = require("../../../shared/cache/factories/cacheable.factory");
const permission_service_1 = require("../../permissions/services/permission.service");
let ModuleService = class ModuleService extends base_paginated_service_1.BasePaginatedService {
    permissionService;
    constructor(cache, permissionService) {
        super(cache);
        this.permissionService = permissionService;
    }
    moduleCacheKey = 'module';
    moduleListSuffixKey = '_list';
    async create(dto) {
        const existing = await service_cache_1.ServiceCache.Database.Prisma.module.findFirst({
            where: { name: dto.name },
        });
        if (existing) {
            throw new common_1.ConflictException(`Module with name '${dto.name}' already exists`);
        }
        if (dto.action_ids && dto.action_ids.length > 0 && !dto.slug) {
            throw new common_1.ConflictException('Module must have a slug to create permissions automatically');
        }
        const created = await service_cache_1.ServiceCache.Database.Prisma.module.create({
            data: {
                name: dto.name,
                module: dto.module,
                description: dto.description || null,
                slug: dto.slug || null,
            },
        });
        const model = cacheable_factory_1.CacheableFactory.create(created, module_model_1.ModuleModel);
        await this.cacheSet(this.moduleCacheKey, { id: created.id }, model, model.cacheTTL());
        await this.invalidateListCaches();
        if (dto.action_ids && dto.action_ids.length > 0) {
            for (const actionId of dto.action_ids) {
                try {
                    await this.permissionService.create({
                        module_id: created.id,
                        action_id: actionId,
                        is_active: true,
                    });
                }
                catch (error) {
                    if (error instanceof common_1.ConflictException) {
                        console.log(`Permission already exists for module ${created.id} and action ${actionId}`);
                        continue;
                    }
                    throw error;
                }
            }
        }
        return model;
    }
    async findAll(useCache = true) {
        return this.tryCacheOrExecute(this.moduleCacheKey, { key: this.moduleListSuffixKey }, useCache, async () => {
            const modules = await service_cache_1.ServiceCache.Database.Prisma.module.findMany({
                orderBy: { name: 'asc' },
            });
            return modules.map((module) => cacheable_factory_1.CacheableFactory.create(module, module_model_1.ModuleModel));
        });
    }
    async findOne(id, useCache = true) {
        return this.tryCacheOrExecute(this.moduleCacheKey, { id }, useCache, async () => {
            const module = await service_cache_1.ServiceCache.Database.Prisma.module.findUnique({
                where: { id },
            });
            if (!module) {
                throw new common_1.NotFoundException(`Module with ID ${id} not found`);
            }
            return cacheable_factory_1.CacheableFactory.create(module, module_model_1.ModuleModel);
        });
    }
    async findByUuid(uuid, useCache = true) {
        return this.tryCacheOrExecute(this.moduleCacheKey, { uuid }, useCache, async () => {
            const module = await service_cache_1.ServiceCache.Database.Prisma.module.findFirst({
                where: { uuid },
            });
            if (!module) {
                throw new common_1.NotFoundException(`Module with UUID ${uuid} not found`);
            }
            return cacheable_factory_1.CacheableFactory.create(module, module_model_1.ModuleModel);
        });
    }
    async update(id, dto) {
        await this.findOne(id, false);
        if (dto.name) {
            const existing = await service_cache_1.ServiceCache.Database.Prisma.module.findFirst({
                where: {
                    name: dto.name,
                    NOT: { id },
                },
            });
            if (existing) {
                throw new common_1.ConflictException(`Module with name '${dto.name}' already exists`);
            }
        }
        const updated = await service_cache_1.ServiceCache.Database.Prisma.module.update({
            where: { id },
            data: dto,
        });
        const model = cacheable_factory_1.CacheableFactory.create(updated, module_model_1.ModuleModel);
        await this.cacheSet(this.moduleCacheKey, { id: updated.id }, model, model.cacheTTL());
        await this.invalidateListCaches();
        return model;
    }
    async delete(id) {
        await this.findOne(id, false);
        const permissions = await service_cache_1.ServiceCache.Database.Prisma.permissions.findMany({
            where: { module_id: id },
            select: { id: true },
        });
        const permissionIds = permissions.map(p => p.id);
        console.log(`🗑️ Module ${id} has ${permissionIds.length} permissions to delete`);
        if (permissionIds.length > 0) {
            const deletedRolePermissions = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.deleteMany({
                where: {
                    permission_id: { in: permissionIds },
                },
            });
            console.log(`🗑️ Deleted ${deletedRolePermissions.count} role_permissions records`);
            const deletedPermissions = await service_cache_1.ServiceCache.Database.Prisma.permissions.deleteMany({
                where: {
                    module_id: id,
                },
            });
            console.log(`🗑️ Deleted ${deletedPermissions.count} permissions`);
            await this.permissionService['invalidateListCaches']();
        }
        await service_cache_1.ServiceCache.Database.Prisma.module.delete({
            where: { id },
        });
        console.log(`✅ Module ${id} deleted successfully`);
        await this.cacheDelete(this.moduleCacheKey, { id });
        await this.invalidateListCaches();
    }
    async bulkDelete(dto) {
        const { ids } = dto;
        const permissions = await service_cache_1.ServiceCache.Database.Prisma.permissions.findMany({
            where: { module_id: { in: ids } },
            select: { id: true },
        });
        const permissionIds = permissions.map(p => p.id);
        console.log(`🗑️ Modules ${ids.join(', ')} have ${permissionIds.length} permissions to delete`);
        if (permissionIds.length > 0) {
            const deletedRolePermissions = await service_cache_1.ServiceCache.Database.Prisma.role_permissions.deleteMany({
                where: {
                    permission_id: { in: permissionIds },
                },
            });
            console.log(`🗑️ Deleted ${deletedRolePermissions.count} role_permissions records`);
            const deletedPermissions = await service_cache_1.ServiceCache.Database.Prisma.permissions.deleteMany({
                where: {
                    module_id: { in: ids },
                },
            });
            console.log(`🗑️ Deleted ${deletedPermissions.count} permissions`);
            await this.permissionService['invalidateListCaches']();
        }
        const result = await service_cache_1.ServiceCache.Database.Prisma.module.deleteMany({
            where: {
                id: { in: ids },
            },
        });
        console.log(`✅ ${result.count} modules deleted successfully`);
        await Promise.all(ids.map((id) => this.cacheDelete(this.moduleCacheKey, { id })));
        await this.invalidateListCaches();
        return { deleted: result.count };
    }
    async invalidateListCaches() {
        const pattern = `${this.moduleCacheKey}:${this.moduleListSuffixKey}*`;
        await this.cache.deletePattern(pattern);
    }
};
exports.ModuleService = ModuleService;
exports.ModuleService = ModuleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_cache_service_1.RedisCacheService,
        permission_service_1.PermissionService])
], ModuleService);
//# sourceMappingURL=module.service.js.map