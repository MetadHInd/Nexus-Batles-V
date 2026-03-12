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
var DualRoleGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DualRoleGuard = exports.PROTECT_AIA_KEY = exports.DUAL_ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_enum_1 = require("../constants/roles.enum");
const user_role_service_1 = require("../services/user-role.service");
exports.DUAL_ROLES_KEY = 'dualRoles';
exports.PROTECT_AIA_KEY = 'protectAIA';
let DualRoleGuard = DualRoleGuard_1 = class DualRoleGuard {
    reflector;
    userRoleService;
    logger = new common_1.Logger(DualRoleGuard_1.name);
    constructor(reflector, userRoleService) {
        this.reflector = reflector;
        this.userRoleService = userRoleService;
    }
    async canActivate(context) {
        const dualRoleConfig = this.reflector.getAllAndOverride(exports.DUAL_ROLES_KEY, [context.getHandler(), context.getClass()]);
        const protectAIA = this.reflector.getAllAndOverride(exports.PROTECT_AIA_KEY, [context.getHandler(), context.getClass()]);
        if (!dualRoleConfig && !protectAIA) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            this.logger.warn('Usuario no autenticado intentando acceder a recurso protegido');
            throw new common_1.ForbiddenException('Usuario no autenticado');
        }
        const authorizationRole = user.authorizationRole || user.role || user.roleId;
        const localRole = user.profile?.role?.id || user.localRole;
        this.logger.debug(`Usuario ${user.userId}: AuthRole=${authorizationRole}, LocalRole=${localRole}`);
        const isSuperAdmin = authorizationRole === roles_enum_1.AuthorizationRole.SUPER_ADMIN;
        const isGlobalAdmin = authorizationRole === roles_enum_1.AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN;
        const isAssistant = authorizationRole === roles_enum_1.AuthorizationRole.ASSISTANT;
        if (isSuperAdmin || isGlobalAdmin || isAssistant) {
            this.logger.debug(`Usuario ${user.userId} tiene acceso global (AuthRole: ${authorizationRole})`);
            return true;
        }
        if (dualRoleConfig) {
            const hasAuthRole = !dualRoleConfig.authorizationRoles ||
                dualRoleConfig.authorizationRoles.includes(authorizationRole);
            const hasLocalRole = !dualRoleConfig.localRoles ||
                dualRoleConfig.localRoles.includes(localRole);
            if (!hasAuthRole || !hasLocalRole) {
                this.logger.warn(`Usuario ${user.userId} sin permisos suficientes. ` +
                    `Requiere AuthRoles: ${dualRoleConfig.authorizationRoles?.join(', ')} ` +
                    `y LocalRoles: ${dualRoleConfig.localRoles?.join(', ')}`);
                throw new common_1.ForbiddenException('Permisos insuficientes');
            }
        }
        if (protectAIA) {
            return await this.checkAIAProtection(context, user, authorizationRole, localRole);
        }
        return true;
    }
    async checkAIAProtection(context, user, authorizationRole, localRole) {
        const request = context.switchToHttp().getRequest();
        const targetUserId = this.extractTargetUserId(request);
        if (!targetUserId) {
            return true;
        }
        return await this.checkIfTargetIsAIAAndProtect(targetUserId, user.userId, authorizationRole, localRole);
    }
    extractTargetUserId(request) {
        const paramUserId = parseInt(request.params.userId || request.params.id || request.params.sysUserId);
        if (!isNaN(paramUserId)) {
            return paramUserId;
        }
        const bodyUserId = parseInt(request.body?.userId || request.body?.id || request.body?.sysUserId);
        if (!isNaN(bodyUserId)) {
            return bodyUserId;
        }
        return null;
    }
    async checkIfTargetIsAIAAndProtect(targetUserId, currentUserId, authorizationRole, localRole) {
        try {
            const canModify = await this.userRoleService.canUserModifyUser(currentUserId, targetUserId, authorizationRole);
            this.userRoleService.logSecurityAction('MODIFY_USER_ATTEMPT', currentUserId, targetUserId, authorizationRole, localRole, canModify);
            if (!canModify) {
                throw new common_1.ForbiddenException('No tiene permisos para modificar este usuario');
            }
            return true;
        }
        catch (error) {
            this.logger.error(`Error verificando protección AIA: ${error.message}`);
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.ForbiddenException('Error verificando permisos');
        }
    }
};
exports.DualRoleGuard = DualRoleGuard;
exports.DualRoleGuard = DualRoleGuard = DualRoleGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        user_role_service_1.UserRoleService])
], DualRoleGuard);
//# sourceMappingURL=dual-role.guard.js.map