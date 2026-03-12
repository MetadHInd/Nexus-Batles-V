import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Guard de Rate Limiting para endpoints SSE
 * 
 * Previene ataques de Connection Flooding donde un atacante
 * intenta abrir miles de conexiones SSE para agotar recursos.
 * 
 * Estrategia:
 * - Limitar conexiones por IP
 * - Limitar intentos de conexión en ventana de tiempo
 * - Limitar conexiones globales
 * 
 * Configuración recomendada:
 * - Max 5 conexiones por IP por minuto
 * - Max 3 conexiones simultáneas por IP
 * - Max 10,000 conexiones globales
 */
@Injectable()
export class SSERateLimitGuard implements CanActivate {
  private readonly logger = new Logger(SSERateLimitGuard.name);

  /** Map de intentos de conexión por IP: IP -> timestamps[] */
  private readonly connectionAttempts = new Map<string, number[]>();

  /** Map de conexiones activas por IP: IP -> count */
  private readonly activeConnections = new Map<string, number>();

  /** Configuración de rate limiting */
  private readonly config = {
    /** Máximo de intentos de conexión en la ventana de tiempo */
    maxAttemptsPerWindow: 5,
    /** Ventana de tiempo en ms (default: 1 minuto) */
    windowMs: 60000,
    /** Máximo de conexiones simultáneas por IP */
    maxConcurrentPerIp: 1, // ✅ Solo 1 conexión activa por IP
    /** Máximo de conexiones globales (todas las IPs) */
    maxGlobalConnections: 10000,
    /** Habilitar whitelist de IPs (localhost, IPs internas, etc.) */
    enableWhitelist: false, // ⚠️ DESHABILITADO para testing - habilitar en producción
    /** IPs whitelisted */
    whitelist: ['127.0.0.1', '::1', '::ffff:127.0.0.1'],
  };

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = this.getClientIp(request);

    // Verificar whitelist
    if (this.config.enableWhitelist && this.config.whitelist.includes(ip)) {
      this.logger.debug(`IP ${ip} whitelisted, skipping rate limit`);
      return true;
    }

    // 1. Verificar límite de conexiones globales
    const globalConnections = this.getTotalActiveConnections();
    if (globalConnections >= this.config.maxGlobalConnections) {
      this.logger.error(
        `🚫 Global connection limit reached: ${globalConnections}`,
      );
      throw new HttpException(
        'Server at maximum capacity. Please try again later.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // 2. Verificar límite de conexiones concurrentes por IP
    const currentConnections = this.activeConnections.get(ip) || 0;
    if (currentConnections >= this.config.maxConcurrentPerIp) {
      this.logger.warn(
        `🚫 IP ${ip} exceeded concurrent connection limit: ${currentConnections}`,
      );
      throw new HttpException(
        `Too many concurrent connections from your IP. Maximum: ${this.config.maxConcurrentPerIp}`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 3. Verificar rate limit de intentos de conexión
    const now = Date.now();
    const attempts = this.connectionAttempts.get(ip) || [];

    // Limpiar intentos antiguos fuera de la ventana
    const recentAttempts = attempts.filter(
      (timestamp) => now - timestamp < this.config.windowMs,
    );

    if (recentAttempts.length >= this.config.maxAttemptsPerWindow) {
      this.logger.warn(
        `🚫 IP ${ip} exceeded connection attempt limit: ${recentAttempts.length} attempts in ${this.config.windowMs}ms`,
      );
      throw new HttpException(
        `Too many connection attempts. Please wait ${Math.ceil(this.config.windowMs / 1000)} seconds.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 4. Registrar intento actual
    recentAttempts.push(now);
    this.connectionAttempts.set(ip, recentAttempts);

    // 5. Incrementar contador de conexiones activas
    this.activeConnections.set(ip, currentConnections + 1);

    // IMPORTANTE: NO configurar cleanup aquí con request.on('close')
    // En SSE, el request se mantiene abierto y 'close' se dispara incorrectamente
    // El ConnectionManager se encargará de decrementar cuando la conexión realmente cierre

    this.logger.debug(
      `✅ Rate limit passed for IP ${ip} (${currentConnections + 1}/${this.config.maxConcurrentPerIp} connections)`,
    );

    return true;
  }

  /**
   * Extrae la IP real del cliente
   * Considera proxies y load balancers
   */
  private getClientIp(request: Request): string {
    // Intentar headers de proxy primero
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded && typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }

    const realIp = request.headers['x-real-ip'];
    if (realIp && typeof realIp === 'string') {
      return realIp;
    }

    // Fallback a IP directa
    return request.ip || request.socket.remoteAddress || 'unknown';
  }

  /**
   * Decrementa el contador de conexiones activas para una IP
   * Llamado por el ConnectionManager cuando una conexión SSE realmente se cierra
   */
  public decrementConnection(ip: string): void {
    const current = this.activeConnections.get(ip) || 0;
    if (current > 0) {
      this.activeConnections.set(ip, current - 1);
      this.logger.debug(
        `Connection closed for IP ${ip} (${current - 1} remaining)`,
      );
    }

    // Limpiar si no hay más conexiones
    if (current - 1 <= 0) {
      this.activeConnections.delete(ip);
    }
  }

  /**
   * Obtiene el total de conexiones activas
   */
  private getTotalActiveConnections(): number {
    let total = 0;
    this.activeConnections.forEach((count) => {
      total += count;
    });
    return total;
  }

  /**
   * Actualiza la configuración de rate limiting
   */
  public updateConfig(config: Partial<typeof this.config>): void {
    Object.assign(this.config, config);
    this.logger.log('⚙️ Rate limit configuration updated');
  }

  /**
   * Obtiene estadísticas de rate limiting
   */
  public getStats() {
    return {
      activeConnections: Object.fromEntries(this.activeConnections),
      totalActiveConnections: this.getTotalActiveConnections(),
      ipsWithAttempts: this.connectionAttempts.size,
      config: this.config,
    };
  }

  /**
   * Resetea rate limiting para una IP específica
   * Útil para desbloquear IPs manualmente
   */
  public resetIp(ip: string): void {
    this.connectionAttempts.delete(ip);
    this.activeConnections.delete(ip);
    this.logger.log(`🔓 Rate limit reset for IP ${ip}`);
  }

  /**
   * Limpia datos antiguos (ejecutar periódicamente)
   */
  public cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    // Limpiar intentos antiguos
    this.connectionAttempts.forEach((attempts, ip) => {
      const recent = attempts.filter(
        (timestamp) => now - timestamp < this.config.windowMs,
      );
      if (recent.length === 0) {
        this.connectionAttempts.delete(ip);
        cleaned++;
      } else if (recent.length < attempts.length) {
        this.connectionAttempts.set(ip, recent);
      }
    });

    if (cleaned > 0) {
      this.logger.debug(`🧹 Cleaned up ${cleaned} old rate limit entries`);
    }
  }
}
