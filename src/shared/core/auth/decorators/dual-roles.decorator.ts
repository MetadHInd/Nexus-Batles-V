import { SetMetadata } from '@nestjs/common';
import { AuthorizationRole, LocalRole } from '../constants/roles.enum';

export const DUAL_ROLES_KEY = 'dualRoles';
export const PROTECT_AIA_KEY = 'protectAIA';

export interface DualRoleConfig {
  authorizationRoles?: AuthorizationRole[];
  localRoles?: LocalRole[];
  allowSuperAdmin?: boolean;
  allowSuperUser?: boolean;
}

/**
 * Decorador para requerir roles específicos (Authorization + Local)
 * Los SUPER_ADMIN siempre tienen acceso
 *
 * @param config Configuración de roles requeridos
 *
 * @example
 * // Solo ADMIN de authorization Y Manager local
 * @RequireDualRoles({
 *   authorizationRoles: [AuthorizationRole.ADMIN],
 *   localRoles: [LocalRole.MANAGER]
 * })
 *
 * // Solo roles de authorization
 * @RequireDualRoles({
 *   authorizationRoles: [AuthorizationRole.ADMIN, AuthorizationRole.SUPERVISOR]
 * })
 *
 * // Solo roles locales
 * @RequireDualRoles({
 *   localRoles: [LocalRole.OWNER, LocalRole.REGIONAL_MANAGER]
 * })
 */
export const RequireDualRoles = (config: DualRoleConfig) =>
  SetMetadata(DUAL_ROLES_KEY, config);

/**
 * Decorador para proteger usuarios AIA
 * Solo SUPER_ADMIN y ADMIN_AUTHORIZED_ORIGIN pueden modificar usuarios AIA
 *
 * @example
 * @ProtectAIAUsers()
 * @Put(':id')
 * async updateUser(@Param('id') id: number, @Body() data: UpdateUserDto) {
 *   // Solo SUPER_ADMIN puede modificar si el usuario objetivo es AIA
 * }
 */
export const ProtectAIAUsers = () => SetMetadata(PROTECT_AIA_KEY, true);

/**
 * Decorador para endpoints que solo pueden ser accedidos por roles de authorization específicos
 */
export const RequireAuthorizationRole = (...roles: AuthorizationRole[]) =>
  RequireDualRoles({ authorizationRoles: roles });

/**
 * Decorador para endpoints que solo pueden ser accedidos por roles locales específicos
 */
export const RequireLocalRole = (...roles: LocalRole[]) =>
  RequireDualRoles({ localRoles: roles });

/**
 * Decorador para endpoints que solo SUPER_ADMIN puede acceder
 */
export const SuperAdminOnly = () =>
  RequireDualRoles({ authorizationRoles: [AuthorizationRole.SUPER_ADMIN] });

/**
 * Decorador para endpoints que solo administradores globales pueden acceder
 */
export const GlobalAdminOnly = () =>
  RequireDualRoles({
    authorizationRoles: [
      AuthorizationRole.SUPER_ADMIN,
      AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN,
    ],
  });

/**
 * Decorador para endpoints que requieren ser Owner o Regional Manager local
 */
export const ManagersOnly = () =>
  RequireDualRoles({
    localRoles: [LocalRole.OWNER, LocalRole.REGIONAL_MANAGER],
  });

/**
 * Decorador para endpoints donde nadie puede tocar usuarios AIA excepto SUPER_ADMIN
 */
export const AIAProtected = () => ProtectAIAUsers();

/**
 * Combinación común: Requiere ciertos roles Y protege usuarios AIA
 */
export const RequireDualRolesAndProtectAIA = (config: DualRoleConfig) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    RequireDualRoles(config)(target, propertyKey, descriptor);
    ProtectAIAUsers()(target, propertyKey, descriptor);
  };
};
