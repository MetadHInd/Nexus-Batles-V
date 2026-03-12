// src/shared/core/auth/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../constants/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      this.logger.warn(
        'Usuario no autenticado intentando acceder a recurso protegido',
      );
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Compatibilidad con ambas estructuras de usuario
    const userRoleId = user.role?.id || user.role || user.roleId;

    if (!userRoleId) {
      this.logger.warn(`Usuario ${user.userId || user.id} sin rol definido`);
      throw new ForbiddenException('Usuario sin rol asignado');
    }

    const hasRole = requiredRoles.some((role) => {
      return typeof role === 'number'
        ? role === userRoleId
        : role === userRoleId;
    });

    if (!hasRole) {
      this.logger.warn(
        `Usuario ${user.userId || user.id} con rol ${userRoleId} intentó acceder a recurso que requiere roles: ${requiredRoles.join(', ')}`,
      );
      throw new ForbiddenException(
        `Acceso prohibido: Requiere uno de los siguientes roles: ${requiredRoles.join(', ')}`,
      );
    }

    this.logger.debug(
      `Usuario ${user.userId || user.id} con rol ${userRoleId} autorizado para acceder al recurso`,
    );

    return true;
  }
}
