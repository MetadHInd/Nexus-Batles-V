import { RedisCacheService } from '../../../cache/redis-cache.service';
export declare class AuthCacheService {
    private readonly cacheService;
    private readonly logger;
    constructor(cacheService: RedisCacheService);
    invalidateOnRoleUpdate(userId: number, newRoleId: number): Promise<void>;
    invalidateOnBranchAssignment(userId: number, branchId: number, isManager: boolean): Promise<void>;
    invalidateOnBranchRemoval(userId: number, branchId: number): Promise<void>;
    invalidateOnStatusUpdate(userId: number, newStatusId: number): Promise<void>;
    invalidateOnBranchUpdate(branchId: number): Promise<void>;
    refreshUserProfile(userId: number): Promise<void>;
    isUserInCache(userId: number): Promise<boolean>;
    getCacheStats(): Promise<{
        totalCachedUsers: number;
        cacheHitRate: number;
    }>;
}
