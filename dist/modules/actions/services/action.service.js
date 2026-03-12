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
exports.ActionService = void 0;
const common_1 = require("@nestjs/common");
const action_model_1 = require("../models/action.model");
const redis_cache_service_1 = require("../../../shared/cache/redis-cache.service");
const base_paginated_service_1 = require("../../../shared/common/services/base-paginated.service");
const service_cache_1 = require("../../../shared/core/services/service-cache/service-cache");
const cacheable_factory_1 = require("../../../shared/cache/factories/cacheable.factory");
let ActionService = class ActionService extends base_paginated_service_1.BasePaginatedService {
    constructor(cache) {
        super(cache);
    }
    actionCacheKey = 'action';
    actionListSuffixKey = '_list';
    async create(dto) {
        const created = await service_cache_1.ServiceCache.Database.Prisma.actions.create({
            data: {
                description: dto.description || null,
                slug: dto.slug || null,
            },
        });
        const model = cacheable_factory_1.CacheableFactory.create(created, action_model_1.ActionModel);
        await this.cacheSet(this.actionCacheKey, { id: created.id }, model, model.cacheTTL());
        await this.invalidateListCaches();
        return model;
    }
    async findAll(useCache = true) {
        return this.tryCacheOrExecute(this.actionCacheKey, { key: this.actionListSuffixKey }, useCache, async () => {
            const actions = await service_cache_1.ServiceCache.Database.Prisma.actions.findMany({
                orderBy: { id: 'asc' },
            });
            return actions.map((action) => cacheable_factory_1.CacheableFactory.create(action, action_model_1.ActionModel));
        });
    }
    async findOne(id, useCache = true) {
        return this.tryCacheOrExecute(this.actionCacheKey, { id }, useCache, async () => {
            const action = await service_cache_1.ServiceCache.Database.Prisma.actions.findUnique({
                where: { id },
            });
            if (!action) {
                throw new common_1.NotFoundException(`Action with ID ${id} not found`);
            }
            return cacheable_factory_1.CacheableFactory.create(action, action_model_1.ActionModel);
        });
    }
    async update(id, dto) {
        await this.findOne(id, false);
        const updated = await service_cache_1.ServiceCache.Database.Prisma.actions.update({
            where: { id },
            data: dto,
        });
        const model = cacheable_factory_1.CacheableFactory.create(updated, action_model_1.ActionModel);
        await this.cacheSet(this.actionCacheKey, { id: updated.id }, model, model.cacheTTL());
        await this.invalidateListCaches();
        return model;
    }
    async delete(id) {
        await this.findOne(id, false);
        await service_cache_1.ServiceCache.Database.Prisma.actions.delete({
            where: { id },
        });
        await this.cacheDelete(this.actionCacheKey, { id });
        await this.invalidateListCaches();
    }
    async bulkDelete(dto) {
        const { ids } = dto;
        const result = await service_cache_1.ServiceCache.Database.Prisma.actions.deleteMany({
            where: {
                id: { in: ids },
            },
        });
        await Promise.all(ids.map((id) => this.cacheDelete(this.actionCacheKey, { id })));
        await this.invalidateListCaches();
        return { deleted: result.count };
    }
    async invalidateListCaches() {
        const pattern = `${this.actionCacheKey}:${this.actionListSuffixKey}*`;
        await this.cache.deletePattern(pattern);
    }
};
exports.ActionService = ActionService;
exports.ActionService = ActionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_cache_service_1.RedisCacheService])
], ActionService);
//# sourceMappingURL=action.service.js.map