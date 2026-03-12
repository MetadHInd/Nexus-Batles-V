import { BaseCacheService } from 'src/shared/cache/base-cache.service';
import { RedisCacheService } from 'src/shared/cache/redis-cache.service';
import { PaginationDto, PaginatedResponse, PaginationParams } from '../dtos/pagination.dto';
export declare abstract class BasePaginatedService extends BaseCacheService {
    constructor(cache: RedisCacheService);
    protected executePaginatedQuery<T>(cacheKey: string, paginationDto: PaginationDto, queryFn: (params: PaginationParams) => Promise<{
        data: T[];
        total: number;
    }>, useCache?: boolean, additionalCacheParams?: Record<string, any>): Promise<PaginatedResponse<T>>;
    protected invalidatePaginationCaches(cacheKey: string): Promise<void>;
}
