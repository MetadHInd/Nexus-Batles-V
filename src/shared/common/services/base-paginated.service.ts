import { BaseCacheService } from 'src/shared/cache/base-cache.service';
import { RedisCacheService } from 'src/shared/cache/redis-cache.service';
import { 
  PaginationDto, 
  PaginatedResponse, 
  PaginationParams 
} from '../dtos/pagination.dto';
import { PaginationUtils } from '../utils/pagination.utils';

export abstract class BasePaginatedService extends BaseCacheService {
  constructor(cache: RedisCacheService) {
    super(cache);
  }

  /**
   * Ejecuta una consulta paginada con cache
   */
  protected async executePaginatedQuery<T>(
    cacheKey: string,
    paginationDto: PaginationDto,
    queryFn: (params: PaginationParams) => Promise<{ data: T[]; total: number }>,
    useCache = true,
    additionalCacheParams?: Record<string, any>,
  ): Promise<PaginatedResponse<T>> {
    const params = new PaginationParams(paginationDto);
    PaginationUtils.validateParams(params);

    const fullCacheKey = PaginationUtils.generateCacheKey(
      cacheKey,
      params,
      additionalCacheParams,
    );

    return this.tryCacheOrExecute(
      cacheKey,
      { key: fullCacheKey },
      useCache,
      async () => {
        const { data, total } = await queryFn(params);
        return PaginationUtils.createPaginatedResponse(data, params, total);
      },
    );
  }

  /**
   * Invalida todas las caches de paginación para una entidad
   */
  protected async invalidatePaginationCaches(cacheKey: string): Promise<void> {
    // Patrón para buscar todas las claves de paginación
    const pattern = `${cacheKey}_paginated_*`;
    await this.cache.deletePattern(pattern);
  }
}
