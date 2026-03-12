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
var PermissionsGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
let PermissionsGuard = PermissionsGuard_1 = class PermissionsGuard {
    reflector;
    logger = new common_1.Logger(PermissionsGuard_1.name);
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            this.logger.warn('⚠️ Usuario no autenticado intentando acceder a ruta protegida');
            throw new common_1.ForbiddenException('Usuario no autenticado');
        }
        if (this.isSuperAdmin(user)) {
            this.logger.debug(`✅ Super Admin bypass: ${user.email || user.username}`);
            return true;
        }
        let userPermissions = [];
        this.logger.debug(`🔍 Tipo de permissions: ${typeof user.permissions}, ` +
            `es array: ${Array.isArray(user.permissions)}, ` +
            `valor: ${JSON.stringify(user.permissions)}`);
        if (Array.isArray(user.permissions)) {
            userPermissions = user.permissions;
        }
        else if (Array.isArray(user.permissionsArray)) {
            userPermissions = user.permissionsArray;
        }
        else {
            const perms = user.permissions || user.permissionsArray;
            if (perms && typeof perms === 'object') {
                userPermissions = Object.values(perms).filter((v) => typeof v === 'string');
            }
        }
        if (userPermissions.length === 0) {
            this.logger.warn(`❌ Usuario ${user.email || user.username} no tiene permisos en el JWT`);
            throw new common_1.ForbiddenException(`Permisos insuficientes. Se requiere alguno de: ${requiredPermissions.join(', ')}`);
        }
        if (userPermissions.includes('*') || userPermissions.includes('WILDCARD')) {
            this.logger.debug(`✅ Wildcard permission: ${user.email || user.username}`);
            return true;
        }
        const hasPermission = requiredPermissions.some((requiredPermission) => {
            if (userPermissions.includes(requiredPermission)) {
                return true;
            }
            const resourcePrefix = this.extractResourcePrefix(requiredPermission);
            if (resourcePrefix && userPermissions.includes(`${resourcePrefix}:*`)) {
                return true;
            }
            return false;
        });
        if (!hasPermission) {
            this.logger.warn(`❌ Acceso denegado para ${user.email || user.username}. ` +
                `Requiere: [${requiredPermissions.join(', ')}], ` +
                `Tiene: [${userPermissions.join(', ')}]`);
            throw new common_1.ForbiddenException(`Permisos insuficientes. Se requiere alguno de: ${requiredPermissions.join(', ')}`);
        }
        this.logger.debug(`✅ Acceso permitido para ${user.email || user.username} con permisos: [${userPermissions.join(', ')}]`);
        return true;
    }
    isSuperAdmin(user) {
        if (user.authorizationRole === 5 || user.isSuperAdmin === true) {
            return true;
        }
        const roleNames = [
            user.authorizationRoleName,
            user.roleName,
            user.role?.name,
        ].filter(Boolean);
        return roleNames.some((name) => name === 'SUPER_ADMIN' ||
            name === 'super_admin' ||
            name === 'SuperAdmin');
    }
    extractResourcePrefix(permission) {
        const match = permission.match(/^(CREATE|UPDATE|DELETE|VIEW|READ|MANAGE)_(.+)$/);
        if (match && match[2]) {
            return match[2];
        }
        return null;
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = PermissionsGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], PermissionsGuard);
//# sourceMappingURL=permissions.guard.js.map