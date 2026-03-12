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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedCacheController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../core/auth/guards/jwt-auth.guard");
const cache_management_service_1 = require("../cache-management.service");
const cache_admin_service_1 = require("../services/cache-admin.service");
const clear_cache_dto_1 = require("../dtos/clear-cache.dto");
const cache_key_dto_1 = require("../dtos/cache-key.dto");
let UnifiedCacheController = class UnifiedCacheController {
    cacheManagementService;
    cacheAdminService;
    constructor(cacheManagementService, cacheAdminService) {
        this.cacheManagementService = cacheManagementService;
        this.cacheAdminService = cacheAdminService;
    }
    async getDashboard() {
        const [cacheStats, adminStats, modules] = await Promise.all([
            this.cacheManagementService.getCacheStats(),
            this.cacheAdminService.getCacheStats(),
            this.cacheManagementService.getAvailableModules(),
        ]);
        const tenants = Object.keys(cacheStats.byTenant || {}).sort();
        const allKeys = await this.cacheAdminService.listAllKeys(10000);
        const organizations = new Set();
        const teams = new Set();
        allKeys.forEach((key) => {
            const parts = key.split(':');
            if (parts.length >= 3 && parts[1] === 'org') {
                organizations.add(parts[2]);
            }
            if (parts.length >= 5 && parts[3] === 'team') {
                teams.add(parts[4]);
            }
        });
        return {
            memory: {
                used: `${Math.round(adminStats.memoryUsage / 1024 / 1024)}MB`,
                connected: adminStats.connected,
            },
            stats: {
                totalKeys: cacheStats.totalKeys,
                currentTenant: cacheStats.currentTenant,
                byTenant: cacheStats.byTenant,
                byOrganization: await this.analyzeByOrganization(allKeys),
                byTeam: await this.analyzeByTeam(allKeys),
                byModule: cacheStats.byModule,
            },
            modules: modules.sort(),
            tenants: tenants,
            organizations: Array.from(organizations).sort(),
            teams: Array.from(teams).sort(),
            timestamp: new Date().toISOString(),
        };
    }
    async getStats() {
        return this.cacheAdminService.getCacheStats();
    }
    async searchKeys(pattern, tenantId, organizationId, teamId, module, limit) {
        let finalPattern = pattern;
        if (tenantId) {
            finalPattern = `${tenantId}:${finalPattern || '*'}`;
        }
        if (organizationId) {
            finalPattern = finalPattern
                ? finalPattern.replace('*', `org:${organizationId}:*`)
                : `*:org:${organizationId}:*`;
        }
        if (teamId) {
            finalPattern = finalPattern
                ? finalPattern.replace('*', `team:${teamId}:*`)
                : `*:team:${teamId}:*`;
        }
        if (module) {
            finalPattern = finalPattern
                ? finalPattern.replace('*', `${module}:*`)
                : `*:${module}:*`;
        }
        return this.cacheManagementService.getCacheKeys({
            pattern: finalPattern,
            tenantId,
            module,
        });
    }
    async getCacheValue(key) {
        return this.cacheAdminService.getCacheValue(key);
    }
    async clearCache(dto) {
        return this.cacheManagementService.clearCache(dto);
    }
    async clearTenant(tenantId) {
        return this.cacheManagementService.clearCache({ tenantId });
    }
    async clearOrganization(organizationId) {
        const pattern = `*:org:${organizationId}:*`;
        const result = await this.cacheAdminService.deleteByPattern(pattern);
        return {
            success: result.success,
            message: `Organization ${organizationId} cache cleared`,
            keysDeleted: result.deletedCount,
        };
    }
    async clearTeam(teamId) {
        const pattern = `*:team:${teamId}:*`;
        const result = await this.cacheAdminService.deleteByPattern(pattern);
        return {
            success: result.success,
            message: `Team ${teamId} cache cleared`,
            keysDeleted: result.deletedCount,
        };
    }
    async clearModule(module) {
        const pattern = `*:${module}:*`;
        const result = await this.cacheAdminService.deleteByPattern(pattern);
        return {
            success: result.success,
            message: `Module ${module} cache cleared globally`,
            keysDeleted: result.deletedCount,
        };
    }
    async deleteCacheKey(key) {
        return this.cacheAdminService.deleteCacheKey(key);
    }
    async deleteByPattern(pattern) {
        return this.cacheAdminService.deleteByPattern(pattern);
    }
    async clearMyTenant() {
        return this.cacheManagementService.clearCache({});
    }
    async clearDefaultNamespace() {
        return this.cacheManagementService.clearCache({ modules: ['default'] });
    }
    async getModules() {
        return this.cacheManagementService.getAvailableModules();
    }
    async getTenants() {
        const stats = await this.cacheManagementService.getCacheStats();
        return Object.keys(stats.byTenant || {}).sort();
    }
    async getOrganizations() {
        const allKeys = await this.cacheAdminService.listAllKeys(10000);
        const organizations = new Set();
        allKeys.forEach((key) => {
            const parts = key.split(':');
            if (parts.length >= 3 && parts[1] === 'org') {
                organizations.add(parts[2]);
            }
        });
        return Array.from(organizations).sort();
    }
    async getTeams() {
        const allKeys = await this.cacheAdminService.listAllKeys(10000);
        const teams = new Set();
        allKeys.forEach((key) => {
            const parts = key.split(':');
            if (parts.length >= 5 && parts[3] === 'team') {
                teams.add(parts[4]);
            }
        });
        return Array.from(teams).sort();
    }
    async setCacheValue(dto) {
        return this.cacheAdminService.setCacheValue(dto);
    }
    async analyzeByOrganization(keys) {
        const orgStats = {};
        keys.forEach((key) => {
            const parts = key.split(':');
            if (parts.length >= 3 && parts[1] === 'org') {
                const orgId = parts[2];
                orgStats[orgId] = (orgStats[orgId] || 0) + 1;
            }
        });
        return orgStats;
    }
    async analyzeByTeam(keys) {
        const teamStats = {};
        keys.forEach((key) => {
            const parts = key.split(':');
            if (parts.length >= 5 && parts[3] === 'team') {
                const teamId = parts[4];
                teamStats[teamId] = (teamStats[teamId] || 0) + 1;
            }
        });
        return teamStats;
    }
};
exports.UnifiedCacheController = UnifiedCacheController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({
        summary: '📊 Dashboard Completo del Cache',
        description: `
    ## 🎯 Dashboard Principal de Cache
    
    Vista completa del estado del cache con estadísticas por:
    - 🏢 **Tenant**: Uso de cache por tenant
    - 🏛️ **Organization**: Uso por organización
    - 👥 **Team**: Uso por equipo
    - 📦 **Module**: Distribución por módulo (order, customer, menu, etc.)
    - 🔑 **Keys**: Total de claves en sistema
    
    ### 💡 Incluye:
    - Estadísticas generales (memoria, claves totales)
    - Distribución por tenant/org/team
    - Módulos más utilizados
    - Claves recientes
    - Recomendaciones de limpieza
    
    ⚡ No requiere parámetros
    `,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '✅ Dashboard obtenido exitosamente',
        schema: {
            example: {
                memory: { used: '45MB', peak: '67MB', fragmentation: 1.2 },
                stats: {
                    totalKeys: 158,
                    byTenant: { 'tenant-1': 45, 'tenant-2': 67, 'tenant-3': 46 },
                    byOrganization: { 'org-1': 78, 'org-2': 80 },
                    byTeam: { 'team-alpha': 34, 'team-beta': 56 },
                    byModule: { order: 45, customer: 23, menu: 18, default: 72 },
                },
                modules: ['order', 'customer', 'menu', 'item', 'branch'],
                tenants: ['tenant-1', 'tenant-2', 'tenant-3'],
                organizations: ['org-1', 'org-2'],
                teams: ['team-alpha', 'team-beta', 'team-gamma'],
                timestamp: '2026-01-12T14:30:00Z',
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({
        summary: '📊 Estadísticas Detalladas',
        description: `
    ## 📈 Estadísticas Completas del Cache
    
    Métricas detalladas incluyendo:
    - **Memory**: Uso de memoria Redis
    - **Keys**: Distribución por tenant/org/team/módulo
    - **Performance**: Ratio de fragmentación
    - **Info**: Versión de Redis, uptime
    
    ### 📊 Interpretación:
    - **byTenant**: Claves por tenant
    - **byOrganization**: Claves por organización
    - **byTeam**: Claves por equipo
    - **byModule**: Claves por módulo funcional
    `,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Estadísticas obtenidas exitosamente',
        type: cache_key_dto_1.CacheStatsDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('keys'),
    (0, swagger_1.ApiOperation)({
        summary: '🔍 Buscar Claves con Filtros Avanzados',
        description: `
    ## 🔍 Explorador de Claves
    
    Búsqueda avanzada con soporte para:
    
    ### 🎯 Filtros Disponibles:
    
    #### Por Tenant
    \`\`\`
    ?tenantId=tenant-uuid
    \`\`\`
    
    #### Por Organization
    \`\`\`
    ?organizationId=org-uuid
    \`\`\`
    
    #### Por Team
    \`\`\`
    ?teamId=team-uuid
    \`\`\`
    
    #### Por Módulo
    \`\`\`
    ?module=order
    ?module=customer
    ?module=menu
    \`\`\`
    
    #### Por Pattern Personalizado
    \`\`\`
    ?pattern=*:order:findAll*
    ?pattern=tenant-1:org:*
    ?pattern=*:team:team-alpha:*
    \`\`\`
    
    #### Combinaciones
    \`\`\`
    ?tenantId=tenant-1&module=order
    ?organizationId=org-1&module=customer
    ?teamId=team-alpha&pattern=*:findById:*
    \`\`\`
    
    ### 💡 Tips:
    - Sin parámetros = todas las claves de tu tenant
    - Usa filtros específicos para búsquedas rápidas
    - Combina filtros para mayor precisión
    `,
    }),
    (0, swagger_1.ApiQuery)({ name: 'pattern', required: false, description: 'Pattern de Redis (wildcards: *)' }),
    (0, swagger_1.ApiQuery)({ name: 'tenantId', required: false, description: 'UUID del tenant' }),
    (0, swagger_1.ApiQuery)({ name: 'organizationId', required: false, description: 'UUID de la organización' }),
    (0, swagger_1.ApiQuery)({ name: 'teamId', required: false, description: 'UUID del equipo' }),
    (0, swagger_1.ApiQuery)({ name: 'module', required: false, description: 'Nombre del módulo' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Límite de resultados' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Claves encontradas exitosamente',
        type: clear_cache_dto_1.CacheKeysResponseDto,
    }),
    __param(0, (0, common_1.Query)('pattern')),
    __param(1, (0, common_1.Query)('tenantId')),
    __param(2, (0, common_1.Query)('organizationId')),
    __param(3, (0, common_1.Query)('teamId')),
    __param(4, (0, common_1.Query)('module')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "searchKeys", null);
__decorate([
    (0, common_1.Get)('get/:key'),
    (0, swagger_1.ApiOperation)({
        summary: '🔎 Obtener Valor de una Clave',
        description: `
    ## 🔎 Inspector de Valores
    
    Obtiene el valor almacenado en una clave específica.
    
    ### 📋 Información Retornada:
    - **key**: Clave consultada
    - **value**: Valor almacenado (objeto JSON)
    - **exists**: Si la clave existe
    - **ttl**: Tiempo de vida restante (segundos)
    - **type**: Tipo de dato Redis
    
    ### 💡 Útil para:
    - Inspeccionar datos cacheados
    - Verificar valores antes de limpiar
    - Debugging de problemas de cache
    `,
    }),
    (0, swagger_1.ApiParam)({ name: 'key', description: 'Clave completa del cache' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Valor obtenido exitosamente',
        schema: {
            example: {
                key: 'tenant-1:order:findById:123',
                value: { id: 123, customer: 'John', total: 150.5 },
                exists: true,
                ttl: 285,
                type: 'string',
            },
        },
    }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "getCacheValue", null);
__decorate([
    (0, common_1.Post)('clear'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: '🧹 Limpiar Cache - Control Avanzado',
        description: `
    ## 🎛️ Panel de Control de Limpieza
    
    Endpoint principal para limpiar cache con máxima flexibilidad.
    
    ### 🎯 Modos de Operación:
    
    #### 1️⃣ Por Módulos (Recomendado)
    \`\`\`json
    {
      "modules": ["order", "customer"]
    }
    \`\`\`
    
    #### 2️⃣ Por Tenant
    \`\`\`json
    {
      "tenantId": "tenant-uuid",
      "modules": ["menu"]
    }
    \`\`\`
    
    #### 3️⃣ Por Organization
    \`\`\`json
    {
      "organizationId": "org-uuid"
    }
    \`\`\`
    
    #### 4️⃣ Por Team
    \`\`\`json
    {
      "teamId": "team-uuid"
    }
    \`\`\`
    
    #### 5️⃣ Pattern Personalizado
    \`\`\`json
    {
      "customPattern": "*:order:findAll*"
    }
    \`\`\`
    
    #### 6️⃣ Limpiar TODO (⚠️ PELIGROSO)
    \`\`\`json
    {
      "clearAll": true
    }
    \`\`\`
    
    ### 📊 Respuesta:
    - ✅ Confirmación de éxito
    - 📈 Número de claves eliminadas
    - 📋 Desglose por módulo/tenant/org/team
    `,
    }),
    (0, swagger_1.ApiBody)({
        type: clear_cache_dto_1.ClearModuleCacheDto,
        examples: {
            'Por módulos': {
                value: { modules: ['order', 'customer'] },
            },
            'Por tenant': {
                value: { tenantId: 'tenant-uuid', modules: ['menu'] },
            },
            'Por organization': {
                value: { organizationId: 'org-uuid' },
            },
            'Por team': {
                value: { teamId: 'team-uuid' },
            },
            'Pattern personalizado': {
                value: { customPattern: '*:findById:*' },
            },
            'PELIGRO - Todo': {
                value: { clearAll: true },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '✅ Cache limpiado exitosamente',
        type: clear_cache_dto_1.ClearCacheResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clear_cache_dto_1.ClearModuleCacheDto]),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "clearCache", null);
__decorate([
    (0, common_1.Delete)('tenant/:tenantId'),
    (0, swagger_1.ApiOperation)({
        summary: '🏢 Limpiar Todo el Cache de un Tenant',
        description: `
    ## 🏢 Limpieza por Tenant
    
    Elimina TODAS las claves asociadas a un tenant específico.
    
    ### ⚠️ Precaución:
    - Limpia todos los módulos del tenant
    - No afecta otros tenants
    - Acción irreversible
    
    ### 💡 Casos de uso:
    - Migración de datos
    - Cambio de estructura
    - Eliminación de tenant
    `,
    }),
    (0, swagger_1.ApiParam)({ name: 'tenantId', description: 'UUID del tenant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tenant limpiado exitosamente' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "clearTenant", null);
__decorate([
    (0, common_1.Delete)('organization/:organizationId'),
    (0, swagger_1.ApiOperation)({
        summary: '🏛️ Limpiar Todo el Cache de una Organization',
        description: `
    ## 🏛️ Limpieza por Organization
    
    Elimina TODAS las claves asociadas a una organización.
    
    ### ⚠️ Precaución:
    - Limpia cache de todos los teams de la org
    - Limpia cache de todos los módulos de la org
    - Acción irreversible
    `,
    }),
    (0, swagger_1.ApiParam)({ name: 'organizationId', description: 'UUID de la organización' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Organization limpiada exitosamente' }),
    __param(0, (0, common_1.Param)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "clearOrganization", null);
__decorate([
    (0, common_1.Delete)('team/:teamId'),
    (0, swagger_1.ApiOperation)({
        summary: '👥 Limpiar Todo el Cache de un Team',
        description: `
    ## 👥 Limpieza por Team
    
    Elimina TODAS las claves asociadas a un equipo.
    
    ### ⚠️ Precaución:
    - Limpia cache de todos los módulos del team
    - No afecta otros teams
    - Acción irreversible
    `,
    }),
    (0, swagger_1.ApiParam)({ name: 'teamId', description: 'UUID del equipo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team limpiado exitosamente' }),
    __param(0, (0, common_1.Param)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "clearTeam", null);
__decorate([
    (0, common_1.Delete)('module/:module'),
    (0, swagger_1.ApiOperation)({
        summary: '📦 Limpiar Cache de un Módulo (Todos los Tenants)',
        description: `
    ## 📦 Limpieza por Módulo
    
    Elimina todas las claves de un módulo específico en TODOS los tenants.
    
    ### ⚠️ PRECAUCIÓN MÁXIMA:
    - Afecta a TODOS los tenants
    - Limpia el módulo en todo el sistema
    - Usar solo en casos extremos
    
    ### 💡 Casos de uso:
    - Actualización global del módulo
    - Cambio de estructura de datos
    - Fix de bugs críticos
    `,
    }),
    (0, swagger_1.ApiParam)({
        name: 'module',
        description: 'Nombre del módulo (order, customer, menu, etc.)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Módulo limpiado exitosamente' }),
    __param(0, (0, common_1.Param)('module')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "clearModule", null);
__decorate([
    (0, common_1.Delete)('key/:key'),
    (0, swagger_1.ApiOperation)({
        summary: '🔑 Eliminar una Clave Específica',
        description: `
    ## 🔑 Eliminación Precisa
    
    Elimina una clave específica del cache.
    
    ### ✅ Seguro:
    - Solo elimina la clave exacta
    - No afecta otras claves
    - Ideal para limpieza quirúrgica
    `,
    }),
    (0, swagger_1.ApiParam)({ name: 'key', description: 'Clave completa a eliminar' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Clave eliminada exitosamente' }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "deleteCacheKey", null);
__decorate([
    (0, common_1.Delete)('pattern/:pattern'),
    (0, swagger_1.ApiOperation)({
        summary: '🎯 Eliminar por Pattern',
        description: `
    ## 🎯 Eliminación por Patrón
    
    Elimina todas las claves que coincidan con un patrón.
    
    ### 📝 Ejemplos:
    - \`user_*\` - Todas las claves de usuarios
    - \`*_paginated_*\` - Todas las paginaciones
    - \`tenant-1:order:*\` - Todas las órdenes del tenant-1
    - \`*:findAll*\` - Todos los findAll de cualquier módulo
    
    ### ⚠️ Precaución:
    - Puede afectar múltiples claves
    - Revisar pattern antes de ejecutar
    `,
    }),
    (0, swagger_1.ApiParam)({ name: 'pattern', description: 'Pattern con wildcards (*)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claves eliminadas por pattern' }),
    __param(0, (0, common_1.Param)('pattern')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "deleteByPattern", null);
__decorate([
    (0, common_1.Post)('quick/clear-my-tenant'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: '⚡ Acción Rápida: Limpiar Mi Tenant',
        description: `
    ## ⚡ Limpieza Rápida
    
    Limpia TODO el cache de tu tenant actual con un solo click.
    
    ### ✅ Qué hace:
    - Detecta tu tenant automáticamente
    - Limpia todas las claves de tu tenant
    - No afecta otros tenants
    - Seguro de usar
    
    🎯 Solo presiona "Execute"!
    `,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mi tenant limpiado exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "clearMyTenant", null);
__decorate([
    (0, common_1.Post)('quick/clear-default-namespace'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: '⚡ Acción Rápida: Limpiar Namespace "default"',
        description: `
    ## ⚡ Limpieza de Default
    
    Limpia el namespace "default" donde se guarda cache sin namespace específico.
    
    ### ✅ Común para:
    - Cache legacy
    - Datos sin tenant específico
    - Refresh general
    `,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Namespace default limpiado' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "clearDefaultNamespace", null);
__decorate([
    (0, common_1.Get)('modules'),
    (0, swagger_1.ApiOperation)({
        summary: '📦 Listar Módulos Disponibles',
        description: `
    ## 📦 Módulos con Cache
    
    Obtiene lista de todos los módulos que tienen datos en cache.
    
    ### 💡 Útil para:
    - Ver qué módulos están usando cache
    - Seleccionar módulos para limpiar
    - Auditoría de uso de cache
    `,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de módulos',
        schema: {
            example: ['order', 'customer', 'menu', 'item', 'branch', 'default'],
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "getModules", null);
__decorate([
    (0, common_1.Get)('tenants'),
    (0, swagger_1.ApiOperation)({
        summary: '🏢 Listar Tenants con Cache',
        description: `
    ## 🏢 Tenants Activos
    
    Obtiene lista de todos los tenants que tienen datos en cache.
    `,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de tenants',
        schema: {
            example: ['tenant-1', 'tenant-2', 'tenant-3'],
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "getTenants", null);
__decorate([
    (0, common_1.Get)('organizations'),
    (0, swagger_1.ApiOperation)({
        summary: '🏛️ Listar Organizations con Cache',
        description: `
    ## 🏛️ Organizations Activas
    
    Obtiene lista de todas las organizaciones que tienen datos en cache.
    `,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de organizations',
        schema: {
            example: ['org-1', 'org-2'],
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "getOrganizations", null);
__decorate([
    (0, common_1.Get)('teams'),
    (0, swagger_1.ApiOperation)({
        summary: '👥 Listar Teams con Cache',
        description: `
    ## 👥 Teams Activos
    
    Obtiene lista de todos los equipos que tienen datos en cache.
    `,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de teams',
        schema: {
            example: ['team-alpha', 'team-beta', 'team-gamma'],
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "getTeams", null);
__decorate([
    (0, common_1.Post)('set'),
    (0, swagger_1.ApiOperation)({
        summary: '💾 Establecer Valor en Cache',
        description: `
    ## 💾 Guardar en Cache
    
    Guarda un valor en cache con clave y TTL opcionales.
    
    ### 💡 Casos de uso:
    - Testing de cache
    - Pre-carga de datos
    - Cache manual
    `,
    }),
    (0, swagger_1.ApiBody)({ type: cache_key_dto_1.SetCacheDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Valor guardado exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cache_key_dto_1.SetCacheDto]),
    __metadata("design:returntype", Promise)
], UnifiedCacheController.prototype, "setCacheValue", null);
exports.UnifiedCacheController = UnifiedCacheController = __decorate([
    (0, swagger_1.ApiTags)('01 - Cache Management'),
    (0, common_1.Controller)('api/cache'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [cache_management_service_1.CacheManagementService,
        cache_admin_service_1.CacheAdminService])
], UnifiedCacheController);
//# sourceMappingURL=unified-cache.controller.js.map