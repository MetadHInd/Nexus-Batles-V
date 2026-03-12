"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSION_SCOPE_DESCRIPTIONS = exports.PERMISSION_SCOPES = exports.PermissionScope = void 0;
/**
 * 🎯 ENUMERACIÓN DE ALCANCES DE PERMISOS (SCOPE)
 *
 * Define los diferentes niveles de alcance que puede tener un permiso:
 *
 * - OWN: Solo recursos propios del usuario
 * - TEAM: Recursos del equipo al que pertenece el usuario
 * - ORGANIZATION: Recursos de toda la organización
 * - BRANCH: Recursos de una sucursal específica
 * - GLOBAL: Acceso a todos los recursos sin restricciones
 * - CUSTOM: Alcance personalizado definido por condiciones
 */
var PermissionScope;
(function (PermissionScope) {
    /** Solo puede acceder a sus propios recursos */
    PermissionScope["OWN"] = "own";
    /** Puede acceder a recursos de su equipo */
    PermissionScope["TEAM"] = "team";
    /** Puede acceder a recursos de su sucursal */
    PermissionScope["BRANCH"] = "branch";
    /** Puede acceder a recursos de toda la organización */
    PermissionScope["ORGANIZATION"] = "organization";
    /** Acceso global sin restricciones */
    PermissionScope["GLOBAL"] = "global";
    /** Alcance personalizado basado en condiciones */
    PermissionScope["CUSTOM"] = "custom";
})(PermissionScope || (exports.PermissionScope = PermissionScope = {}));
/**
 * Array con todos los valores válidos de scope
 */
exports.PERMISSION_SCOPES = Object.values(PermissionScope);
/**
 * Descripción legible de cada scope
 */
exports.PERMISSION_SCOPE_DESCRIPTIONS = (_a = {},
    _a[PermissionScope.OWN] = 'Solo recursos propios',
    _a[PermissionScope.TEAM] = 'Recursos del equipo',
    _a[PermissionScope.BRANCH] = 'Recursos de la sucursal',
    _a[PermissionScope.ORGANIZATION] = 'Recursos de la organización',
    _a[PermissionScope.GLOBAL] = 'Acceso global sin restricciones',
    _a[PermissionScope.CUSTOM] = 'Alcance personalizado',
    _a);
