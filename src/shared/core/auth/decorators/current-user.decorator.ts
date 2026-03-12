import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJWTUserResponse, IUserProfile } from '../interfaces/user.interface';

/**
 * Decorador para obtener el usuario actual autenticado con su token JWT
 *
 * @example
 * // Obtener usuario completo con token
 * async getProfile(@CurrentUser() user: IJWTUserResponse) {
 *   return user; // { userId, profile, token/jwt }
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IJWTUserResponse & { token?: string; jwt?: string } => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    
    // Intentar extraer el JWT del header de autorización
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // Añadir el token al objeto user si existe
      if (user) {
        user.token = token;
        user.jwt = token;
      }
    }
    
    return user;
  },
);

/**
 * Decorador específico para obtener el perfil del usuario
 */
export const CurrentUserProfile = createParamDecorator(
  (data: undefined, ctx: ExecutionContext): IUserProfile | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.profile;
  },
);

/**
 * Decorador para obtener el ID del usuario actual
 */
export const CurrentUserId = createParamDecorator(
  (data: undefined, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.userId;
  },
);

/**
 * Decorador para obtener solo el JWT del usuario autenticado
 */
export const CurrentUserJWT = createParamDecorator(
  (data: undefined, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    return undefined;
  },
);

/**
 * Decorador para obtener la branch actual (cuando se usa BranchAccessGuard)
 */
export const CurrentBranchId = createParamDecorator(
  (data: undefined, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentBranchId;
  },
);
