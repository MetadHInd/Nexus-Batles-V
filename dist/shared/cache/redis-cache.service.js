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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
let RedisCacheService = class RedisCacheService {
    redis = null;
    isConnected = false;
    connectionError = null;
    constructor() {
        try {
            const redisConfig = {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                connectTimeout: 5000,
                maxRetriesPerRequest: 3,
                enableReadyCheck: true,
                lazyConnect: false,
                retryStrategy: (times) => {
                    if (times > 3) {
                        console.log('⚠️ Redis connection failed after 3 attempts. Cache will be disabled.');
                        return null;
                    }
                    const delay = Math.min(times * 50, 2000);
                    console.log(`🔄 Retrying Redis connection... attempt ${times}`);
                    return delay;
                },
            };
            console.log('🔍 Debug Redis Config:', {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                hasPassword: !!process.env.REDIS_PASSWORD,
                hasUsername: !!process.env.REDIS_USERNAME,
            });
            if (process.env.REDIS_PASSWORD) {
                redisConfig.password = process.env.REDIS_PASSWORD;
                if (process.env.REDIS_USERNAME) {
                    redisConfig.username = process.env.REDIS_USERNAME;
                }
                console.log('🔐 Redis authentication enabled');
            }
            else {
                console.log('🔓 Redis running without authentication (local development)');
            }
            if (process.env.NODE_ENV === 'production') {
                if (process.env.REDIS_TLS === 'true') {
                    redisConfig.tls = {};
                    console.log('🔒 Redis TLS enabled');
                }
            }
            this.redis = new ioredis_1.default(redisConfig);
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
        }
        catch (error) {
            console.error('❌ Failed to initialize Redis:', error);
            this.redis = null;
        }
    }
    buildKey({ key, params = {}, namespace }) {
        let tenantId = null;
        try {
            const request = global.currentRequest;
            if (request?.selectedTenant?.database_connection) {
                tenantId = request.selectedTenant.database_connection;
            }
            if (!tenantId && request?.headers?.['x-tenant-id']) {
                tenantId = request.headers['x-tenant-id'];
            }
        }
        catch {
        }
        const currentNamespace = namespace || 'default';
        const tenantPrefix = tenantId || 'global';
        let result = `${tenantPrefix}:${currentNamespace}:${key.replace(/[^a-zA-Z0-9]/g, '')}`;
        for (const [paramKey, paramValue] of Object.entries(params)) {
            const cleanKey = paramKey.replace(/[^a-zA-Z0-9]/g, '');
            const cleanValue = String(paramValue).replace(/[^a-zA-Z0-9]/g, '');
            result += `:${cleanKey}=${cleanValue}`;
        }
        return result;
    }
    async set(input, value, ttl) {
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
        }
        catch (error) {
            console.error(`❌ Redis SET error for ${endKey}:`, error);
        }
    }
    async get(key, params = {}) {
        if (!this.redis || !this.isConnected) {
            console.log('⚠️ Redis not available, returning null');
            return null;
        }
        const fullKey = this.buildKey({ key, params });
        try {
            const raw = await this.redis.get(fullKey);
            if (raw) {
                return JSON.parse(raw);
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error(`❌ Error getting cache key ${fullKey}:`, error);
            return null;
        }
    }
    async update(input, value, ttl) {
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
        }
        catch (error) {
            console.error(`❌ Redis UPDATE error for ${endKey}:`, error);
        }
    }
    async delete(key, params = {}) {
        if (!this.redis || !this.isConnected) {
            console.log('⚠️ Redis not available, skipping cache DELETE');
            return;
        }
        const endKey = this.buildKey({ key, params });
        try {
            await this.redis.del(endKey);
        }
        catch (error) {
            console.error(`❌ Redis DELETE error for ${endKey}:`, error);
        }
    }
    async clear() {
        if (!this.redis || !this.isConnected) {
            console.log('⚠️ Redis not available, skipping cache CLEAR');
            return;
        }
        try {
            await this.redis.flushall();
            console.log('🧽 Redis cache cleared');
        }
        catch (error) {
            console.error('❌ Redis CLEAR error:', error);
        }
    }
    async deletePattern(pattern) {
        if (!this.redis || !this.isConnected) {
            console.log('⚠️ Redis not available, skipping cache DELETE PATTERN');
            return;
        }
        try {
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                await this.redis.del(...keys);
                console.log(`🧽 Deleted ${keys.length} keys matching pattern: ${pattern}`);
            }
            else {
                console.log(`🔍 No keys found matching pattern: ${pattern}`);
            }
        }
        catch (error) {
            console.error(`❌ Redis DELETE PATTERN error for ${pattern}:`, error);
        }
    }
    async getKeys(pattern) {
        if (!this.redis || !this.isConnected) {
            console.log('⚠️ Redis not available, returning empty array');
            return [];
        }
        try {
            return await this.redis.keys(pattern);
        }
        catch (error) {
            console.error(`❌ Redis GET KEYS error for ${pattern}:`, error);
            return [];
        }
    }
};
exports.RedisCacheService = RedisCacheService;
exports.RedisCacheService = RedisCacheService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RedisCacheService);
//# sourceMappingURL=redis-cache.service.js.map