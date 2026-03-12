"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CacheManagementService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManagementService = void 0;
const common_1 = require("@nestjs/common");
const redis_cache_service_1 = require("./redis-cache.service");
let CacheManagementService = CacheManagementService_1 = class CacheManagementService {
    cacheService;
    logger = new common_1.Logger(CacheManagementService_1.name);
    constructor(cacheService) {
        this.cacheService = cacheService;
    }
    getTenantId() {
        try {
            const request = global.currentRequest;
            if (request?.selectedRestaurant?.database_connection) {
                return request.selectedRestaurant.database_connection;
            }
        }
        catch {
        }
        return null;
    }
    async clearCache(dto) {
        this.logger.log('🧹 Starting cache clearing operation');
        this.logger.log(`📋 Parameters: ${JSON.stringify(dto)}`);
        const tenantId = dto.tenantId || this.getTenantId() || 'global';
        let totalKeysDeleted = 0;
        const details = {};
        try {
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
            if (dto.modules && dto.modules.length > 0) {
                this.logger.log(`📦 Clearing cache for modules: ${dto.modules.join(', ')}`);
                for (const module of dto.modules) {
                    const pattern = `${tenantId}:${module}:*`;
                    this.logger.log(`🔍 Searching pattern: ${pattern}`);
                    const keys = await this.cacheService.getKeys(pattern);
                    const keysCount = keys.length;
                    if (keysCount > 0) {
                        await this.cacheService.deletePattern(pattern);
                        details[module] = keysCount;
                        totalKeysDeleted += keysCount;
                        this.logger.log(`✅ Deleted ${keysCount} keys for module: ${module}`);
                    }
                    else {
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
        }
        catch (error) {
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
    async getCacheKeys(dto) {
        this.logger.log('🔍 Getting cache keys');
        this.logger.log(`📋 Parameters: ${JSON.stringify(dto)}`);
        const tenantId = dto.tenantId || this.getTenantId() || 'global';
        try {
            let pattern = dto.pattern || '*';
            if (dto.module) {
                pattern = `${tenantId}:${dto.module}:*`;
            }
            else if (!dto.pattern) {
                pattern = `${tenantId}:*`;
            }
            this.logger.log(`🔍 Using pattern: ${pattern}`);
            const keys = await this.cacheService.getKeys(pattern);
            const totalKeys = keys.length;
            const groupedByModule = {};
            keys.forEach((key) => {
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
        }
        catch (error) {
            this.logger.error(`❌ Error getting cache keys: ${error.message}`, error.stack);
            return {
                success: false,
                totalKeys: 0,
                keys: [],
            };
        }
    }
    async getCacheStats() {
        this.logger.log('📊 Getting cache statistics');
        try {
            const allKeys = await this.cacheService.getKeys('*');
            const tenantId = this.getTenantId() || 'global';
            const byTenant = {};
            const byModule = {};
            const byTenantAndModule = {};
            allKeys.forEach((key) => {
                const parts = key.split(':');
                if (parts.length >= 2) {
                    const tenant = parts[0];
                    const module = parts[1];
                    byTenant[tenant] = (byTenant[tenant] || 0) + 1;
                    byModule[module] = (byModule[module] || 0) + 1;
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
        }
        catch (error) {
            this.logger.error(`❌ Error getting cache stats: ${error.message}`, error.stack);
            return {
                success: false,
                message: `Error al obtener estadísticas: ${error.message}`,
            };
        }
    }
    async getAvailableModules() {
        this.logger.log('📦 Getting available modules');
        try {
            const allKeys = await this.cacheService.getKeys('*');
            const modules = new Set();
            allKeys.forEach((key) => {
                const parts = key.split(':');
                if (parts.length >= 2) {
                    modules.add(parts[1]);
                }
            });
            const moduleList = Array.from(modules).sort();
            this.logger.log(`✅ Found ${moduleList.length} modules`);
            return moduleList;
        }
        catch (error) {
            this.logger.error(`❌ Error getting modules: ${error.message}`, error.stack);
            return [];
        }
    }
    async getCacheValue(key) {
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
            let parsedValue;
            try {
                parsedValue = JSON.parse(value);
            }
            catch {
                parsedValue = value;
            }
            const ttl = await this.cacheService.redis.ttl(key);
            return {
                success: true,
                key,
                value: parsedValue,
                rawValue: value,
                ttl: ttl === -1 ? 'Sin expiración' : ttl === -2 ? 'Clave no existe' : `${ttl}s`,
                size: Buffer.byteLength(value, 'utf8'),
            };
        }
        catch (error) {
            this.logger.error(`❌ Error getting cache value: ${error.message}`, error.stack);
            return {
                success: false,
                message: `Error: ${error.message}`,
                key,
            };
        }
    }
    async getCacheKeysWithValues(pattern = '*', limit = 100) {
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
            if (!pattern.includes(':')) {
                searchPattern = `${tenantId}:${pattern}`;
            }
            const keys = await this.cacheService.getKeys(searchPattern);
            const limitedKeys = keys.slice(0, limit);
            const keysWithValues = await Promise.all(limitedKeys.map(async (key) => {
                try {
                    const value = await this.cacheService.redis.get(key);
                    const ttl = await this.cacheService.redis.ttl(key);
                    const parts = key.split(':');
                    const tenant = parts[0] || 'unknown';
                    const module = parts[1] || 'unknown';
                    const keyName = parts.slice(2).join(':');
                    let parsedValue;
                    try {
                        parsedValue = value ? JSON.parse(value) : null;
                    }
                    catch {
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
                }
                catch (error) {
                    return {
                        key,
                        error: error.message,
                    };
                }
            }));
            return {
                success: true,
                total: keys.length,
                returned: limitedKeys.length,
                pattern: searchPattern,
                keys: keysWithValues,
            };
        }
        catch (error) {
            this.logger.error(`❌ Error getting cache keys with values: ${error.message}`, error.stack);
            return {
                success: false,
                message: `Error: ${error.message}`,
            };
        }
    }
};
exports.CacheManagementService = CacheManagementService;
exports.CacheManagementService = CacheManagementService = CacheManagementService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_cache_service_1.RedisCacheService])
], CacheManagementService);
//# sourceMappingURL=cache-management.service.js.map