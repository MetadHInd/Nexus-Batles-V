import { RedisCacheService } from './redis-cache.service';
import { ICacheable } from './interfaces/cacheable.interface';

export abstract class BaseCacheService {
  constructor(protected readonly cache: RedisCacheService) {}

  async tryCacheOrExecute<T>(
    key: string,
    params: Record<string, any>,
    shouldCache: boolean,
    callback: () => Promise<T>,
  ): Promise<T> {
    if (shouldCache) {
      const cached = await this.cache.get<any>(key, params);
      if (cached) {
        // Si es un array de objetos, devolverlo directamente
        if (Array.isArray(cached)) {
          return cached as T;
        }
        // Para objetos individuales, devolverlos directamente
        // El UserProfileService se encargará de la reconstrucción específica
        return cached as T;
      }
    }

    const result = await callback();

    if (shouldCache) {
      // Manejar arrays de ICacheable
      if (Array.isArray(result)) {
        const firstItem = result[0];
        if (firstItem && this.isCacheable(firstItem)) {
          const ttl = firstItem.cacheTTL?.() ?? 300;
          const serialized = result.map((item: any) =>
            this.isCacheable(item) ? item.toJSON() : item,
          );
          await this.cache.set({ key, params }, serialized, ttl);
        } else {
          // Array simple, cachear directamente
          await this.cache.set({ key, params }, result, 300);
        }
      }
      // Manejar objeto individual ICacheable
      else if (this.isCacheable(result)) {
        await this.cache.set(
          { key, params },
          result.toJSON(),
          result.cacheTTL?.() ?? 300,
        );
      }
      // Otros objetos, cachear directamente
      else if (result !== null && result !== undefined) {
        await this.cache.set({ key, params }, result, 300);
      }
    }

    return result;
  }

  // Métodos auxiliares para el manejo de cache
  async cacheSet<T>(
    key: string,
    params: Record<string, any>,
    value: T,
    ttl: number,
  ): Promise<void> {
    await this.cache.set({ key, params }, value, ttl);
  }

  async cacheGet<T>(
    key: string,
    params: Record<string, any>,
  ): Promise<T | null> {
    return await this.cache.get<T>(key, params);
  }

  async cacheDelete(key: string, params: Record<string, any>): Promise<void> {
    await this.cache.delete(key, params);
  }

  private isCacheable(obj: any): obj is ICacheable {
    return (
      obj !== null &&
      obj !== undefined &&
      typeof (obj as Record<string, unknown>).cacheKey === 'function' &&
      typeof (obj as Record<string, unknown>).toJSON === 'function'
    );
  }
}
