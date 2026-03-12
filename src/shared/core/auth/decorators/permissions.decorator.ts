// src/shared/core/auth/decorators/permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';

/**
 * Clave para metadata de permisos requeridos
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorador para especificar los permisos requeridos para acceder a un endpoint
 * 
 * @example
 * ```typescript
 * @RequirePermissions('CREATE_ORDER', 'UPDATE_ORDER')
 * @UseGuards(JwtAuthGuard, PermissionsGuard)
 * async createOrder() { ... }
 * ```
 * 
 * El usuario debe tener AL MENOS UNO de los permisos especificados (OR logic)
 * Para requerir TODOS los permisos, usa el guard múltiples veces o crea una lógica custom
 */
export const RequirePermissions = (...permissions: string[]) => 
  SetMetadata(PERMISSIONS_KEY, permissions);
