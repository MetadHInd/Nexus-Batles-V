"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCacheService = void 0;
class BaseCacheService {
    cache;
    constructor(cache) {
        this.cache = cache;
    }
    async tryCacheOrExecute(key, params, shouldCache, callback) {
        if (shouldCache) {
            const cached = await this.cache.get(key, params);
            if (cached) {
                if (Array.isArray(cached)) {
                    return cached;
                }
                return cached;
            }
        }
        const result = await callback();
        if (shouldCache) {
            if (Array.isArray(result)) {
                const firstItem = result[0];
                if (firstItem && this.isCacheable(firstItem)) {
                    const ttl = firstItem.cacheTTL?.() ?? 300;
                    const serialized = result.map((item) => this.isCacheable(item) ? item.toJSON() : item);
                    await this.cache.set({ key, params }, serialized, ttl);
                }
                else {
                    await this.cache.set({ key, params }, result, 300);
                }
            }
            else if (this.isCacheable(result)) {
                await this.cache.set({ key, params }, result.toJSON(), result.cacheTTL?.() ?? 300);
            }
            else if (result !== null && result !== undefined) {
                await this.cache.set({ key, params }, result, 300);
            }
        }
        return result;
    }
    async cacheSet(key, params, value, ttl) {
        await this.cache.set({ key, params }, value, ttl);
    }
    async cacheGet(key, params) {
        return await this.cache.get(key, params);
    }
    async cacheDelete(key, params) {
        await this.cache.delete(key, params);
    }
    isCacheable(obj) {
        return (obj !== null &&
            obj !== undefined &&
            typeof obj.cacheKey === 'function' &&
            typeof obj.toJSON === 'function');
    }
}
exports.BaseCacheService = BaseCacheService;
//# sourceMappingURL=base-cache.service.js.map