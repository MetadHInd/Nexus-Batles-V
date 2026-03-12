import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';

/**
 * Guard que valida si el usuario tiene permiso can_create_users
 * 
 * El permiso se valida desde el JWT:
 * - restaurants[].can_create_users === true
 * - restaurants[].is_owner === true
 * 
 * Este guard debe usarse junto con JwtAuthGuard
 */
@Injectable()
export class CanCreateUsersGuard implements CanActivate {
  private readonly logger = new Logger(CanCreateUsersGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    console.log('User in CanCreateUsersGuard:', user);
    this.logger.debug(`Checking can_create_users permission for user: ${user.usersub || user.sub}`);

    // Verificar desde el JWT (restaurants viene del token de Authorization)
    if (user.restaurants && Array.isArray(user.restaurants)) {
      const canCreate = user.restaurants.some(
        (r: any) => r.can_create_users === true || r.is_owner === true
      );

      if (canCreate) {
        this.logger.debug(`Permission granted for user: ${user.usersub || user.sub}`);
        return true;
      }
    }

    this.logger.warn(`User ${user.usersub || user.sub} does not have can_create_users permission`);
    throw new ForbiddenException(
      'No tienes permiso para crear usuarios. Necesitas el permiso can_create_users o ser owner de al menos un restaurante.'
    );
  }
}
