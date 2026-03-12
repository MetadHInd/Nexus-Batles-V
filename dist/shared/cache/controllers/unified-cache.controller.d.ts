import { CacheManagementService } from '../cache-management.service';
import { CacheAdminService } from '../services/cache-admin.service';
import { ClearModuleCacheDto, ClearCacheResponseDto, CacheKeysResponseDto } from '../dtos/clear-cache.dto';
import { SetCacheDto, CacheStatsDto } from '../dtos/cache-key.dto';
export declare class UnifiedCacheController {
    private readonly cacheManagementService;
    private readonly cacheAdminService;
    constructor(cacheManagementService: CacheManagementService, cacheAdminService: CacheAdminService);
    getDashboard(): Promise<any>;
    getStats(): Promise<CacheStatsDto>;
    searchKeys(pattern?: string, tenantId?: string, organizationId?: string, teamId?: string, module?: string, limit?: number): Promise<CacheKeysResponseDto>;
    getCacheValue(key: string): Promise<any>;
    clearCache(dto: ClearModuleCacheDto): Promise<ClearCacheResponseDto>;
    clearTenant(tenantId: string): Promise<ClearCacheResponseDto>;
    clearOrganization(organizationId: string): Promise<ClearCacheResponseDto>;
    clearTeam(teamId: string): Promise<ClearCacheResponseDto>;
    clearModule(module: string): Promise<ClearCacheResponseDto>;
    deleteCacheKey(key: string): Promise<any>;
    deleteByPattern(pattern: string): Promise<any>;
    clearMyTenant(): Promise<ClearCacheResponseDto>;
    clearDefaultNamespace(): Promise<ClearCacheResponseDto>;
    getModules(): Promise<string[]>;
    getTenants(): Promise<string[]>;
    getOrganizations(): Promise<string[]>;
    getTeams(): Promise<string[]>;
    setCacheValue(dto: SetCacheDto): Promise<any>;
    private analyzeByOrganization;
    private analyzeByTeam;
}
