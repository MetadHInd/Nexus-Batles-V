"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSystemAdmin = isSystemAdmin;
exports.canBypassForSystemAdmin = canBypassForSystemAdmin;
exports.shouldBypassValidation = shouldBypassValidation;
const roles_enum_1 = require("../constants/roles.enum");
const bypass_for_system_admin_decorator_1 = require("../decorators/bypass-for-system-admin.decorator");
function isSystemAdmin(user) {
    return (user?.authorizationRole === roles_enum_1.AuthorizationRole.ADMIN ||
        user?.authorizationRole === roles_enum_1.AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN ||
        user?.authorizationRole === roles_enum_1.AuthorizationRole.SUPER_ADMIN);
}
function canBypassForSystemAdmin(context, reflector) {
    return (reflector.get(bypass_for_system_admin_decorator_1.BYPASS_FOR_SYSTEM_ADMIN_KEY, context.getHandler()) ||
        false);
}
function shouldBypassValidation(user, context, reflector) {
    return canBypassForSystemAdmin(context, reflector) && isSystemAdmin(user);
}
//# sourceMappingURL=system-admin.helper.js.map