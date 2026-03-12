import { RedisCacheService } from './redis-cache.service';
import { ClearModuleCacheDto, ClearCacheResponseDto, GetCacheKeysDto, CacheKeysResponseDto } from './dtos/clear-cache.dto';
export declare class CacheManagementService {
    private readonly cacheService;
    private readonly logger;
    constructor(cacheService: RedisCacheService);
    private getTenantId;
    clearCache(dto: ClearModuleCacheDto): Promise<ClearCacheResponseDto>;
    getCacheKeys(dto: GetCacheKeysDto): Promise<CacheKeysResponseDto>;
    getCacheStats(): Promise<any>;
    getAvailableModules(): Promise<string[]>;
    getCacheValue(key: string): Promise<any>;
    getCacheKeysWithValues(pattern?: string, limit?: number): Promise<any>;
}
