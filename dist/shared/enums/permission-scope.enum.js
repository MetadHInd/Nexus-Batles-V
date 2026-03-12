"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSION_SCOPE_DESCRIPTIONS = exports.PERMISSION_SCOPES = exports.PermissionScope = void 0;
var PermissionScope;
(function (PermissionScope) {
    PermissionScope["OWN"] = "own";
    PermissionScope["TEAM"] = "team";
    PermissionScope["BRANCH"] = "branch";
    PermissionScope["ORGANIZATION"] = "organization";
    PermissionScope["GLOBAL"] = "global";
    PermissionScope["CUSTOM"] = "custom";
})(PermissionScope || (exports.PermissionScope = PermissionScope = {}));
exports.PERMISSION_SCOPES = Object.values(PermissionScope);
exports.PERMISSION_SCOPE_DESCRIPTIONS = {
    [PermissionScope.OWN]: 'Solo recursos propios',
    [PermissionScope.TEAM]: 'Recursos del equipo',
    [PermissionScope.BRANCH]: 'Recursos de la sucursal',
    [PermissionScope.ORGANIZATION]: 'Recursos de la organización',
    [PermissionScope.GLOBAL]: 'Acceso global sin restricciones',
    [PermissionScope.CUSTOM]: 'Alcance personalizado',
};
//# sourceMappingURL=permission-scope.enum.js.map