import { Injectable, Logger } from '@nestjs/common';
import { RedisCacheService } from '../redis-cache.service';
import { SetCacheDto, ClearCachePatternDto, CacheStatsDto } from '../dtos/cache-key.dto';

// Instancia singleton para uso global
let globalRedisCacheInstance: RedisCacheService | null = null;
export function getGlobalRedisCacheInstance(): RedisCacheService {
  if (!globalRedisCacheInstance) {
    globalRedisCacheInstance = new RedisCacheService();
  }
  return globalRedisCacheInstance;
}

/**
 * 🗂️ SERVICIO DE ADMINISTRACIÓN DE CACHE
 * 
 * Proporciona operaciones simplificadas para gestionar el cache desde el frontend:
 * - Obtener/Establecer/Eliminar valores individuales
 * - Buscar claves por patrón
 * - Limpiar cache por criterios
 * - Estadísticas globales del cache
 */
@Injectable()
export class CacheAdminService {
  private readonly logger = new Logger(CacheAdminService.name);
  private readonly cache: RedisCacheService;

  constructor() {
    this.cache = getGlobalRedisCacheInstance();
  }

  /**
   * Obtener valor de una clave específica
   */
  async getCacheValue(key: string): Promise<any> {
    return this.cache.get(key);
  }

  /**
   * Establecer valor en cache
   */
  async setCacheValue(dto: SetCacheDto): Promise<{ success: boolean; message: string }> {
    await this.cache.set({ key: dto.key }, dto.value, dto.ttl);
    return {
      success: true,
      message: `Cache key '${dto.key}' set successfully${dto.ttl ? ` with TTL ${dto.ttl}s` : ''}`,
    };
  }

  /**
   * Eliminar una clave específica
   */
  async deleteCacheKey(key: string): Promise<{ success: boolean; message: string }> {
    await this.cache.delete(key);
    return {
      success: true,
      message: `Cache key '${key}' deleted successfully`,
    };
  }

  /**
   * Buscar claves por patrón
   */
  async findKeysByPattern(pattern: string): Promise<string[]> {
    const redis = this.cache['redis']; // Acceso directo a la instancia de Redis
    if (!redis) {
      return [];
    }

    return new Promise((resolve, reject) => {
      const keys: string[] = [];
      const stream = redis.scanStream({
        match: pattern,
        count: 100,
      });

      stream.on('data', (resultKeys: string[]) => {
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

  /**
   * Eliminar claves por patrón
   */
  async deleteByPattern(pattern: string): Promise<{ success: boolean; deletedCount: number }> {
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

  /**
   * Limpiar cache según criterios
   */
  async clearCache(dto: ClearCachePatternDto): Promise<{ success: boolean; message: string; deletedCount: number }> {
    let deletedCount = 0;

    if (dto.paginationOnly) {
      // Solo limpiar caches de paginación
      const result = await this.deleteByPattern('*_paginated_*');
      deletedCount = result.deletedCount;
      return {
        success: true,
        message: `Cleared ${deletedCount} pagination cache entries`,
        deletedCount,
      };
    }

    if (dto.pattern) {
      // Limpiar por patrón específico
      const result = await this.deleteByPattern(dto.pattern);
      deletedCount = result.deletedCount;
      return {
        success: true,
        message: `Cleared ${deletedCount} cache entries matching pattern '${dto.pattern}'`,
        deletedCount,
      };
    }

    // Limpiar todo el cache
    const redis = this.cache['redis'];
    if (redis) {
      await redis.flushdb();
      return {
        success: true,
        message: 'All cache cleared successfully',
        deletedCount: -1, // No podemos saber cuántas claves había
      };
    }

    return {
      success: false,
      message: 'Redis not connected',
      deletedCount: 0,
    };
  }

  /**
   * Obtener estadísticas del cache
   */
  async getCacheStats(): Promise<CacheStatsDto> {
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
      
      // Parsear información de memoria
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
    } catch (error) {
      this.logger.error('Error getting cache stats:', error);
      return {
        totalKeys: 0,
        memoryUsage: 0,
        connected: false,
      };
    }
  }

  /**
   * Listar todas las claves (con límite)
   */
  async listAllKeys(limit: number = 100): Promise<string[]> {
    return this.findKeysByPattern('*').then(keys => keys.slice(0, limit));
  }

  /**
   * Helper: formatear bytes a tamaño legible
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
