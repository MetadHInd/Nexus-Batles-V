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
export enum PermissionLevel {
  /** Permisos de sistema, acceso a configuración crítica */
  SYSTEM = 'system',
  
  /** Permisos administrativos de alto nivel */
  ADMIN = 'admin',
  
  /** Permisos de gestión y supervisión */
  MANAGER = 'manager',
  
  /** Permisos de usuario estándar */
  USER = 'user',
  
  /** Permisos mínimos para invitados o acceso limitado */
  GUEST = 'guest',
}

/**
 * Array con todos los valores válidos de level
 */
export const PERMISSION_LEVELS = Object.values(PermissionLevel);

/**
 * Descripción legible de cada level
 */
export const PERMISSION_LEVEL_DESCRIPTIONS: Record<PermissionLevel, string> = {
  [PermissionLevel.SYSTEM]: 'Sistema - Acceso crítico',
  [PermissionLevel.ADMIN]: 'Administrador - Gestión completa',
  [PermissionLevel.MANAGER]: 'Gerente - Supervisión y gestión',
  [PermissionLevel.USER]: 'Usuario - Operaciones estándar',
  [PermissionLevel.GUEST]: 'Invitado - Acceso limitado',
};

/**
 * Jerarquía de niveles (mayor número = mayor privilegio)
 */
export const PERMISSION_LEVEL_HIERARCHY: Record<PermissionLevel, number> = {
  [PermissionLevel.GUEST]: 1,
  [PermissionLevel.USER]: 2,
  [PermissionLevel.MANAGER]: 3,
  [PermissionLevel.ADMIN]: 4,
  [PermissionLevel.SYSTEM]: 5,
};
