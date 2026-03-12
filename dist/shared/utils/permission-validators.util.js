"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidScope = isValidScope;
exports.isValidLevel = isValidLevel;
exports.hasEqualOrHigherLevel = hasEqualOrHigherLevel;
exports.getHighestLevel = getHighestLevel;
exports.sortLevelsByHierarchy = sortLevelsByHierarchy;
exports.scopeRequiresContext = scopeRequiresContext;
exports.isScopeMoreRestrictive = isScopeMoreRestrictive;
const enums_1 = require("../enums");
function isValidScope(scope) {
    return enums_1.PERMISSION_SCOPES.includes(scope);
}
function isValidLevel(level) {
    return enums_1.PERMISSION_LEVELS.includes(level);
}
function hasEqualOrHigherLevel(level1, level2) {
    return enums_1.PERMISSION_LEVEL_HIERARCHY[level1] >= enums_1.PERMISSION_LEVEL_HIERARCHY[level2];
}
function getHighestLevel(level1, level2) {
    return enums_1.PERMISSION_LEVEL_HIERARCHY[level1] >= enums_1.PERMISSION_LEVEL_HIERARCHY[level2]
        ? level1
        : level2;
}
function sortLevelsByHierarchy(levels) {
    return [...levels].sort((a, b) => enums_1.PERMISSION_LEVEL_HIERARCHY[a] - enums_1.PERMISSION_LEVEL_HIERARCHY[b]);
}
function scopeRequiresContext(scope) {
    return [
        enums_1.PermissionScope.TEAM,
        enums_1.PermissionScope.BRANCH,
        enums_1.PermissionScope.ORGANIZATION,
    ].includes(scope);
}
function isScopeMoreRestrictive(scope1, scope2) {
    const scopeHierarchy = {
        [enums_1.PermissionScope.OWN]: 1,
        [enums_1.PermissionScope.TEAM]: 2,
        [enums_1.PermissionScope.BRANCH]: 3,
        [enums_1.PermissionScope.ORGANIZATION]: 4,
        [enums_1.PermissionScope.GLOBAL]: 5,
        [enums_1.PermissionScope.CUSTOM]: 0,
    };
    return scopeHierarchy[scope1] < scopeHierarchy[scope2];
}
//# sourceMappingURL=permission-validators.util.js.map