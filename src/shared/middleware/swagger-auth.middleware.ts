import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ServiceCache } from '../core/services/service-cache/service-cache';
import { Role } from '../core/auth/constants/roles.enum';

@Injectable()
export class SwaggerAuthMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    
    // Permitir acceso a archivos estáticos de Swagger
    if (
      req.path.includes('/swagger-ui') ||
      req.path.includes('.css') ||
      req.path.includes('.js')
    ) {
      return next();
    }

    // Verificar autenticación para la documentación principal
    if (req.path === '/api-docs' || req.path === '/api-docs/') {
      const token = this.extractTokenFromRequest(req);
        console.log(`🔍 Swagger Auth: Verificando token `,token);

      if (!token) {
        console.log(
          `🔒 Swagger Auth: Acceso denegado a ${req.path} - Token no encontrado`,
        );
        return this.redirectToLogin(res);
      }

      try {
        // Verificar el token JWT usando ServiceCache
        const payload =
          await ServiceCache.Authorization.TokenService.validateToken(token);

        console.log(
          `🔍 Swagger Auth: Token encontrado en ${req.path}:`,
          payload,
        );

        // Verificar que el usuario tenga permisos y roles de administrador
        const userId = payload.usersub || payload.sub;
        if (
          !payload ||
          !userId ||
          (payload.role !== Role.ADMIN &&
            payload.role !== Role.ADMIN_AUTHORIZED_ORIGIN &&
            payload.role !== Role.SUPER_ADMIN)
        ) {
          console.log(
            `🔒 Swagger Auth: Token inválido o sin permisos de administrador para ${req.path}`,
          );
          console.log(
            `🔒 Usuario: ${userId || 'N/A'}, Rol: ${payload?.role || 'N/A'}`,
          );
          return this.redirectToLogin(res);
        }

        console.log(
          `✅ Swagger Auth: Acceso autorizado a ${req.path} para admin ${payload} con rol ${payload.role}`,
        );
        // Token válido y rol de administrador, permitir acceso
        return next();
      } catch (error) {
        console.log(
          `🔒 Swagger Auth: Token expirado/inválido para ${req.path}:`,
          error.message,
        );
        // Token inválido o expirado
        return this.redirectToLogin(res);
      }
    }

    // Para otras rutas, continuar normalmente
    next();
  }

  private extractTokenFromRequest(req: Request): string | null {
    // Buscar token en diferentes lugares

    // 1. Header Authorization
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // 2. Cookie
    const cookieToken =
      req.cookies?.['access_token'] ||
      req.cookies?.['token'] ||
      req.cookies?.['authToken'];

    if (cookieToken) {
      console.log('Cookie token:', cookieToken);
      return cookieToken;
    }

    // 3. Query parameter (para casos especiales)
    const queryToken = req.query.token as string;
    if (queryToken) {
      return queryToken;
    }

    return null;
  }

  private redirectToLogin(res: Response) {
    // Redireccionar directamente a Login.html
    console.log('🔄 Swagger Auth: Redirigiendo a Login.html');
    res.redirect(302, '/Login.html');
  }
}
