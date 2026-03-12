import Redis from 'ioredis';
interface RedisCacheKey {
    key: string;
    params?: Record<string, any>;
    namespace?: string;
}
export declare class RedisCacheService {
    readonly redis: Redis | null;
    private isConnected;
    private connectionError;
    constructor();
    private buildKey;
    set<T>(input: RedisCacheKey, value: T, ttl?: number): Promise<void>;
    get<T = unknown>(key: string, params?: Record<string, any>): Promise<T | null>;
    update<T>(input: RedisCacheKey, value: T, ttl?: number): Promise<void>;
    delete(key: string, params?: Record<string, any>): Promise<void>;
    clear(): Promise<void>;
    deletePattern(pattern: string): Promise<void>;
    getKeys(pattern: string): Promise<string[]>;
}
export {};
