import { Injectable, Logger } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import {
  ClearModuleCacheDto,
  ClearCacheResponseDto,
  GetCacheKeysDto,
  CacheKeysResponseDto,
} from './dtos/clear-cache.dto';

@Injectable()
export class CacheManagementService {
  private readonly logger = new Logger(CacheManagementService.name);

  constructor(private readonly cacheService: RedisCacheService) {}

  /**
   * Obtiene el tenant_id del contexto global
   */
  private getTenantId(): string | null {
    try {
      const request = (global as any).currentRequest;
      if (request?.selectedRestaurant?.database_connection) {
        return request.selectedRestaurant.database_connection;
      }
    } catch {
      // Ignorar errores
    }
    return null;
  }

  /**
   * Limpia el caché según los parámetros proporcionados
   */
  async clearCache(dto: ClearModuleCacheDto): Promise<ClearCacheResponseDto> {
    this.logger.log('🧹 Starting cache clearing operation');
    this.logger.log(`📋 Parameters: ${JSON.stringify(dto)}`);

    const tenantId = dto.tenantId || this.getTenantId() || 'global';
    let totalKeysDeleted = 0;
    const details: Record<string, number> = {};

    try {
      // Caso 1: Limpiar TODO el caché
      if (dto.clearAll) {
        this.logger.log('🔥 Clearing ALL cache');
        const allKeys = await this.cacheService.getKeys('*');
        if (allKeys.length > 0) {
          await this.cacheService.deletePattern('*');
          totalKeysDeleted = allKeys.length;
        }

        return {
          success: true,
          message: 'Todo el caché ha sido limpiado exitosamente',
          keysDeleted: totalKeysDeleted,
          tenantId,
        };
      }

      // Caso 2: Pattern personalizado
      if (dto.customPattern) {
        this.logger.log(`🎯 Using custom pattern: ${dto.customPattern}`);
        const keys = await this.cacheService.getKeys(dto.customPattern);
        if (keys.length > 0) {
          await this.cacheService.deletePattern(dto.customPattern);
          totalKeysDeleted = keys.length;
        }

        return {
          success: true,
          message: `Caché limpiado con pattern personalizado`,
          keysDeleted: totalKeysDeleted,
          tenantId,
        };
      }

      // Caso 3: Limpiar módulos específicos
      if (dto.modules && dto.modules.length > 0) {
        this.logger.log(`📦 Clearing cache for modules: ${dto.modules.join(', ')}`);

        for (const module of dto.modules) {
          // Construir pattern: tenant:module:*
          const pattern = `${tenantId}:${module}:*`;
          this.logger.log(`🔍 Searching pattern: ${pattern}`);

          const keys = await this.cacheService.getKeys(pattern);
          const keysCount = keys.length;

          if (keysCount > 0) {
            await this.cacheService.deletePattern(pattern);
            details[module] = keysCount;
            totalKeysDeleted += keysCount;
            this.logger.log(`✅ Deleted ${keysCount} keys for module: ${module}`);
          } else {
            details[module] = 0;
            this.logger.log(`ℹ️ No keys found for module: ${module}`);
          }
        }

        return {
          success: true,
          message: `Caché limpiado exitosamente para ${dto.modules.length} módulo(s)`,
          keysDeleted: totalKeysDeleted,
          details,
          tenantId,
        };
      }

      // Caso 4: Limpiar todo el caché del tenant actual
      this.logger.log(`🏢 Clearing all cache for tenant: ${tenantId}`);
      const pattern = `${tenantId}:*`;
      const keys = await this.cacheService.getKeys(pattern);
      if (keys.length > 0) {
        await this.cacheService.deletePattern(pattern);
        totalKeysDeleted = keys.length;
      }

      return {
        success: true,
        message: `Todo el caché del tenant ha sido limpiado`,
        keysDeleted: totalKeysDeleted,
        tenantId,
      };
    } catch (error) {
      this.logger.error(`❌ Error clearing cache: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Error al limpiar caché: ${error.message}`,
        keysDeleted: totalKeysDeleted,
        details,
        tenantId,
      };
    }
  }

  /**
   * Obtiene las claves del caché según el filtro proporcionado
   */
  async getCacheKeys(dto: GetCacheKeysDto): Promise<CacheKeysResponseDto> {
    this.logger.log('🔍 Getting cache keys');
    this.logger.log(`📋 Parameters: ${JSON.stringify(dto)}`);

    const tenantId = dto.tenantId || this.getTenantId() || 'global';

    try {
      let pattern = dto.pattern || '*';

      // Si se especifica un módulo, ajustar el pattern
      if (dto.module) {
        pattern = `${tenantId}:${dto.module}:*`;
      } else if (!dto.pattern) {
        // Si no hay pattern ni módulo, usar tenant:*
        pattern = `${tenantId}:*`;
      }

      this.logger.log(`🔍 Using pattern: ${pattern}`);

      const keys = await this.cacheService.getKeys(pattern);
      const totalKeys = keys.length;

      // Agrupar por módulo
      const groupedByModule: Record<string, number> = {};
      keys.forEach((key) => {
        // Formato: tenant:module:restOfKey
        const parts = key.split(':');
        if (parts.length >= 2) {
          const module = parts[1];
          groupedByModule[module] = (groupedByModule[module] || 0) + 1;
        }
      });

      this.logger.log(`✅ Found ${totalKeys} keys`);

      return {
        success: true,
        totalKeys,
        keys,
        groupedByModule,
      };
    } catch (error) {
      this.logger.error(`❌ Error getting cache keys: ${error.message}`, error.stack);
      return {
        success: false,
        totalKeys: 0,
        keys: [],
      };
    }
  }

  /**
   * Obtiene estadísticas del caché
   */
  async getCacheStats(): Promise<any> {
    this.logger.log('📊 Getting cache statistics');

    try {
      const allKeys = await this.cacheService.getKeys('*');
      const tenantId = this.getTenantId() || 'global';

      // Agrupar por tenant y módulo
      const byTenant: Record<string, number> = {};
      const byModule: Record<string, number> = {};
      const byTenantAndModule: Record<string, Record<string, number>> = {};

      allKeys.forEach((key) => {
        const parts = key.split(':');
        if (parts.length >= 2) {
          const tenant = parts[0];
          const module = parts[1];

          // Por tenant
          byTenant[tenant] = (byTenant[tenant] || 0) + 1;

          // Por módulo
          byModule[module] = (byModule[module] || 0) + 1;

          // Por tenant y módulo
          if (!byTenantAndModule[tenant]) {
            byTenantAndModule[tenant] = {};
          }
          byTenantAndModule[tenant][module] =
            (byTenantAndModule[tenant][module] || 0) + 1;
        }
      });

      return {
        success: true,
        totalKeys: allKeys.length,
        currentTenant: tenantId,
        byTenant,
        byModule,
        byTenantAndModule,
      };
    } catch (error) {
      this.logger.error(`❌ Error getting cache stats: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Error al obtener estadísticas: ${error.message}`,
      };
    }
  }

  /**
   * Lista todos los módulos disponibles en el caché
   */
  async getAvailableModules(): Promise<string[]> {
    this.logger.log('📦 Getting available modules');

    try {
      const allKeys = await this.cacheService.getKeys('*');
      const modules = new Set<string>();

      allKeys.forEach((key) => {
        const parts = key.split(':');
        if (parts.length >= 2) {
          modules.add(parts[1]);
        }
      });

      const moduleList = Array.from(modules).sort();
      this.logger.log(`✅ Found ${moduleList.length} modules`);

      return moduleList;
    } catch (error) {
      this.logger.error(`❌ Error getting modules: ${error.message}`, error.stack);
      return [];
    }
  }

  /**
   * Obtiene el valor de una clave específica del caché
   */
  async getCacheValue(key: string): Promise<any> {
    this.logger.log(`🔍 Getting cache value for key: ${key}`);

    try {
      if (!this.cacheService.redis) {
        return {
          success: false,
          message: 'Redis no está disponible',
          key,
        };
      }

      const value = await this.cacheService.redis.get(key);
      
      if (!value) {
        return {
          success: false,
          message: 'Clave no encontrada',
          key,
        };
      }

      // Intentar parsear como JSON
      let parsedValue;
      try {
        parsedValue = JSON.parse(value);
      } catch {
        parsedValue = value; // Si no es JSON, devolver el valor raw
      }

      // Obtener TTL
      const ttl = await this.cacheService.redis.ttl(key);

      return {
        success: true,
        key,
        value: parsedValue,
        rawValue: value,
        ttl: ttl === -1 ? 'Sin expiración' : ttl === -2 ? 'Clave no existe' : `${ttl}s`,
        size: Buffer.byteLength(value, 'utf8'),
      };
    } catch (error) {
      this.logger.error(`❌ Error getting cache value: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Error: ${error.message}`,
        key,
      };
    }
  }

  /**
   * Obtiene todas las claves con sus valores (limitado)
   */
  async getCacheKeysWithValues(pattern: string = '*', limit: number = 100): Promise<any> {
    this.logger.log(`🔍 Getting cache keys with values. Pattern: ${pattern}, Limit: ${limit}`);

    try {
      if (!this.cacheService.redis) {
        return {
          success: false,
          message: 'Redis no está disponible',
        };
      }

      const tenantId = this.getTenantId() || 'global';
      let searchPattern = pattern;

      // Si el pattern no incluye el tenant, agregarlo
      if (!pattern.includes(':')) {
        searchPattern = `${tenantId}:${pattern}`;
      }

      const keys = await this.cacheService.getKeys(searchPattern);
      const limitedKeys = keys.slice(0, limit);

      const keysWithValues = await Promise.all(
        limitedKeys.map(async (key) => {
          try {
            const value = await this.cacheService.redis!.get(key);
            const ttl = await this.cacheService.redis!.ttl(key);
            
            // Parsear el key para extraer información
            const parts = key.split(':');
            const tenant = parts[0] || 'unknown';
            const module = parts[1] || 'unknown';
            const keyName = parts.slice(2).join(':');

            let parsedValue;
            try {
              parsedValue = value ? JSON.parse(value) : null;
            } catch {
              parsedValue = value;
            }

            return {
              key,
              tenant,
              module,
              keyName,
              value: parsedValue,
              preview: value ? value.substring(0, 100) : null,
              ttl: ttl === -1 ? null : ttl === -2 ? 0 : ttl,
              size: value ? Buffer.byteLength(value, 'utf8') : 0,
            };
          } catch (error) {
            return {
              key,
              error: error.message,
            };
          }
        }),
      );

      return {
        success: true,
        total: keys.length,
        returned: limitedKeys.length,
        pattern: searchPattern,
        keys: keysWithValues,
      };
    } catch (error) {
      this.logger.error(`❌ Error getting cache keys with values: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Error: ${error.message}`,
      };
    }
  }
}
