"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSION_LEVEL_HIERARCHY = exports.PERMISSION_LEVEL_DESCRIPTIONS = exports.PERMISSION_LEVELS = exports.PermissionLevel = void 0;
var PermissionLevel;
(function (PermissionLevel) {
    PermissionLevel["SYSTEM"] = "system";
    PermissionLevel["ADMIN"] = "admin";
    PermissionLevel["MANAGER"] = "manager";
    PermissionLevel["USER"] = "user";
    PermissionLevel["GUEST"] = "guest";
})(PermissionLevel || (exports.PermissionLevel = PermissionLevel = {}));
exports.PERMISSION_LEVELS = Object.values(PermissionLevel);
exports.PERMISSION_LEVEL_DESCRIPTIONS = {
    [PermissionLevel.SYSTEM]: 'Sistema - Acceso crítico',
    [PermissionLevel.ADMIN]: 'Administrador - Gestión completa',
    [PermissionLevel.MANAGER]: 'Gerente - Supervisión y gestión',
    [PermissionLevel.USER]: 'Usuario - Operaciones estándar',
    [PermissionLevel.GUEST]: 'Invitado - Acceso limitado',
};
exports.PERMISSION_LEVEL_HIERARCHY = {
    [PermissionLevel.GUEST]: 1,
    [PermissionLevel.USER]: 2,
    [PermissionLevel.MANAGER]: 3,
    [PermissionLevel.ADMIN]: 4,
    [PermissionLevel.SYSTEM]: 5,
};
//# sourceMappingURL=permission-level.enum.js.map