import { RedisCacheService } from '../redis-cache.service';
import { SetCacheDto, ClearCachePatternDto, CacheStatsDto } from '../dtos/cache-key.dto';
export declare function getGlobalRedisCacheInstance(): RedisCacheService;
export declare class CacheAdminService {
    private readonly logger;
    private readonly cache;
    constructor();
    getCacheValue(key: string): Promise<any>;
    setCacheValue(dto: SetCacheDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteCacheKey(key: string): Promise<{
        success: boolean;
        message: string;
    }>;
    findKeysByPattern(pattern: string): Promise<string[]>;
    deleteByPattern(pattern: string): Promise<{
        success: boolean;
        deletedCount: number;
    }>;
    clearCache(dto: ClearCachePatternDto): Promise<{
        success: boolean;
        message: string;
        deletedCount: number;
    }>;
    getCacheStats(): Promise<CacheStatsDto>;
    listAllKeys(limit?: number): Promise<string[]>;
    private formatBytes;
}
