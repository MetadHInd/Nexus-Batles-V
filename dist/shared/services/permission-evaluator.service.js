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
var PermissionEvaluatorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionEvaluatorService = void 0;
const common_1 = require("@nestjs/common");
const service_cache_1 = require("../core/services/service-cache/service-cache");
const redis_cache_service_1 = require("../cache/redis-cache.service");
let PermissionEvaluatorService = PermissionEvaluatorService_1 = class PermissionEvaluatorService {
    cache;
    logger = new common_1.Logger(PermissionEvaluatorService_1.name);
    CACHE_TTL = 300;
    constructor(cache) {
        this.cache = cache;
    }
    async hasPermission(userId, moduleCode, actionCode, scope = 'organization') {
        try {
            const permissionCode = `${moduleCode}.${actionCode}.${scope}`;
            const effectivePermissions = await this.getUserEffectivePermissions(userId);
            const hasPermission = effectivePermissions.some((p) => p.code === permissionCode && p.is_active);
            this.logger.debug(`User ${userId} ${hasPermission ? 'HAS' : 'DOES NOT HAVE'} permission: ${permissionCode}`);
            return hasPermission;
        }
        catch (error) {
            this.logger.error(`Error checking permission: ${error.message}`);
            return false;
        }
    }
    async getUserEffectivePermissions(userId) {
        const cacheKey = `user:${userId}:effective-permissions`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            this.logger.debug(`Returning cached permissions for user ${userId}`);
            return cached;
        }
        try {
            const user = await service_cache_1.ServiceCache.Database.sysUser.findUnique({
                where: { idsysUser: userId },
                include: { role_sysUser_roleTorole: true },
            });
            if (!user) {
                this.logger.warn(`User ${userId} not found`);
                return [];
            }
            const rolePermissions = await service_cache_1.ServiceCache.Database.role_permissions.findMany({
                where: {
                    role_id: user.role,
                    is_active: true,
                },
                include: {
                    permission_definition: true,
                },
            });
            const userPermissions = await service_cache_1.ServiceCache.Database.user_permissions.findMany({
                where: {
                    user_id: userId,
                    is_active: true,
                },
                include: {
                    permission_definition: true,
                },
            });
            const allPermissions = new Map();
            rolePermissions.forEach((rp) => {
                if (rp.permission_definition) {
                    allPermissions.set(rp.permission_definition.id, rp.permission_definition);
                }
            });
            userPermissions.forEach((up) => {
                if (up.permission_definition) {
                    allPermissions.set(up.permission_definition.id, up.permission_definition);
                }
            });
            const effectivePermissions = Array.from(allPermissions.values());
            await this.cache.set({ key: cacheKey }, effectivePermissions, this.CACHE_TTL);
            this.logger.debug(`User ${userId} has ${effectivePermissions.length} effective permissions`);
            return effectivePermissions;
        }
        catch (error) {
            this.logger.error(`Error getting effective permissions: ${error.message}`);
            return [];
        }
    }
    async hasAnyPermission(userId, permissionCodes) {
        try {
            const effectivePermissions = await this.getUserEffectivePermissions(userId);
            const permissionCodesSet = new Set(effectivePermissions.map((p) => p.code));
            const hasAny = permissionCodes.some((code) => permissionCodesSet.has(code));
            this.logger.debug(`User ${userId} ${hasAny ? 'HAS' : 'DOES NOT HAVE'} any of: ${permissionCodes.join(', ')}`);
            return hasAny;
        }
        catch (error) {
            this.logger.error(`Error checking any permission: ${error.message}`);
            return false;
        }
    }
    async hasAllPermissions(userId, permissionCodes) {
        try {
            const effectivePermissions = await this.getUserEffectivePermissions(userId);
            const permissionCodesSet = new Set(effectivePermissions.map((p) => p.code));
            const hasAll = permissionCodes.every((code) => permissionCodesSet.has(code));
            this.logger.debug(`User ${userId} ${hasAll ? 'HAS' : 'DOES NOT HAVE'} all of: ${permissionCodes.join(', ')}`);
            return hasAll;
        }
        catch (error) {
            this.logger.error(`Error checking all permissions: ${error.message}`);
            return false;
        }
    }
    async checkOwnership(userId, resourceType, resourceId) {
        try {
            const resourceModelMap = {
                order: 'orders',
                customer: 'client',
                user: 'sysUser',
                agent: 'agent',
            };
            const modelName = resourceModelMap[resourceType];
            if (!modelName) {
                this.logger.warn(`Unknown resource type: ${resourceType}`);
                return false;
            }
            const model = service_cache_1.ServiceCache.Database[modelName];
            if (!model) {
                this.logger.warn(`Model not found: ${modelName}`);
                return false;
            }
            const resource = await model.findUnique({
                where: { id: resourceId },
            });
            if (!resource) {
                this.logger.warn(`Resource not found: ${resourceType}#${resourceId}`);
                return false;
            }
            const isOwner = resource.user_id === userId ||
                resource.created_by === userId ||
                resource.idsysUser === userId;
            this.logger.debug(`User ${userId} ${isOwner ? 'IS' : 'IS NOT'} owner of ${resourceType}#${resourceId}`);
            return isOwner;
        }
        catch (error) {
            this.logger.error(`Error checking ownership: ${error.message}`);
            return false;
        }
    }
    async clearUserPermissionsCache(userId) {
        const cacheKey = `user:${userId}:effective-permissions`;
        await this.cache.delete(cacheKey);
        this.logger.debug(`Cleared permissions cache for user ${userId}`);
    }
    async isAdmin(userId) {
        try {
            const user = await service_cache_1.ServiceCache.Database.sysUser.findUnique({
                where: { idsysUser: userId },
            });
            return user?.role === 1;
        }
        catch (error) {
            this.logger.error(`Error checking if user is admin: ${error.message}`);
            return false;
        }
    }
};
exports.PermissionEvaluatorService = PermissionEvaluatorService;
exports.PermissionEvaluatorService = PermissionEvaluatorService = PermissionEvaluatorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_cache_service_1.RedisCacheService])
], PermissionEvaluatorService);
//# sourceMappingURL=permission-evaluator.service.js.map