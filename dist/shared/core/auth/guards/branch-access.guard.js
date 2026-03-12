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
exports.BranchAccessGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const branch_access_decorator_1 = require("../decorators/branch-access.decorator");
let BranchAccessGuard = class BranchAccessGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const config = this.reflector.getAllAndOverride(branch_access_decorator_1.BRANCH_ACCESS_KEY, [context.getHandler(), context.getClass()]);
        if (!config) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user?.profile) {
            throw new common_1.ForbiddenException('Usuario no autenticado');
        }
        let branchId;
        if (config.paramName) {
            branchId = parseInt(request.params[config.paramName]);
        }
        else if (config.bodyField) {
            branchId = parseInt(request.body[config.bodyField]);
        }
        else {
            branchId = parseInt(request.params.branchId ||
                request.params.branch_id ||
                request.body.branchId ||
                request.body.branch_id);
        }
        if (isNaN(branchId)) {
            throw new common_1.BadRequestException('ID de sucursal inválido o faltante');
        }
        if (!user.profile.canAccessBranch(branchId)) {
            throw new common_1.ForbiddenException('No tiene acceso a esta sucursal');
        }
        if (config.requireManager && !user.profile.canManageBranch(branchId)) {
            throw new common_1.ForbiddenException('Requiere permisos de administrador en esta sucursal');
        }
        request.currentBranchId = branchId;
        return true;
    }
};
exports.BranchAccessGuard = BranchAccessGuard;
exports.BranchAccessGuard = BranchAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], BranchAccessGuard);
//# sourceMappingURL=branch-access.guard.js.map