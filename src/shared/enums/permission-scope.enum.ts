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
export enum PermissionScope {
  /** Solo puede acceder a sus propios recursos */
  OWN = 'own',
  
  /** Puede acceder a recursos de su equipo */
  TEAM = 'team',
  
  /** Puede acceder a recursos de su sucursal */
  BRANCH = 'branch',
  
  /** Puede acceder a recursos de toda la organización */
  ORGANIZATION = 'organization',
  
  /** Acceso global sin restricciones */
  GLOBAL = 'global',
  
  /** Alcance personalizado basado en condiciones */
  CUSTOM = 'custom',
}

/**
 * Array con todos los valores válidos de scope
 */
export const PERMISSION_SCOPES = Object.values(PermissionScope);

/**
 * Descripción legible de cada scope
 */
export const PERMISSION_SCOPE_DESCRIPTIONS: Record<PermissionScope, string> = {
  [PermissionScope.OWN]: 'Solo recursos propios',
  [PermissionScope.TEAM]: 'Recursos del equipo',
  [PermissionScope.BRANCH]: 'Recursos de la sucursal',
  [PermissionScope.ORGANIZATION]: 'Recursos de la organización',
  [PermissionScope.GLOBAL]: 'Acceso global sin restricciones',
  [PermissionScope.CUSTOM]: 'Alcance personalizado',
};
