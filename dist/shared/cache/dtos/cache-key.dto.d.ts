export declare class CacheKeyDto {
    key: string;
}
export declare class CachePatternDto {
    pattern: string;
}
export declare class SetCacheDto {
    key: string;
    value: any;
    ttl?: number;
}
export declare class ClearCachePatternDto {
    pattern?: string;
    paginationOnly?: boolean;
}
export declare class CacheStatsDto {
    totalKeys: number;
    memoryUsage: number;
    connected: boolean;
    serverInfo?: any;
}
