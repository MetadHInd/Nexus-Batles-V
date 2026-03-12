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
var RolesGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("../decorators/roles.decorator");
let RolesGuard = RolesGuard_1 = class RolesGuard {
    reflector;
    logger = new common_1.Logger(RolesGuard_1.name);
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            this.logger.warn('Usuario no autenticado intentando acceder a recurso protegido');
            throw new common_1.ForbiddenException('Usuario no autenticado');
        }
        const userRoleId = user.role?.id || user.role || user.roleId;
        if (!userRoleId) {
            this.logger.warn(`Usuario ${user.userId || user.id} sin rol definido`);
            throw new common_1.ForbiddenException('Usuario sin rol asignado');
        }
        const hasRole = requiredRoles.some((role) => {
            return typeof role === 'number'
                ? role === userRoleId
                : role === userRoleId;
        });
        if (!hasRole) {
            this.logger.warn(`Usuario ${user.userId || user.id} con rol ${userRoleId} intentó acceder a recurso que requiere roles: ${requiredRoles.join(', ')}`);
            throw new common_1.ForbiddenException(`Acceso prohibido: Requiere uno de los siguientes roles: ${requiredRoles.join(', ')}`);
        }
        this.logger.debug(`Usuario ${user.userId || user.id} con rol ${userRoleId} autorizado para acceder al recurso`);
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = RolesGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map