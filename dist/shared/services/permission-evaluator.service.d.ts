import { RedisCacheService } from '../cache/redis-cache.service';
export declare class PermissionEvaluatorService {
    private readonly cache;
    private readonly logger;
    private readonly CACHE_TTL;
    constructor(cache: RedisCacheService);
    hasPermission(userId: number, moduleCode: string, actionCode: string, scope?: string): Promise<boolean>;
    getUserEffectivePermissions(userId: number): Promise<any[]>;
    hasAnyPermission(userId: number, permissionCodes: string[]): Promise<boolean>;
    hasAllPermissions(userId: number, permissionCodes: string[]): Promise<boolean>;
    checkOwnership(userId: number, resourceType: string, resourceId: number): Promise<boolean>;
    clearUserPermissionsCache(userId: number): Promise<void>;
    isAdmin(userId: number): Promise<boolean>;
}
