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
var CacheAdminService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheAdminService = void 0;
exports.getGlobalRedisCacheInstance = getGlobalRedisCacheInstance;
const common_1 = require("@nestjs/common");
const redis_cache_service_1 = require("../redis-cache.service");
let globalRedisCacheInstance = null;
function getGlobalRedisCacheInstance() {
    if (!globalRedisCacheInstance) {
        globalRedisCacheInstance = new redis_cache_service_1.RedisCacheService();
    }
    return globalRedisCacheInstance;
}
let CacheAdminService = CacheAdminService_1 = class CacheAdminService {
    logger = new common_1.Logger(CacheAdminService_1.name);
    cache;
    constructor() {
        this.cache = getGlobalRedisCacheInstance();
    }
    async getCacheValue(key) {
        return this.cache.get(key);
    }
    async setCacheValue(dto) {
        await this.cache.set({ key: dto.key }, dto.value, dto.ttl);
        return {
            success: true,
            message: `Cache key '${dto.key}' set successfully${dto.ttl ? ` with TTL ${dto.ttl}s` : ''}`,
        };
    }
    async deleteCacheKey(key) {
        await this.cache.delete(key);
        return {
            success: true,
            message: `Cache key '${key}' deleted successfully`,
        };
    }
    async findKeysByPattern(pattern) {
        const redis = this.cache['redis'];
        if (!redis) {
            return [];
        }
        return new Promise((resolve, reject) => {
            const keys = [];
            const stream = redis.scanStream({
                match: pattern,
                count: 100,
            });
            stream.on('data', (resultKeys) => {
                keys.push(...resultKeys);
            });
            stream.on('end', () => {
                resolve(keys);
            });
            stream.on('error', (err) => {
                reject(err);
            });
        });
    }
    async deleteByPattern(pattern) {
        const keys = await this.findKeysByPattern(pattern);
        if (keys.length === 0) {
            return { success: true, deletedCount: 0 };
        }
        await Promise.all(keys.map(key => this.cache.delete(key)));
        return {
            success: true,
            deletedCount: keys.length,
        };
    }
    async clearCache(dto) {
        let deletedCount = 0;
        if (dto.paginationOnly) {
            const result = await this.deleteByPattern('*_paginated_*');
            deletedCount = result.deletedCount;
            return {
                success: true,
                message: `Cleared ${deletedCount} pagination cache entries`,
                deletedCount,
            };
        }
        if (dto.pattern) {
            const result = await this.deleteByPattern(dto.pattern);
            deletedCount = result.deletedCount;
            return {
                success: true,
                message: `Cleared ${deletedCount} cache entries matching pattern '${dto.pattern}'`,
                deletedCount,
            };
        }
        const redis = this.cache['redis'];
        if (redis) {
            await redis.flushdb();
            return {
                success: true,
                message: 'All cache cleared successfully',
                deletedCount: -1,
            };
        }
        return {
            success: false,
            message: 'Redis not connected',
            deletedCount: 0,
        };
    }
    async getCacheStats() {
        const redis = this.cache['redis'];
        if (!redis) {
            return {
                totalKeys: 0,
                memoryUsage: 0,
                connected: false,
            };
        }
        try {
            const dbsize = await redis.dbsize();
            const info = await redis.info('memory');
            const memoryMatch = info.match(/used_memory:(\d+)/);
            const memoryUsage = memoryMatch ? parseInt(memoryMatch[1]) : 0;
            return {
                totalKeys: dbsize,
                memoryUsage,
                connected: true,
                serverInfo: {
                    memory: this.formatBytes(memoryUsage),
                    keys: dbsize,
                },
            };
        }
        catch (error) {
            this.logger.error('Error getting cache stats:', error);
            return {
                totalKeys: 0,
                memoryUsage: 0,
                connected: false,
            };
        }
    }
    async listAllKeys(limit = 100) {
        return this.findKeysByPattern('*').then(keys => keys.slice(0, limit));
    }
    formatBytes(bytes) {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
};
exports.CacheAdminService = CacheAdminService;
exports.CacheAdminService = CacheAdminService = CacheAdminService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CacheAdminService);
//# sourceMappingURL=cache-admin.service.js.map