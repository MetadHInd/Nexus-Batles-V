import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/core/auth/guards/jwt-auth.guard';
import { CacheManagementService } from '../cache-management.service';
import { CacheAdminService } from '../services/cache-admin.service';
import {
  ClearModuleCacheDto,
  ClearCacheResponseDto,
  GetCacheKeysDto,
  CacheKeysResponseDto,
} from '../dtos/clear-cache.dto';
import {
  CacheKeyDto,
  CachePatternDto,
  SetCacheDto,
  ClearCachePatternDto,
  CacheStatsDto,
} from '../dtos/cache-key.dto';

/**
 * 🎛️ UNIFIED CACHE CONTROLLER
 * 
 * Controlador centralizado para gestión avanzada de cache Redis
 * Consolida funcionalidades de CacheManagementController y CacheAdminController
 * 
 * Soporta:
 * - ✅ Gestión por tenant
 * - ✅ Gestión por organization
 * - ✅ Gestión por team
 * - ✅ Búsqueda y filtrado avanzado
 * - ✅ Estadísticas en tiempo real
 * - ✅ Limpieza selectiva y masiva
 * 
 * @since 2026-01-12
 * @version 2.0
 */
@ApiTags('01 - Cache Management')
@Controller('api/cache')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UnifiedCacheController {
  constructor(
    private readonly cacheManagementService: CacheManagementService,
    private readonly cacheAdminService: CacheAdminService,
  ) {}

  // ============================================================
  // 📊 DASHBOARD & MONITORING
  // ============================================================

  @Get('dashboard')
  @ApiOperation({
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
  })
  @ApiResponse({
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
  })
  async getDashboard(): Promise<any> {
    const [cacheStats, adminStats, modules] = await Promise.all([
      this.cacheManagementService.getCacheStats(),
      this.cacheAdminService.getCacheStats(),
      this.cacheManagementService.getAvailableModules(),
    ]);

    // Extraer listas únicas
    const tenants = Object.keys(cacheStats.byTenant || {}).sort();
    
    // Analizar claves para extraer organizations y teams
    const allKeys = await this.cacheAdminService.listAllKeys(10000);
    const organizations = new Set<string>();
    const teams = new Set<string>();

    allKeys.forEach((key) => {
      // Formato: tenant:module:action o tenant:org:team:module:action
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

  @Get('stats')
  @ApiOperation({
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
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
    type: CacheStatsDto,
  })
  async getStats(): Promise<CacheStatsDto> {
    return this.cacheAdminService.getCacheStats();
  }

  // ============================================================
  // 🔍 SEARCH & INSPECT
  // ============================================================

  @Get('keys')
  @ApiOperation({
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
  })
  @ApiQuery({ name: 'pattern', required: false, description: 'Pattern de Redis (wildcards: *)' })
  @ApiQuery({ name: 'tenantId', required: false, description: 'UUID del tenant' })
  @ApiQuery({ name: 'organizationId', required: false, description: 'UUID de la organización' })
  @ApiQuery({ name: 'teamId', required: false, description: 'UUID del equipo' })
  @ApiQuery({ name: 'module', required: false, description: 'Nombre del módulo' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de resultados' })
  @ApiResponse({
    status: 200,
    description: 'Claves encontradas exitosamente',
    type: CacheKeysResponseDto,
  })
  async searchKeys(
    @Query('pattern') pattern?: string,
    @Query('tenantId') tenantId?: string,
    @Query('organizationId') organizationId?: string,
    @Query('teamId') teamId?: string,
    @Query('module') module?: string,
    @Query('limit') limit?: number,
  ): Promise<CacheKeysResponseDto> {
    // Construir pattern combinado
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

  @Get('get/:key')
  @ApiOperation({
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
  })
  @ApiParam({ name: 'key', description: 'Clave completa del cache' })
  @ApiResponse({
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
  })
  async getCacheValue(@Param('key') key: string): Promise<any> {
    return this.cacheAdminService.getCacheValue(key);
  }

  // ============================================================
  // 🧹 CLEAR OPERATIONS
  // ============================================================

  @Post('clear')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
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
  })
  @ApiBody({
    type: ClearModuleCacheDto,
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
  })
  @ApiResponse({
    status: 200,
    description: '✅ Cache limpiado exitosamente',
    type: ClearCacheResponseDto,
  })
  async clearCache(@Body() dto: ClearModuleCacheDto): Promise<ClearCacheResponseDto> {
    return this.cacheManagementService.clearCache(dto);
  }

  @Delete('tenant/:tenantId')
  @ApiOperation({
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
  })
  @ApiParam({ name: 'tenantId', description: 'UUID del tenant' })
  @ApiResponse({ status: 200, description: 'Tenant limpiado exitosamente' })
  async clearTenant(@Param('tenantId') tenantId: string): Promise<ClearCacheResponseDto> {
    return this.cacheManagementService.clearCache({ tenantId });
  }

  @Delete('organization/:organizationId')
  @ApiOperation({
    summary: '🏛️ Limpiar Todo el Cache de una Organization',
    description: `
    ## 🏛️ Limpieza por Organization
    
    Elimina TODAS las claves asociadas a una organización.
    
    ### ⚠️ Precaución:
    - Limpia cache de todos los teams de la org
    - Limpia cache de todos los módulos de la org
    - Acción irreversible
    `,
  })
  @ApiParam({ name: 'organizationId', description: 'UUID de la organización' })
  @ApiResponse({ status: 200, description: 'Organization limpiada exitosamente' })
  async clearOrganization(
    @Param('organizationId') organizationId: string,
  ): Promise<ClearCacheResponseDto> {
    const pattern = `*:org:${organizationId}:*`;
    const result = await this.cacheAdminService.deleteByPattern(pattern);
    return {
      success: result.success,
      message: `Organization ${organizationId} cache cleared`,
      keysDeleted: result.deletedCount,
    };
  }

  @Delete('team/:teamId')
  @ApiOperation({
    summary: '👥 Limpiar Todo el Cache de un Team',
    description: `
    ## 👥 Limpieza por Team
    
    Elimina TODAS las claves asociadas a un equipo.
    
    ### ⚠️ Precaución:
    - Limpia cache de todos los módulos del team
    - No afecta otros teams
    - Acción irreversible
    `,
  })
  @ApiParam({ name: 'teamId', description: 'UUID del equipo' })
  @ApiResponse({ status: 200, description: 'Team limpiado exitosamente' })
  async clearTeam(@Param('teamId') teamId: string): Promise<ClearCacheResponseDto> {
    const pattern = `*:team:${teamId}:*`;
    const result = await this.cacheAdminService.deleteByPattern(pattern);
    return {
      success: result.success,
      message: `Team ${teamId} cache cleared`,
      keysDeleted: result.deletedCount,
    };
  }

  @Delete('module/:module')
  @ApiOperation({
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
  })
  @ApiParam({
    name: 'module',
    description: 'Nombre del módulo (order, customer, menu, etc.)',
  })
  @ApiResponse({ status: 200, description: 'Módulo limpiado exitosamente' })
  async clearModule(@Param('module') module: string): Promise<ClearCacheResponseDto> {
    const pattern = `*:${module}:*`;
    const result = await this.cacheAdminService.deleteByPattern(pattern);
    return {
      success: result.success,
      message: `Module ${module} cache cleared globally`,
      keysDeleted: result.deletedCount,
    };
  }

  @Delete('key/:key')
  @ApiOperation({
    summary: '🔑 Eliminar una Clave Específica',
    description: `
    ## 🔑 Eliminación Precisa
    
    Elimina una clave específica del cache.
    
    ### ✅ Seguro:
    - Solo elimina la clave exacta
    - No afecta otras claves
    - Ideal para limpieza quirúrgica
    `,
  })
  @ApiParam({ name: 'key', description: 'Clave completa a eliminar' })
  @ApiResponse({ status: 200, description: 'Clave eliminada exitosamente' })
  async deleteCacheKey(@Param('key') key: string): Promise<any> {
    return this.cacheAdminService.deleteCacheKey(key);
  }

  @Delete('pattern/:pattern')
  @ApiOperation({
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
  })
  @ApiParam({ name: 'pattern', description: 'Pattern con wildcards (*)' })
  @ApiResponse({ status: 200, description: 'Claves eliminadas por pattern' })
  async deleteByPattern(@Param('pattern') pattern: string): Promise<any> {
    return this.cacheAdminService.deleteByPattern(pattern);
  }

  // ============================================================
  // ⚡ QUICK ACTIONS
  // ============================================================

  @Post('quick/clear-my-tenant')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
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
  })
  @ApiResponse({ status: 200, description: 'Mi tenant limpiado exitosamente' })
  async clearMyTenant(): Promise<ClearCacheResponseDto> {
    return this.cacheManagementService.clearCache({});
  }

  @Post('quick/clear-default-namespace')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '⚡ Acción Rápida: Limpiar Namespace "default"',
    description: `
    ## ⚡ Limpieza de Default
    
    Limpia el namespace "default" donde se guarda cache sin namespace específico.
    
    ### ✅ Común para:
    - Cache legacy
    - Datos sin tenant específico
    - Refresh general
    `,
  })
  @ApiResponse({ status: 200, description: 'Namespace default limpiado' })
  async clearDefaultNamespace(): Promise<ClearCacheResponseDto> {
    return this.cacheManagementService.clearCache({ modules: ['default'] });
  }

  // ============================================================
  // 🛠️ UTILITY OPERATIONS
  // ============================================================

  @Get('modules')
  @ApiOperation({
    summary: '📦 Listar Módulos Disponibles',
    description: `
    ## 📦 Módulos con Cache
    
    Obtiene lista de todos los módulos que tienen datos en cache.
    
    ### 💡 Útil para:
    - Ver qué módulos están usando cache
    - Seleccionar módulos para limpiar
    - Auditoría de uso de cache
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de módulos',
    schema: {
      example: ['order', 'customer', 'menu', 'item', 'branch', 'default'],
    },
  })
  async getModules(): Promise<string[]> {
    return this.cacheManagementService.getAvailableModules();
  }

  @Get('tenants')
  @ApiOperation({
    summary: '🏢 Listar Tenants con Cache',
    description: `
    ## 🏢 Tenants Activos
    
    Obtiene lista de todos los tenants que tienen datos en cache.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tenants',
    schema: {
      example: ['tenant-1', 'tenant-2', 'tenant-3'],
    },
  })
  async getTenants(): Promise<string[]> {
    const stats = await this.cacheManagementService.getCacheStats();
    return Object.keys(stats.byTenant || {}).sort();
  }

  @Get('organizations')
  @ApiOperation({
    summary: '🏛️ Listar Organizations con Cache',
    description: `
    ## 🏛️ Organizations Activas
    
    Obtiene lista de todas las organizaciones que tienen datos en cache.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de organizations',
    schema: {
      example: ['org-1', 'org-2'],
    },
  })
  async getOrganizations(): Promise<string[]> {
    const allKeys = await this.cacheAdminService.listAllKeys(10000);
    const organizations = new Set<string>();

    allKeys.forEach((key) => {
      const parts = key.split(':');
      if (parts.length >= 3 && parts[1] === 'org') {
        organizations.add(parts[2]);
      }
    });

    return Array.from(organizations).sort();
  }

  @Get('teams')
  @ApiOperation({
    summary: '👥 Listar Teams con Cache',
    description: `
    ## 👥 Teams Activos
    
    Obtiene lista de todos los equipos que tienen datos en cache.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de teams',
    schema: {
      example: ['team-alpha', 'team-beta', 'team-gamma'],
    },
  })
  async getTeams(): Promise<string[]> {
    const allKeys = await this.cacheAdminService.listAllKeys(10000);
    const teams = new Set<string>();

    allKeys.forEach((key) => {
      const parts = key.split(':');
      if (parts.length >= 5 && parts[3] === 'team') {
        teams.add(parts[4]);
      }
    });

    return Array.from(teams).sort();
  }

  @Post('set')
  @ApiOperation({
    summary: '💾 Establecer Valor en Cache',
    description: `
    ## 💾 Guardar en Cache
    
    Guarda un valor en cache con clave y TTL opcionales.
    
    ### 💡 Casos de uso:
    - Testing de cache
    - Pre-carga de datos
    - Cache manual
    `,
  })
  @ApiBody({ type: SetCacheDto })
  @ApiResponse({ status: 200, description: 'Valor guardado exitosamente' })
  async setCacheValue(@Body() dto: SetCacheDto): Promise<any> {
    return this.cacheAdminService.setCacheValue(dto);
  }

  // ============================================================
  // 🔧 HELPER METHODS
  // ============================================================

  /**
   * Analiza claves para extraer estadísticas por organization
   */
  private async analyzeByOrganization(keys: string[]): Promise<Record<string, number>> {
    const orgStats: Record<string, number> = {};

    keys.forEach((key) => {
      const parts = key.split(':');
      if (parts.length >= 3 && parts[1] === 'org') {
        const orgId = parts[2];
        orgStats[orgId] = (orgStats[orgId] || 0) + 1;
      }
    });

    return orgStats;
  }

  /**
   * Analiza claves para extraer estadísticas por team
   */
  private async analyzeByTeam(keys: string[]): Promise<Record<string, number>> {
    const teamStats: Record<string, number> = {};

    keys.forEach((key) => {
      const parts = key.split(':');
      if (parts.length >= 5 && parts[3] === 'team') {
        const teamId = parts[4];
        teamStats[teamId] = (teamStats[teamId] || 0) + 1;
      }
    });

    return teamStats;
  }
}
