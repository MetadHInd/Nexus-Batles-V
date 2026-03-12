import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LocalRole, Role } from '../constants/roles.enum';

@Injectable()
export class LocalRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<LocalRole[]>(
      'localRoles',
      context.getHandler(),
    );
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context
      .switchToHttp()
      .getRequest<{ user: {authorizationRole:Role; localRole: LocalRole; roles: LocalRole[] } }>();
    const user = request.user;

    
    if(user.authorizationRole===Role.ADMIN || user.authorizationRole===Role.ADMIN_AUTHORIZED_ORIGIN)
    {
        return true;
    }
    
    console.log("Has Role ",user.authorizationRole);
    console.log(
      `🔍 LocalRoleGuard: Verificando roles locales para el usuario: ${user?.localRole}`,
    );
    console.log(
      `🔍 LocalRoleGuard: Roles requeridos: ${JSON.stringify(requiredRoles)}`,
    );
    console.log(
      `🔍 LocalRoleGuard: Roles del usuario: ${JSON.stringify(user?.roles || [user?.localRole])}`,
    );

    if (!user) return false;

    // Check if user has the required role (single role or array of roles)
    const userRoles = Array.isArray(user.roles) ? user.roles : [user.localRole];
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}