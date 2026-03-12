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
var AuthCacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCacheService = void 0;
const common_1 = require("@nestjs/common");
const redis_cache_service_1 = require("../../../cache/redis-cache.service");
let AuthCacheService = AuthCacheService_1 = class AuthCacheService {
    cacheService;
    logger = new common_1.Logger(AuthCacheService_1.name);
    constructor(cacheService) {
        this.cacheService = cacheService;
    }
    async invalidateOnRoleUpdate(userId, newRoleId) {
        try {
            await this.cacheService.delete(`user:${userId}`);
            await this.cacheService.delete(`user:profile:${userId}`);
            this.logger.log(`Caché invalidado para usuario ${userId} por cambio de rol a ${newRoleId}`);
        }
        catch (error) {
            this.logger.error(`Error al invalidar caché por cambio de rol: ${error.message}`);
        }
    }
    async invalidateOnBranchAssignment(userId, branchId, isManager) {
        try {
            await this.cacheService.delete(`user:${userId}`);
            await this.cacheService.delete(`user:branches:${userId}`);
            this.logger.log(`Caché invalidado para usuario ${userId} por asignación a branch ${branchId} (manager: ${isManager})`);
        }
        catch (error) {
            this.logger.error(`Error al invalidar caché por asignación de branch: ${error.message}`);
        }
    }
    async invalidateOnBranchRemoval(userId, branchId) {
        try {
            await this.cacheService.delete(`user:${userId}`);
            await this.cacheService.delete(`user:branches:${userId}`);
            this.logger.log(`Caché invalidado para usuario ${userId} por remoción de branch ${branchId}`);
        }
        catch (error) {
            this.logger.error(`Error al invalidar caché por remoción de branch: ${error.message}`);
        }
    }
    async invalidateOnStatusUpdate(userId, newStatusId) {
        try {
            await this.cacheService.delete(`user:${userId}`);
            await this.cacheService.delete(`user:profile:${userId}`);
            this.logger.log(`Caché invalidado para usuario ${userId} por cambio de estado a ${newStatusId}`);
        }
        catch (error) {
            this.logger.error(`Error al invalidar caché por cambio de estado: ${error.message}`);
        }
    }
    async invalidateOnBranchUpdate(branchId) {
        try {
            await this.cacheService.deletePattern(`branch:${branchId}:*`);
            this.logger.log(`Caché invalidado masivamente por actualización de branch ${branchId}`);
        }
        catch (error) {
            this.logger.error(`Error al invalidar caché masivo por branch: ${error.message}`);
        }
    }
    async refreshUserProfile(userId) {
        try {
            await this.cacheService.delete(`user:${userId}`);
            await this.cacheService.delete(`user:profile:${userId}`);
            this.logger.log(`Perfil refrescado en caché para usuario ${userId}`);
        }
        catch (error) {
            this.logger.error(`Error al refrescar perfil en caché: ${error.message}`);
        }
    }
    async isUserInCache(userId) {
        try {
            const cached = await this.cacheService.get(`user:${userId}`);
            return cached !== null;
        }
        catch (error) {
            this.logger.error(`Error al verificar usuario en caché: ${error.message}`);
            return false;
        }
    }
    async getCacheStats() {
        return {
            totalCachedUsers: 0,
            cacheHitRate: 0,
        };
    }
};
exports.AuthCacheService = AuthCacheService;
exports.AuthCacheService = AuthCacheService = AuthCacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_cache_service_1.RedisCacheService])
], AuthCacheService);
//# sourceMappingURL=auth-cache.service.js.map