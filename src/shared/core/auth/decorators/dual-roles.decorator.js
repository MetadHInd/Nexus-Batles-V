"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireDualRolesAndProtectAIA = exports.AIAProtected = exports.ManagersOnly = exports.GlobalAdminOnly = exports.SuperAdminOnly = exports.RequireLocalRole = exports.RequireAuthorizationRole = exports.ProtectAIAUsers = exports.RequireDualRoles = exports.PROTECT_AIA_KEY = exports.DUAL_ROLES_KEY = void 0;
var common_1 = require("@nestjs/common");
var roles_enum_1 = require("../constants/roles.enum");
exports.DUAL_ROLES_KEY = 'dualRoles';
exports.PROTECT_AIA_KEY = 'protectAIA';
/**
 * Decorador para requerir roles específicos (Authorization + Local)
 * Los SUPER_ADMIN siempre tienen acceso
 *
 * @param config Configuración de roles requeridos
 *
 * @example
 * // Solo ADMIN de authorization Y Manager local
 * @RequireDualRoles({
 *   authorizationRoles: [AuthorizationRole.ADMIN],
 *   localRoles: [LocalRole.MANAGER]
 * })
 *
 * // Solo roles de authorization
 * @RequireDualRoles({
 *   authorizationRoles: [AuthorizationRole.ADMIN, AuthorizationRole.SUPERVISOR]
 * })
 *
 * // Solo roles locales
 * @RequireDualRoles({
 *   localRoles: [LocalRole.OWNER, LocalRole.REGIONAL_MANAGER]
 * })
 */
var RequireDualRoles = function (config) {
    return (0, common_1.SetMetadata)(exports.DUAL_ROLES_KEY, config);
};
exports.RequireDualRoles = RequireDualRoles;
/**
 * Decorador para proteger usuarios AIA
 * Solo SUPER_ADMIN y ADMIN_AUTHORIZED_ORIGIN pueden modificar usuarios AIA
 *
 * @example
 * @ProtectAIAUsers()
 * @Put(':id')
 * async updateUser(@Param('id') id: number, @Body() data: UpdateUserDto) {
 *   // Solo SUPER_ADMIN puede modificar si el usuario objetivo es AIA
 * }
 */
var ProtectAIAUsers = function () { return (0, common_1.SetMetadata)(exports.PROTECT_AIA_KEY, true); };
exports.ProtectAIAUsers = ProtectAIAUsers;
/**
 * Decorador para endpoints que solo pueden ser accedidos por roles de authorization específicos
 */
var RequireAuthorizationRole = function () {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    return (0, exports.RequireDualRoles)({ authorizationRoles: roles });
};
exports.RequireAuthorizationRole = RequireAuthorizationRole;
/**
 * Decorador para endpoints que solo pueden ser accedidos por roles locales específicos
 */
var RequireLocalRole = function () {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    return (0, exports.RequireDualRoles)({ localRoles: roles });
};
exports.RequireLocalRole = RequireLocalRole;
/**
 * Decorador para endpoints que solo SUPER_ADMIN puede acceder
 */
var SuperAdminOnly = function () {
    return (0, exports.RequireDualRoles)({ authorizationRoles: [roles_enum_1.AuthorizationRole.SUPER_ADMIN] });
};
exports.SuperAdminOnly = SuperAdminOnly;
/**
 * Decorador para endpoints que solo administradores globales pueden acceder
 */
var GlobalAdminOnly = function () {
    return (0, exports.RequireDualRoles)({
        authorizationRoles: [
            roles_enum_1.AuthorizationRole.SUPER_ADMIN,
            roles_enum_1.AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN,
        ],
    });
};
exports.GlobalAdminOnly = GlobalAdminOnly;
/**
 * Decorador para endpoints que requieren ser Owner o Regional Manager local
 */
var ManagersOnly = function () {
    return (0, exports.RequireDualRoles)({
        localRoles: [roles_enum_1.LocalRole.OWNER, roles_enum_1.LocalRole.REGIONAL_MANAGER],
    });
};
exports.ManagersOnly = ManagersOnly;
/**
 * Decorador para endpoints donde nadie puede tocar usuarios AIA excepto SUPER_ADMIN
 */
var AIAProtected = function () { return (0, exports.ProtectAIAUsers)(); };
exports.AIAProtected = AIAProtected;
/**
 * Combinación común: Requiere ciertos roles Y protege usuarios AIA
 */
var RequireDualRolesAndProtectAIA = function (config) {
    return function (target, propertyKey, descriptor) {
        (0, exports.RequireDualRoles)(config)(target, propertyKey, descriptor);
        (0, exports.ProtectAIAUsers)()(target, propertyKey, descriptor);
    };
};
exports.RequireDualRolesAndProtectAIA = RequireDualRolesAndProtectAIA;
