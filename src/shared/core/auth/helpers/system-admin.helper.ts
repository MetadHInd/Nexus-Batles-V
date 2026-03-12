import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationRole } from '../constants/roles.enum';
import { BYPASS_FOR_SYSTEM_ADMIN_KEY } from '../decorators/bypass-for-system-admin.decorator';

export interface UserWithAuthRole {
  authorizationRole?: AuthorizationRole;
  [key: string]: any;
}

/**
 * Verifica si el usuario es un administrador del sistema que puede saltarse validaciones
 */
export function isSystemAdmin(user: UserWithAuthRole): boolean {
  return (
    user?.authorizationRole === AuthorizationRole.ADMIN ||
    user?.authorizationRole === AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN ||
    user?.authorizationRole === AuthorizationRole.SUPER_ADMIN
  );
}

/**
 * Verifica si el endpoint permite bypass para administradores del sistema
 */
export function canBypassForSystemAdmin(
  context: ExecutionContext,
  reflector: Reflector,
): boolean {
  return (
    reflector.get<boolean>(BYPASS_FOR_SYSTEM_ADMIN_KEY, context.getHandler()) ||
    false
  );
}

/**
 * Verifica si el usuario puede saltarse las validaciones de negocio
 */
export function shouldBypassValidation(
  user: UserWithAuthRole,
  context: ExecutionContext,
  reflector: Reflector,
): boolean {
  return canBypassForSystemAdmin(context, reflector) && isSystemAdmin(user);
}