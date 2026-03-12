import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationRole, LocalRole } from '../constants/roles.enum';
import { UserRoleService } from '../services/user-role.service';

export const DUAL_ROLES_KEY = 'dualRoles';
export const PROTECT_AIA_KEY = 'protectAIA';

export interface DualRoleConfig {
  authorizationRoles?: AuthorizationRole[];
  localRoles?: LocalRole[];
  allowSuperAdmin?: boolean; // Por defecto true
  allowSuperUser?: boolean; // Por defecto false (cambiar si necesario)
}

@Injectable()
export class DualRoleGuard implements CanActivate {
  private readonly logger = new Logger(DualRoleGuard.name);

  constructor(
    private reflector: Reflector,
    private userRoleService: UserRoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const dualRoleConfig = this.reflector.getAllAndOverride<DualRoleConfig>(
      DUAL_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const protectAIA = this.reflector.getAllAndOverride<boolean>(
      PROTECT_AIA_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no hay configuración específica, permitir acceso
    if (!dualRoleConfig && !protectAIA) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn(
        'Usuario no autenticado intentando acceder a recurso protegido',
      );
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Extraer roles
    const authorizationRole =
      user.authorizationRole || user.role || user.roleId;
    const localRole = user.profile?.role?.id || user.localRole;

    this.logger.debug(
      `Usuario ${user.userId}: AuthRole=${authorizationRole}, LocalRole=${localRole}`,
    );

    // Verificar si es SUPER_ADMIN, usuario autorizado global o ASSISTANT
    const isSuperAdmin = authorizationRole === AuthorizationRole.SUPER_ADMIN;
    const isGlobalAdmin =
      authorizationRole === AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN;
    const isAssistant = authorizationRole === AuthorizationRole.ASSISTANT;

    // Los SUPER_ADMIN, ciertos roles globales y ASSISTANT pueden hacer todo
    if (isSuperAdmin || isGlobalAdmin || isAssistant) {
      this.logger.debug(
        `Usuario ${user.userId} tiene acceso global (AuthRole: ${authorizationRole})`,
      );
      return true;
    }

    // Si hay configuración de roles duales, verificar
    if (dualRoleConfig) {
      const hasAuthRole =
        !dualRoleConfig.authorizationRoles ||
        dualRoleConfig.authorizationRoles.includes(authorizationRole);

      const hasLocalRole =
        !dualRoleConfig.localRoles ||
        dualRoleConfig.localRoles.includes(localRole);

      if (!hasAuthRole || !hasLocalRole) {
        this.logger.warn(
          `Usuario ${user.userId} sin permisos suficientes. ` +
            `Requiere AuthRoles: ${dualRoleConfig.authorizationRoles?.join(', ')} ` +
            `y LocalRoles: ${dualRoleConfig.localRoles?.join(', ')}`,
        );
        throw new ForbiddenException('Permisos insuficientes');
      }
    }

    // Protección especial para usuarios AIA
    if (protectAIA) {
      return await this.checkAIAProtection(
        context,
        user,
        authorizationRole,
        localRole,
      );
    }

    return true;
  }

  private async checkAIAProtection(
    context: ExecutionContext,
    user: any,
    authorizationRole: number,
    localRole: number,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Obtener el usuario objetivo si está en los parámetros o body
    const targetUserId = this.extractTargetUserId(request);

    if (!targetUserId) {
      // Si no hay usuario objetivo, permitir (para endpoints de listado general)
      return true;
    }

    // Verificar si el usuario objetivo es AIA
    return await this.checkIfTargetIsAIAAndProtect(
      targetUserId,
      user.userId,
      authorizationRole,
      localRole,
    );
  }

  private extractTargetUserId(request: any): number | null {
    // Buscar en parámetros de la URL
    const paramUserId = parseInt(
      request.params.userId || request.params.id || request.params.sysUserId,
    );

    if (!isNaN(paramUserId)) {
      return paramUserId;
    }

    // Buscar en el body
    const bodyUserId = parseInt(
      request.body?.userId || request.body?.id || request.body?.sysUserId,
    );

    if (!isNaN(bodyUserId)) {
      return bodyUserId;
    }

    return null;
  }

  private async checkIfTargetIsAIAAndProtect(
    targetUserId: number,
    currentUserId: number,
    authorizationRole: number,
    localRole: number,
  ): Promise<boolean> {
    try {
      // Usar el servicio especializado para verificar permisos
      const canModify = await this.userRoleService.canUserModifyUser(
        currentUserId,
        targetUserId,
        authorizationRole,
      );

      // Log de auditoría
      this.userRoleService.logSecurityAction(
        'MODIFY_USER_ATTEMPT',
        currentUserId,
        targetUserId,
        authorizationRole,
        localRole,
        canModify,
      );

      if (!canModify) {
        throw new ForbiddenException(
          'No tiene permisos para modificar este usuario',
        );
      }

      return true;
    } catch (error) {
      this.logger.error(`Error verificando protección AIA: ${error.message}`);
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Error verificando permisos');
    }
  }
}
