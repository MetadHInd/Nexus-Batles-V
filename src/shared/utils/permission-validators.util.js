"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidScope = isValidScope;
exports.isValidLevel = isValidLevel;
exports.hasEqualOrHigherLevel = hasEqualOrHigherLevel;
exports.getHighestLevel = getHighestLevel;
exports.sortLevelsByHierarchy = sortLevelsByHierarchy;
exports.scopeRequiresContext = scopeRequiresContext;
exports.isScopeMoreRestrictive = isScopeMoreRestrictive;
var enums_1 = require("../enums");
/**
 * 🔍 UTILIDADES PARA VALIDACIÓN DE PERMISOS
 */
/**
 * Valida si un scope es válido
 */
function isValidScope(scope) {
    return enums_1.PERMISSION_SCOPES.includes(scope);
}
/**
 * Valida si un level es válido
 */
function isValidLevel(level) {
    return enums_1.PERMISSION_LEVELS.includes(level);
}
/**
 * Compara dos niveles de permisos
 * @returns true si level1 >= level2 en la jerarquía
 */
function hasEqualOrHigherLevel(level1, level2) {
    return enums_1.PERMISSION_LEVEL_HIERARCHY[level1] >= enums_1.PERMISSION_LEVEL_HIERARCHY[level2];
}
/**
 * Obtiene el nivel más alto entre dos
 */
function getHighestLevel(level1, level2) {
    return enums_1.PERMISSION_LEVEL_HIERARCHY[level1] >= enums_1.PERMISSION_LEVEL_HIERARCHY[level2]
        ? level1
        : level2;
}
/**
 * Ordena niveles de menor a mayor privilegio
 */
function sortLevelsByHierarchy(levels) {
    return __spreadArray([], levels, true).sort(function (a, b) { return enums_1.PERMISSION_LEVEL_HIERARCHY[a] - enums_1.PERMISSION_LEVEL_HIERARCHY[b]; });
}
/**
 * Verifica si un scope requiere contexto adicional
 * (team, branch, organization necesitan IDs adicionales)
 */
function scopeRequiresContext(scope) {
    return [
        enums_1.PermissionScope.TEAM,
        enums_1.PermissionScope.BRANCH,
        enums_1.PermissionScope.ORGANIZATION,
    ].includes(scope);
}
/**
 * Verifica si un scope es más restrictivo que otro
 * own < team < branch < organization < global
 */
function isScopeMoreRestrictive(scope1, scope2) {
    var _a;
    var scopeHierarchy = (_a = {},
        _a[enums_1.PermissionScope.OWN] = 1,
        _a[enums_1.PermissionScope.TEAM] = 2,
        _a[enums_1.PermissionScope.BRANCH] = 3,
        _a[enums_1.PermissionScope.ORGANIZATION] = 4,
        _a[enums_1.PermissionScope.GLOBAL] = 5,
        _a[enums_1.PermissionScope.CUSTOM] = 0,
        _a);
    return scopeHierarchy[scope1] < scopeHierarchy[scope2];
}
