import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * Guard de autenticación para endpoints SSE
 * 
 * SSE usa EventSource API nativa que NO soporta headers personalizados,
 * por lo tanto el token JWT debe enviarse como query parameter.
 * 
 * Flujo:
 * 1. Cliente obtiene JWT normal (POST /auth/login)
 * 2. Cliente conecta SSE: GET /sse/stream?token=JWT_TOKEN
 * 3. Este guard valida el token del query param
 * 
 * Seguridad:
 * - El token en query params es visible en logs/history
 * - Usar tokens de corta duración (5-15 min)
 * - Considerar tokens de un solo uso para SSE
 * - HTTPS obligatorio en producción
 */
@Injectable()
export class SSEAuthGuard implements CanActivate {
  private readonly logger = new Logger(SSEAuthGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Extraer token del query param
    const token = this.extractToken(request);

    if (!token) {
      this.logger.warn(`SSE auth failed: No token provided (IP: ${request.ip})`);
      throw new UnauthorizedException('Token not provided');
    }

    try {
      // Verificar y decodificar JWT
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Agregar payload al request para uso posterior
      (request as any).user = payload;

      this.logger.debug(
        `SSE auth successful: ${payload.sub || payload.userId} (IP: ${request.ip})`,
      );

      return true;
    } catch (error) {
      this.logger.warn(
        `SSE auth failed: Invalid token (IP: ${request.ip})`,
        error instanceof Error ? error.message : '',
      );
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Extrae el token del query param o header
   * Prioridad: query param > header (para compatibilidad)
   */
  private extractToken(request: Request): string | undefined {
    // 1. Intentar query param (método principal para SSE)
    if (request.query.token && typeof request.query.token === 'string') {
      return request.query.token;
    }

    // 2. Fallback: Authorization header (para testing con curl/postman)
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return undefined;
  }
}
