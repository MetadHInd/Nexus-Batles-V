import { 
  PermissionScope, 
  PERMISSION_SCOPES,
  PermissionLevel,
  PERMISSION_LEVELS,
  PERMISSION_LEVEL_HIERARCHY
} from '../enums';

/**
 * 🔍 UTILIDADES PARA VALIDACIÓN DE PERMISOS
 */

/**
 * Valida si un scope es válido
 */
export function isValidScope(scope: string): scope is PermissionScope {
  return PERMISSION_SCOPES.includes(scope as PermissionScope);
}

/**
 * Valida si un level es válido
 */
export function isValidLevel(level: string): level is PermissionLevel {
  return PERMISSION_LEVELS.includes(level as PermissionLevel);
}

/**
 * Compara dos niveles de permisos
 * @returns true si level1 >= level2 en la jerarquía
 */
export function hasEqualOrHigherLevel(
  level1: PermissionLevel,
  level2: PermissionLevel,
): boolean {
  return PERMISSION_LEVEL_HIERARCHY[level1] >= PERMISSION_LEVEL_HIERARCHY[level2];
}

/**
 * Obtiene el nivel más alto entre dos
 */
export function getHighestLevel(
  level1: PermissionLevel,
  level2: PermissionLevel,
): PermissionLevel {
  return PERMISSION_LEVEL_HIERARCHY[level1] >= PERMISSION_LEVEL_HIERARCHY[level2]
    ? level1
    : level2;
}

/**
 * Ordena niveles de menor a mayor privilegio
 */
export function sortLevelsByHierarchy(levels: PermissionLevel[]): PermissionLevel[] {
  return [...levels].sort(
    (a, b) => PERMISSION_LEVEL_HIERARCHY[a] - PERMISSION_LEVEL_HIERARCHY[b],
  );
}

/**
 * Verifica si un scope requiere contexto adicional
 * (team, branch, organization necesitan IDs adicionales)
 */
export function scopeRequiresContext(scope: PermissionScope): boolean {
  return [
    PermissionScope.TEAM,
    PermissionScope.BRANCH,
    PermissionScope.ORGANIZATION,
  ].includes(scope);
}

/**
 * Verifica si un scope es más restrictivo que otro
 * own < team < branch < organization < global
 */
export function isScopeMoreRestrictive(
  scope1: PermissionScope,
  scope2: PermissionScope,
): boolean {
  const scopeHierarchy: Record<PermissionScope, number> = {
    [PermissionScope.OWN]: 1,
    [PermissionScope.TEAM]: 2,
    [PermissionScope.BRANCH]: 3,
    [PermissionScope.ORGANIZATION]: 4,
    [PermissionScope.GLOBAL]: 5,
    [PermissionScope.CUSTOM]: 0, // Custom no tiene jerarquía definida
  };

  return scopeHierarchy[scope1] < scopeHierarchy[scope2];
}
