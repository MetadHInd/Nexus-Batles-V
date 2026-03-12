"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UserRoleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleService = void 0;
const common_1 = require("@nestjs/common");
const service_cache_1 = require("../../services/service-cache/service-cache");
const roles_enum_1 = require("../constants/roles.enum");
let UserRoleService = UserRoleService_1 = class UserRoleService {
    logger = new common_1.Logger(UserRoleService_1.name);
    canModifyAIAUsers(authorizationRole) {
        const canModify = authorizationRole === roles_enum_1.AuthorizationRole.SUPER_ADMIN ||
            authorizationRole === roles_enum_1.AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN ||
            authorizationRole === roles_enum_1.AuthorizationRole.ASSISTANT;
        this.logger.debug(`AuthRole ${authorizationRole} puede modificar AIA: ${canModify}`);
        return canModify;
    }
    hasGlobalAccess(authorizationRole) {
        const hasAccess = authorizationRole === roles_enum_1.AuthorizationRole.SUPER_ADMIN ||
            authorizationRole === roles_enum_1.AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN ||
            authorizationRole === roles_enum_1.AuthorizationRole.ASSISTANT;
        this.logger.debug(`AuthRole ${authorizationRole} tiene acceso global: ${hasAccess}`);
        return hasAccess;
    }
    async getUserRoleInfo(userId) {
        try {
            const user = await service_cache_1.ServiceCache.Database.Prisma.sysUser.findUnique({
                where: { idsysUser: userId },
                include: { role_sysUser_roleTorole: true },
            });
            if (!user) {
                return {
                    isAIA: false,
                    canModifyAIA: false,
                    hasGlobalAccess: false,
                };
            }
            const localRole = user.role_sysUser_roleTorole?.idrole || user.role || 3;
            const isAIA = localRole === roles_enum_1.LocalRole.AIA;
            return {
                localRole,
                isAIA,
                canModifyAIA: false,
                hasGlobalAccess: false,
            };
        }
        catch (error) {
            this.logger.error(`Error obteniendo información de roles para usuario ${userId}: ${error.message}`);
            return {
                isAIA: false,
                canModifyAIA: false,
                hasGlobalAccess: false,
            };
        }
    }
    async canUserModifyUser(currentUserId, targetUserId, currentAuthRole) {
        try {
            if (currentUserId === targetUserId) {
                return true;
            }
            if (this.hasGlobalAccess(currentAuthRole)) {
                return true;
            }
            return true;
        }
        catch (error) {
            this.logger.error(`Error verificando permisos de modificación entre usuarios ${currentUserId} -> ${targetUserId}: ${error.message}`);
            return false;
        }
    }
    logSecurityAction(action, currentUserId, targetUserId, authRole, localRole, allowed) {
        this.logger.log(`SECURITY: ${action} - Usuario: ${currentUserId} ` +
            `(AuthRole: ${authRole}, LocalRole: ${localRole}) ` +
            `${targetUserId ? `-> Target: ${targetUserId}` : ''} ` +
            `Resultado: ${allowed ? 'PERMITIDO' : 'DENEGADO'}`);
    }
};
exports.UserRoleService = UserRoleService;
exports.UserRoleService = UserRoleService = UserRoleService_1 = __decorate([
    (0, common_1.Injectable)()
], UserRoleService);
//# sourceMappingURL=user-role.service.js.map