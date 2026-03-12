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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersExampleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const dual_role_guard_1 = require("../guards/dual-role.guard");
const dual_roles_decorator_1 = require("../decorators/dual-roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const roles_enum_1 = require("../constants/roles.enum");
let UsersExampleController = class UsersExampleController {
    async getUsers(user) {
        return {
            message: 'Usuarios obtenidos exitosamente',
            data: {
                requiredRole: 'SUPER_ADMIN o ADMIN_AUTHORIZED_ORIGIN',
                currentUser: {
                    id: user.userId,
                    authRole: user.authorizationRoleName,
                    localRole: user.localRoleName,
                    isSuperAdmin: user.isSuperAdmin,
                },
            },
        };
    }
    async getMyProfile(user) {
        return {
            message: 'Perfil obtenido exitosamente',
            data: {
                user: {
                    id: user.userId,
                    name: user.fullName,
                    email: user.email,
                    authorizationRole: user.authorizationRoleName,
                    localRole: user.localRoleName,
                    isAIA: user.isAIAUser,
                    branches: user.branches.length,
                },
            },
        };
    }
    async createUser(userData, user) {
        return {
            message: 'Usuario creado exitosamente',
            data: {
                note: 'Solo SUPER_ADMIN puede crear usuarios',
                createdBy: {
                    id: user.userId,
                    role: user.authorizationRoleName,
                },
                userData,
            },
        };
    }
    async updateUser(id, updateData, user) {
        return {
            message: 'Usuario actualizado exitosamente',
            data: {
                targetUserId: id,
                note: 'Si el usuario objetivo es AIA, solo SUPER_ADMIN puede modificarlo',
                updatedBy: {
                    id: user.userId,
                    authRole: user.authorizationRoleName,
                    canModifyAIA: user.isSuperAdmin || user.isGlobalAdmin,
                },
                updateData,
            },
        };
    }
    async deleteUser(id, user) {
        return {
            message: 'Usuario eliminado exitosamente',
            data: {
                targetUserId: id,
                note: 'Requiere ser ADMIN+ de authorization Y Owner/Regional Manager local. AIA protegido.',
                deletedBy: {
                    id: user.userId,
                    authRole: user.authorizationRoleName,
                    localRole: user.localRoleName,
                },
            },
        };
    }
    async changeUserRole(id, roleData, user) {
        return {
            message: 'Rol de usuario actualizado exitosamente',
            data: {
                targetUserId: id,
                newRoleId: roleData.newRoleId,
                note: 'Solo Owner/Regional Manager pueden cambiar roles. AIA protegido.',
                changedBy: {
                    id: user.userId,
                    localRole: user.localRoleName,
                },
            },
        };
    }
    async getManagerData(user) {
        return {
            message: 'Datos de manager obtenidos',
            data: {
                note: 'Solo Owner y Regional Manager locales pueden acceder',
                manager: {
                    id: user.userId,
                    localRole: user.localRoleName,
                    authRole: user.authorizationRoleName,
                },
            },
        };
    }
    async getSupervisorData(user) {
        return {
            message: 'Datos de supervisor obtenidos',
            data: {
                note: 'Solo SUPERVISOR, ADMIN, ADMIN_AUTHORIZED_ORIGIN o SUPER_ADMIN',
                supervisor: {
                    id: user.userId,
                    authRole: user.authorizationRoleName,
                    hasGlobalAccess: user.isGlobalAdmin,
                },
            },
        };
    }
    async updateSensitiveData(id, sensitiveData, user) {
        return {
            message: 'Datos sensibles actualizados',
            data: {
                targetUserId: id,
                note: 'Requiere ADMIN+ de authorization Y Manager+ local. AIA protegido.',
                updatedBy: {
                    id: user.userId,
                    authRole: user.authorizationRoleName,
                    localRole: user.localRoleName,
                    meets: {
                        authRequirement: [
                            'ADMIN',
                            'ADMIN_AUTHORIZED_ORIGIN',
                            'SUPER_ADMIN',
                        ].includes(user.authorizationRoleName),
                        localRequirement: ['MANAGER', 'REGIONAL_MANAGER', 'OWNER'].includes(user.localRoleName),
                    },
                },
            },
        };
    }
};
exports.UsersExampleController = UsersExampleController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar usuarios - Solo administradores globales' }),
    (0, dual_roles_decorator_1.GlobalAdminOnly)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersExampleController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Ver mi perfil - Cualquier usuario autenticado' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersExampleController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear usuario - Solo SUPER_ADMIN' }),
    (0, dual_roles_decorator_1.SuperAdminOnly)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersExampleController.prototype, "createUser", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Actualizar usuario - Protege usuarios AIA',
        description: 'Los usuarios AIA solo pueden ser modificados por SUPER_ADMIN o ADMIN_AUTHORIZED_ORIGIN',
    }),
    (0, dual_roles_decorator_1.AIAProtected)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersExampleController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Eliminar usuario - Requiere ADMIN de authorization Y Owner/Regional Manager local + Protege AIA',
    }),
    (0, dual_roles_decorator_1.RequireDualRolesAndProtectAIA)({
        authorizationRoles: [
            roles_enum_1.AuthorizationRole.ADMIN,
            roles_enum_1.AuthorizationRole.SUPER_ADMIN,
        ],
        localRoles: [roles_enum_1.LocalRole.OWNER, roles_enum_1.LocalRole.REGIONAL_MANAGER],
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UsersExampleController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Put)(':id/role'),
    (0, swagger_1.ApiOperation)({
        summary: 'Cambiar rol de usuario - Solo administradores locales Owner/Regional Manager',
    }),
    (0, dual_roles_decorator_1.RequireLocalRole)(roles_enum_1.LocalRole.OWNER, roles_enum_1.LocalRole.REGIONAL_MANAGER),
    (0, dual_roles_decorator_1.AIAProtected)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersExampleController.prototype, "changeUserRole", null);
__decorate([
    (0, common_1.Get)('managers-only'),
    (0, swagger_1.ApiOperation)({ summary: 'Endpoint solo para managers locales' }),
    (0, dual_roles_decorator_1.ManagersOnly)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersExampleController.prototype, "getManagerData", null);
__decorate([
    (0, common_1.Get)('supervisors-and-above'),
    (0, swagger_1.ApiOperation)({ summary: 'Solo roles de authorization SUPERVISOR+' }),
    (0, dual_roles_decorator_1.RequireAuthorizationRole)(roles_enum_1.AuthorizationRole.SUPERVISOR, roles_enum_1.AuthorizationRole.ADMIN, roles_enum_1.AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN, roles_enum_1.AuthorizationRole.SUPER_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersExampleController.prototype, "getSupervisorData", null);
__decorate([
    (0, common_1.Put)(':id/sensitive-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Modificar datos sensibles - Requiere ADMIN de authorization Y Manager local mínimo',
    }),
    (0, dual_roles_decorator_1.RequireDualRoles)({
        authorizationRoles: [
            roles_enum_1.AuthorizationRole.ADMIN,
            roles_enum_1.AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN,
            roles_enum_1.AuthorizationRole.SUPER_ADMIN,
        ],
        localRoles: [
            roles_enum_1.LocalRole.MANAGER,
            roles_enum_1.LocalRole.REGIONAL_MANAGER,
            roles_enum_1.LocalRole.OWNER,
        ],
    }),
    (0, dual_roles_decorator_1.AIAProtected)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersExampleController.prototype, "updateSensitiveData", null);
exports.UsersExampleController = UsersExampleController = __decorate([
    (0, swagger_1.ApiTags)('Users Management'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    (0, common_1.Controller)('api/users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, dual_role_guard_1.DualRoleGuard)
], UsersExampleController);
//# sourceMappingURL=users-dual-roles.controller.example.js.map