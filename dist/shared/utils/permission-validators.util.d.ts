import { PermissionScope, PermissionLevel } from '../enums';
export declare function isValidScope(scope: string): scope is PermissionScope;
export declare function isValidLevel(level: string): level is PermissionLevel;
export declare function hasEqualOrHigherLevel(level1: PermissionLevel, level2: PermissionLevel): boolean;
export declare function getHighestLevel(level1: PermissionLevel, level2: PermissionLevel): PermissionLevel;
export declare function sortLevelsByHierarchy(levels: PermissionLevel[]): PermissionLevel[];
export declare function scopeRequiresContext(scope: PermissionScope): boolean;
export declare function isScopeMoreRestrictive(scope1: PermissionScope, scope2: PermissionScope): boolean;
