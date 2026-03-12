// src/shared/core/auth/guards/permissions.guard.ts
import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

/**
 * Guard para verificar permisos específicos desde el JWT
 * Debe usarse junto con JwtAuthGuard
 * 
 * Valida que el usuario tenga al menos uno de los permisos requeridos
 * Los permisos se obtienen del JWT (campo 'permissions' o 'permissionsArray')
 * 
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, PermissionsGuard)
 * @RequirePermissions('CREATE_ORDER', 'UPDATE_ORDER')
 * async createOrder() { ... }
 * ```
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener permisos requeridos desde el decorador
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no hay permisos requeridos, permitir acceso
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('⚠️ Usuario no autenticado intentando acceder a ruta protegida');
      throw new ForbiddenException('Usuario no autenticado');
    }

    // 1️⃣ Super Admin bypass - acceso total sin verificar permisos
    if (this.isSuperAdmin(user)) {
      this.logger.debug(`✅ Super Admin bypass: ${user.email || user.username}`);
      return true;
    }

    // 2️⃣ Obtener permisos del usuario desde el JWT
    // Los permisos pueden estar en 'permissions' o 'permissionsArray'
    let userPermissions: string[] = [];
    
    // Debug: Ver qué tipo de dato tenemos
    this.logger.debug(
      `🔍 Tipo de permissions: ${typeof user.permissions}, ` +
      `es array: ${Array.isArray(user.permissions)}, ` +
      `valor: ${JSON.stringify(user.permissions)}`
    );
    
    if (Array.isArray(user.permissions)) {
      userPermissions = user.permissions;
    } else if (Array.isArray(user.permissionsArray)) {
      userPermissions = user.permissionsArray;
    } else {
      // Si existe pero no es array, intentar convertir
      const perms = user.permissions || user.permissionsArray;
      if (perms && typeof perms === 'object') {
        // Podría ser un objeto, intentar obtener los valores
        userPermissions = Object.values(perms).filter((v): v is string => typeof v === 'string');
      }
    }

    if (userPermissions.length === 0) {
      this.logger.warn(
        `❌ Usuario ${user.email || user.username} no tiene permisos en el JWT`
      );
      throw new ForbiddenException(
        `Permisos insuficientes. Se requiere alguno de: ${requiredPermissions.join(', ')}`
      );
    }

    // 3️⃣ Verificar wildcard - acceso total
    if (userPermissions.includes('*') || userPermissions.includes('WILDCARD')) {
      this.logger.debug(`✅ Wildcard permission: ${user.email || user.username}`);
      return true;
    }

    // 4️⃣ Verificar si el usuario tiene al menos uno de los permisos requeridos
    const hasPermission = requiredPermissions.some((requiredPermission) => {
      // Verificación directa
      if (userPermissions.includes(requiredPermission)) {
        return true;
      }

      // Verificación con wildcard a nivel de recurso
      // Ej: "ORDER:*" cubre "CREATE_ORDER", "UPDATE_ORDER", "DELETE_ORDER"
      const resourcePrefix = this.extractResourcePrefix(requiredPermission);
      if (resourcePrefix && userPermissions.includes(`${resourcePrefix}:*`)) {
        return true;
      }

      return false;
    });

    if (!hasPermission) {
      this.logger.warn(
        `❌ Acceso denegado para ${user.email || user.username}. ` +
        `Requiere: [${requiredPermissions.join(', ')}], ` +
        `Tiene: [${userPermissions.join(', ')}]`
      );
      throw new ForbiddenException(
        `Permisos insuficientes. Se requiere alguno de: ${requiredPermissions.join(', ')}`
      );
    }

    this.logger.debug(
      `✅ Acceso permitido para ${user.email || user.username} con permisos: [${userPermissions.join(', ')}]`
    );

    return true;
  }

  /**
   * Verificar si el usuario es Super Admin
   */
  private isSuperAdmin(user: any): boolean {
    // Verificar por rol de autorización (AuthorizationRole.SUPER_ADMIN = 5)
    if (user.authorizationRole === 5 || user.isSuperAdmin === true) {
      return true;
    }

    // Verificar por nombre de rol
    const roleNames = [
      user.authorizationRoleName,
      user.roleName,
      user.role?.name,
    ].filter(Boolean);

    return roleNames.some((name) => 
      name === 'SUPER_ADMIN' || 
      name === 'super_admin' || 
      name === 'SuperAdmin'
    );
  }

  /**
   * Extraer prefijo de recurso de un código de permiso
   * Ej: "CREATE_ORDER" -> "ORDER"
   *     "UPDATE_USER_PROFILE" -> "USER_PROFILE"
   */
  private extractResourcePrefix(permission: string): string | null {
    // Buscar patrones comunes: CREATE_, UPDATE_, DELETE_, VIEW_, READ_
    const match = permission.match(/^(CREATE|UPDATE|DELETE|VIEW|READ|MANAGE)_(.+)$/);
    if (match && match[2]) {
      return match[2]; // Retorna "ORDER", "USER_PROFILE", etc.
    }
    return null;
  }
}
