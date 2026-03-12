"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSystemAdmin = isSystemAdmin;
exports.canBypassForSystemAdmin = canBypassForSystemAdmin;
exports.shouldBypassValidation = shouldBypassValidation;
var roles_enum_1 = require("../constants/roles.enum");
var bypass_for_system_admin_decorator_1 = require("../decorators/bypass-for-system-admin.decorator");
/**
 * Verifica si el usuario es un administrador del sistema que puede saltarse validaciones
 */
function isSystemAdmin(user) {
    return ((user === null || user === void 0 ? void 0 : user.authorizationRole) === roles_enum_1.AuthorizationRole.ADMIN ||
        (user === null || user === void 0 ? void 0 : user.authorizationRole) === roles_enum_1.AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN ||
        (user === null || user === void 0 ? void 0 : user.authorizationRole) === roles_enum_1.AuthorizationRole.SUPER_ADMIN);
}
/**
 * Verifica si el endpoint permite bypass para administradores del sistema
 */
function canBypassForSystemAdmin(context, reflector) {
    return (reflector.get(bypass_for_system_admin_decorator_1.BYPASS_FOR_SYSTEM_ADMIN_KEY, context.getHandler()) ||
        false);
}
/**
 * Verifica si el usuario puede saltarse las validaciones de negocio
 */
function shouldBypassValidation(user, context, reflector) {
    return canBypassForSystemAdmin(context, reflector) && isSystemAdmin(user);
}
