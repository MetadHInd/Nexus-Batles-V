"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSION_LEVEL_HIERARCHY = exports.PERMISSION_LEVEL_DESCRIPTIONS = exports.PERMISSION_LEVELS = exports.PermissionLevel = void 0;
/**
 * 📊 ENUMERACIÓN DE NIVELES DE PERMISOS (LEVEL)
 *
 * Define la jerarquía o nivel de criticidad de un permiso:
 *
 * - SYSTEM: Permisos de sistema, configuración crítica
 * - ADMIN: Permisos administrativos de alto nivel
 * - MANAGER: Permisos de gestión y supervisión
 * - USER: Permisos de usuario estándar
 * - GUEST: Permisos mínimos para invitados
 */
var PermissionLevel;
(function (PermissionLevel) {
    /** Permisos de sistema, acceso a configuración crítica */
    PermissionLevel["SYSTEM"] = "system";
    /** Permisos administrativos de alto nivel */
    PermissionLevel["ADMIN"] = "admin";
    /** Permisos de gestión y supervisión */
    PermissionLevel["MANAGER"] = "manager";
    /** Permisos de usuario estándar */
    PermissionLevel["USER"] = "user";
    /** Permisos mínimos para invitados o acceso limitado */
    PermissionLevel["GUEST"] = "guest";
})(PermissionLevel || (exports.PermissionLevel = PermissionLevel = {}));
/**
 * Array con todos los valores válidos de level
 */
exports.PERMISSION_LEVELS = Object.values(PermissionLevel);
/**
 * Descripción legible de cada level
 */
exports.PERMISSION_LEVEL_DESCRIPTIONS = (_a = {},
    _a[PermissionLevel.SYSTEM] = 'Sistema - Acceso crítico',
    _a[PermissionLevel.ADMIN] = 'Administrador - Gestión completa',
    _a[PermissionLevel.MANAGER] = 'Gerente - Supervisión y gestión',
    _a[PermissionLevel.USER] = 'Usuario - Operaciones estándar',
    _a[PermissionLevel.GUEST] = 'Invitado - Acceso limitado',
    _a);
/**
 * Jerarquía de niveles (mayor número = mayor privilegio)
 */
exports.PERMISSION_LEVEL_HIERARCHY = (_b = {},
    _b[PermissionLevel.GUEST] = 1,
    _b[PermissionLevel.USER] = 2,
    _b[PermissionLevel.MANAGER] = 3,
    _b[PermissionLevel.ADMIN] = 4,
    _b[PermissionLevel.SYSTEM] = 5,
    _b);
