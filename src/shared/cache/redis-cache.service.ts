/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

interface RedisCacheKey {
  key: string;
  params?: Record<string, any>;
  namespace?: string; // Opcional: permite override manual del namespace
}

@Injectable()
export class RedisCacheService {
  public readonly redis: Redis | null = null;
  private isConnected = false;
  private connectionError: Error | null = null;

  constructor() {
    try {
      // Configuración base de Redis
      const redisConfig: any = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        connectTimeout: 5000,
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: false,
        retryStrategy: (times) => {
          if (times > 3) {
            console.log(
              '⚠️ Redis connection failed after 3 attempts. Cache will be disabled.',
            );
            return null; // Stop retrying
          }
          const delay = Math.min(times * 50, 2000);
          console.log(`🔄 Retrying Redis connection... attempt ${times}`);
          return delay;
        },
      };

      // Agregar autenticación solo si está configurada (para producción)
      console.log('🔍 Debug Redis Config:', {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        hasPassword: !!process.env.REDIS_PASSWORD,
        hasUsername: !!process.env.REDIS_USERNAME,
      });
      
      if (process.env.REDIS_PASSWORD) {
        redisConfig.password = process.env.REDIS_PASSWORD;
        
        // Agregar username si está configurado (Redis 6+)
        if (process.env.REDIS_USERNAME) {
          redisConfig.username = process.env.REDIS_USERNAME;
        }
        
        console.log('🔐 Redis authentication enabled');
      } else {
        console.log(
          '🔓 Redis running without authentication (local development)',
        );
      }

      // Configuración adicional para producción
      if (process.env.NODE_ENV === 'production') {
        // TLS si está habilitado
        if (process.env.REDIS_TLS === 'true') {
          redisConfig.tls = {};
          console.log('🔒 Redis TLS enabled');
        }
      }

      this.redis = new Redis(redisConfig);

      this.redis.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isConnected = true;
        this.connectionError = null;
      });

      this.redis.on('error', (err) => {
        console.error('❌ Redis connection error:', err.message);
        this.connectionError = err;
        this.isConnected = false;
      });

      this.redis.on('close', () => {
        console.log('🔴 Redis connection closed');
        this.isConnected = false;
      });
    } catch (error) {
      console.error('❌ Failed to initialize Redis:', error);
      this.redis = null;
    }
  }

  private buildKey({ key, params = {}, namespace }: RedisCacheKey): string {
    // 🔒 OBTENER TENANT_ID AUTOMÁTICAMENTE del contexto global
    let tenantId: string | null = null;
    try {
      const request = (global as any).currentRequest;
      if (request?.selectedTenant?.database_connection) {
        tenantId = request.selectedTenant.database_connection;
      }
      // Fallback: buscar en headers directamente
      if (!tenantId && request?.headers?.['x-tenant-id']) {
        tenantId = request.headers['x-tenant-id'];
      }
    } catch {
      // Ignorar errores al obtener tenant_id
    }

    // Usar namespace proporcionado o default
    const currentNamespace = namespace || 'default';

    // Construir la key con el formato: tenant:namespace:key:param1=value1:param2=value2
    // Si no hay tenant_id, usar 'global' como fallback
    const tenantPrefix = tenantId || 'global';
    let result = `${tenantPrefix}:${currentNamespace}:${key.replace(/[^a-zA-Z0-9]/g, '')}`;

    // Agregar parámetros si existen
    for (const [paramKey, paramValue] of Object.entries(params)) {
      const cleanKey = paramKey.replace(/[^a-zA-Z0-9]/g, '');
      const cleanValue = String(paramValue).replace(/[^a-zA-Z0-9]/g, '');
      result += `:${cleanKey}=${cleanValue}`;
    }

    return result;
  }

  async set<T>(input: RedisCacheKey, value: T, ttl?: number): Promise<void> {
    if (!this.redis || !this.isConnected) {
      console.log('⚠️ Redis not available, skipping cache SET');
      return;
    }

    const endKey = this.buildKey(input);
    const serialized = JSON.stringify(value);
    try {
      ttl
        ? await this.redis.set(endKey, serialized, 'EX', ttl)
        : await this.redis.set(endKey, serialized);
    } catch (error) {
      console.error(`❌ Redis SET error for ${endKey}:`, error);
      // No lanzar error, solo loguear
    }
  }

  async get<T = unknown>(
    key: string,
    params: Record<string, any> = {},
  ): Promise<T | null> {
    if (!this.redis || !this.isConnected) {
      console.log('⚠️ Redis not available, returning null');
      return null;
    }

    const fullKey = this.buildKey({ key, params });
    try {
      const raw = await this.redis.get(fullKey);
      if (raw) {
        return JSON.parse(raw) as T;
      } else {
        return null;
      }
    } catch (error: unknown) {
      console.error(`❌ Error getting cache key ${fullKey}:`, error);
      return null;
    }
  }

  async update<T>(input: RedisCacheKey, value: T, ttl?: number): Promise<void> {
    if (!this.redis || !this.isConnected) {
      console.log('⚠️ Redis not available, skipping cache UPDATE');
      return;
    }

    const endKey = this.buildKey(input);
    try {
      const exists = await this.redis.exists(endKey);
      if (!exists) {
        console.log(`⚠️ Key ${endKey} does not exist, creating new`);
      }
      await this.set(input, value, ttl);
    } catch (error) {
      console.error(`❌ Redis UPDATE error for ${endKey}:`, error);
    }
  }

  async delete(key: string, params: Record<string, any> = {}): Promise<void> {
    if (!this.redis || !this.isConnected) {
      console.log('⚠️ Redis not available, skipping cache DELETE');
      return;
    }

    const endKey = this.buildKey({ key, params });
    try {
      await this.redis.del(endKey);
      // Deleted successfully
    } catch (error) {
      console.error(`❌ Redis DELETE error for ${endKey}:`, error);
    }
  }

  async clear(): Promise<void> {
    if (!this.redis || !this.isConnected) {
      console.log('⚠️ Redis not available, skipping cache CLEAR');
      return;
    }

    try {
      await this.redis.flushall();
      console.log('🧽 Redis cache cleared');
    } catch (error) {
      console.error('❌ Redis CLEAR error:', error);
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    if (!this.redis || !this.isConnected) {
      console.log('⚠️ Redis not available, skipping cache DELETE PATTERN');
      return;
    }

    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        console.log(
          `🧽 Deleted ${keys.length} keys matching pattern: ${pattern}`,
        );
      } else {
        console.log(`🔍 No keys found matching pattern: ${pattern}`);
      }
    } catch (error) {
      console.error(`❌ Redis DELETE PATTERN error for ${pattern}:`, error);
    }
  }

  async getKeys(pattern: string): Promise<string[]> {
    if (!this.redis || !this.isConnected) {
      console.log('⚠️ Redis not available, returning empty array');
      return [];
    }

    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      console.error(`❌ Redis GET KEYS error for ${pattern}:`, error);
      return [];
    }
  }
}
