"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CanCreateUsersGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanCreateUsersGuard = void 0;
const common_1 = require("@nestjs/common");
let CanCreateUsersGuard = CanCreateUsersGuard_1 = class CanCreateUsersGuard {
    logger = new common_1.Logger(CanCreateUsersGuard_1.name);
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('Usuario no autenticado');
        }
        console.log('User in CanCreateUsersGuard:', user);
        this.logger.debug(`Checking can_create_users permission for user: ${user.usersub || user.sub}`);
        if (user.restaurants && Array.isArray(user.restaurants)) {
            const canCreate = user.restaurants.some((r) => r.can_create_users === true || r.is_owner === true);
            if (canCreate) {
                this.logger.debug(`Permission granted for user: ${user.usersub || user.sub}`);
                return true;
            }
        }
        this.logger.warn(`User ${user.usersub || user.sub} does not have can_create_users permission`);
        throw new common_1.ForbiddenException('No tienes permiso para crear usuarios. Necesitas el permiso can_create_users o ser owner de al menos un restaurante.');
    }
};
exports.CanCreateUsersGuard = CanCreateUsersGuard;
exports.CanCreateUsersGuard = CanCreateUsersGuard = CanCreateUsersGuard_1 = __decorate([
    (0, common_1.Injectable)()
], CanCreateUsersGuard);
//# sourceMappingURL=can-create-users.guard.js.map