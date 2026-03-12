import { RedisCacheService } from './redis-cache.service';
export declare abstract class BaseCacheService {
    protected readonly cache: RedisCacheService;
    constructor(cache: RedisCacheService);
    tryCacheOrExecute<T>(key: string, params: Record<string, any>, shouldCache: boolean, callback: () => Promise<T>): Promise<T>;
    cacheSet<T>(key: string, params: Record<string, any>, value: T, ttl: number): Promise<void>;
    cacheGet<T>(key: string, params: Record<string, any>): Promise<T | null>;
    cacheDelete(key: string, params: Record<string, any>): Promise<void>;
    private isCacheable;
}
