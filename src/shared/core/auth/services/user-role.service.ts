import { Injectable, Logger } from '@nestjs/common';
import { ServiceCache } from '../../services/service-cache/service-cache';
import { AuthorizationRole, LocalRole } from '../constants/roles.enum';

@Injectable()
export class UserRoleService {
  private readonly logger = new Logger(UserRoleService.name);

  /**
   * Verificar si un usuario puede modificar usuarios AIA
   */
  canModifyAIAUsers(authorizationRole: number): boolean {
    const canModify =
      authorizationRole === AuthorizationRole.SUPER_ADMIN ||
      authorizationRole === AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN ||
      authorizationRole === AuthorizationRole.ASSISTANT;

    this.logger.debug(
      `AuthRole ${authorizationRole} puede modificar AIA: ${canModify}`,
    );

    return canModify;
  }

  /**
   * Verificar si un usuario tiene acceso global (puede hacer todo)
   */
  hasGlobalAccess(authorizationRole: number): boolean {
    const hasAccess =
      authorizationRole === AuthorizationRole.SUPER_ADMIN ||
      authorizationRole === AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN ||
      authorizationRole === AuthorizationRole.ASSISTANT;

    this.logger.debug(
      `AuthRole ${authorizationRole} tiene acceso global: ${hasAccess}`,
    );

    return hasAccess;
  }

  /**
   * Obtener información completa de roles de un usuario
   */
  async getUserRoleInfo(userId: number): Promise<{
    authorizationRole?: number;
    localRole?: number;
    isAIA: boolean;
    canModifyAIA: boolean;
    hasGlobalAccess: boolean;
  }> {
    try {
      const user = await ServiceCache.Database.Prisma.sysUser.findUnique({
        where: { idsysUser: userId },
        include: { role_sysUser_roleTorole: true },
      });

      if (!user) {
        return {
          isAIA: false,
          canModifyAIA: false,
          hasGlobalAccess: false,
        };
      }

      const localRole = user.role_sysUser_roleTorole?.idrole || user.role || 3; // Default to User role
      const isAIA = localRole === LocalRole.AIA;

      // El authorizationRole debería venir del JWT, aquí no lo tenemos
      // Este método es principalmente para verificar el rol local

      return {
        localRole,
        isAIA,
        canModifyAIA: false, // Esto se determina con el authorizationRole del JWT
        hasGlobalAccess: false, // Esto se determina con el authorizationRole del JWT
      };
    } catch (error) {
      this.logger.error(
        `Error obteniendo información de roles para usuario ${userId}: ${error.message}`,
      );
      return {
        isAIA: false,
        canModifyAIA: false,
        hasGlobalAccess: false,
      };
    }
  }

  /**
   * Verificar permisos de modificación entre usuarios
   */
  async canUserModifyUser(
    currentUserId: number,
    targetUserId: number,
    currentAuthRole: number,
  ): Promise<boolean> {
    try {
      // Si es el mismo usuario, permitir auto-edición básica
      if (currentUserId === targetUserId) {
        return true;
      }

      // Si tiene acceso global, puede modificar cualquiera
      if (this.hasGlobalAccess(currentAuthRole)) {
        return true;
      }
      return true;
    } catch (error) {
      this.logger.error(
        `Error verificando permisos de modificación entre usuarios ${currentUserId} -> ${targetUserId}: ${error.message}`,
      );
      return false;
    }
  }

  /**
   * Logs para auditoría de acciones sensibles
   */
  logSecurityAction(
    action: string,
    currentUserId: number,
    targetUserId?: number,
    authRole?: number,
    localRole?: number,
    allowed?: boolean,
  ): void {
    this.logger.log(
      `SECURITY: ${action} - Usuario: ${currentUserId} ` +
        `(AuthRole: ${authRole}, LocalRole: ${localRole}) ` +
        `${targetUserId ? `-> Target: ${targetUserId}` : ''} ` +
        `Resultado: ${allowed ? 'PERMITIDO' : 'DENEGADO'}`,
    );
  }
}
