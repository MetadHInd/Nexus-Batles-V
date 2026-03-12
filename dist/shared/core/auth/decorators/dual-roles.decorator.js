"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireDualRolesAndProtectAIA = exports.AIAProtected = exports.ManagersOnly = exports.GlobalAdminOnly = exports.SuperAdminOnly = exports.RequireLocalRole = exports.RequireAuthorizationRole = exports.ProtectAIAUsers = exports.RequireDualRoles = exports.PROTECT_AIA_KEY = exports.DUAL_ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
const roles_enum_1 = require("../constants/roles.enum");
exports.DUAL_ROLES_KEY = 'dualRoles';
exports.PROTECT_AIA_KEY = 'protectAIA';
const RequireDualRoles = (config) => (0, common_1.SetMetadata)(exports.DUAL_ROLES_KEY, config);
exports.RequireDualRoles = RequireDualRoles;
const ProtectAIAUsers = () => (0, common_1.SetMetadata)(exports.PROTECT_AIA_KEY, true);
exports.ProtectAIAUsers = ProtectAIAUsers;
const RequireAuthorizationRole = (...roles) => (0, exports.RequireDualRoles)({ authorizationRoles: roles });
exports.RequireAuthorizationRole = RequireAuthorizationRole;
const RequireLocalRole = (...roles) => (0, exports.RequireDualRoles)({ localRoles: roles });
exports.RequireLocalRole = RequireLocalRole;
const SuperAdminOnly = () => (0, exports.RequireDualRoles)({ authorizationRoles: [roles_enum_1.AuthorizationRole.SUPER_ADMIN] });
exports.SuperAdminOnly = SuperAdminOnly;
const GlobalAdminOnly = () => (0, exports.RequireDualRoles)({
    authorizationRoles: [
        roles_enum_1.AuthorizationRole.SUPER_ADMIN,
        roles_enum_1.AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN,
    ],
});
exports.GlobalAdminOnly = GlobalAdminOnly;
const ManagersOnly = () => (0, exports.RequireDualRoles)({
    localRoles: [roles_enum_1.LocalRole.OWNER, roles_enum_1.LocalRole.REGIONAL_MANAGER],
});
exports.ManagersOnly = ManagersOnly;
const AIAProtected = () => (0, exports.ProtectAIAUsers)();
exports.AIAProtected = AIAProtected;
const RequireDualRolesAndProtectAIA = (config) => {
    return (target, propertyKey, descriptor) => {
        (0, exports.RequireDualRoles)(config)(target, propertyKey, descriptor);
        (0, exports.ProtectAIAUsers)()(target, propertyKey, descriptor);
    };
};
exports.RequireDualRolesAndProtectAIA = RequireDualRolesAndProtectAIA;
//# sourceMappingURL=dual-roles.decorator.js.map