export declare class ClearModuleCacheDto {
    modules?: string[];
    tenantId?: string;
    clearAll?: boolean;
    customPattern?: string;
}
export declare class ClearCacheResponseDto {
    success: boolean;
    message: string;
    keysDeleted: number;
    details?: Record<string, number>;
    tenantId?: string;
}
export declare class GetCacheKeysDto {
    pattern?: string;
    tenantId?: string;
    module?: string;
}
export declare class CacheKeysResponseDto {
    success: boolean;
    totalKeys: number;
    keys: string[];
    groupedByModule?: Record<string, number>;
}
