import {
  Controller,
  Sse,
  Req,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseSSEController } from './base-sse.controller';
import { SSEConnectionManagerService } from '../services/sse-connection-manager.service';
import { SSERateLimitGuard } from '../guards/sse-rate-limit.guard';

/**
 * ⚠️ CONTROLLER DE PRUEBA - NO USAR EN PRODUCCIÓN
 *
 * Este controller permite testear el sistema SSE sin necesidad de
 * autenticación real. Útil para desarrollo y debugging.
 *
 * Endpoints:
 * - GET  /sse/test/stream - Conexión SSE de prueba (sin auth)
 * - POST /sse/test/send-event - Enviar evento a un manager específico
 * - POST /sse/test/force-disconnect - Forzar desconexión de un manager
 * - GET  /sse/test/sessions/:managerId - Ver sesiones activas de un manager
 */
@Controller('sse/test')
export class TestSSEController extends BaseSSEController {
  protected readonly logger = new Logger(TestSSEController.name);

  constructor(
    connectionManager: SSEConnectionManagerService,
    private readonly rateLimitGuard: SSERateLimitGuard,
  ) {
    super(connectionManager);
  }

  /**
   * Endpoint SSE de prueba MÍNIMO (sin BaseSSEController)
   * GET /sse/test/minimal
   */
  @Sse('minimal')
  streamMinimal(@Req() req: Request): Observable<any> {
    this.logger.log(`🔬 MINIMAL SSE Test - Creating basic interval stream`);
    
    return interval(5000).pipe(
      map((index) => {
        this.logger.debug(`📡 Minimal emit: ${index}`);
        return { 
          data: { 
            index, 
            timestamp: new Date().toISOString() 
          } 
        };
      })
    );
  }

  /**
   * Endpoint SSE de prueba (SIN autenticación, SIN rate limiting)
   * GET /sse/test/stream?managerId=test_123&tenantId=tenant_001
   *
   * IMPORTANTE: Este endpoint NO usa autenticación NI rate limiting.
   * Solo para desarrollo/testing.
   */
  @Sse('stream')
  // @UseGuards(SSERateLimitGuard) // Temporalmente deshabilitado
  streamTestEvents(@Req() req: Request): Observable<MessageEvent> {
    // Extraer parámetros de query (ya que no usamos decoradores con guards)
    const managerId = (req.query.managerId as string) || 'test_user';
    const tenantId = (req.query.tenantId as string) || 'test_tenant';

    this.logger.log(
      `🧪 TEST SSE Connection: manager=${managerId}, tenant=${tenantId}`,
    );

    // Obtener IP del cliente para el cleanup del rate limit
    const ip = this.getClientIp(req);
    this.logger.log(`🔍 Client IP: ${ip}`);

    this.logger.log(`🎬 About to call createSSEStream...`);
    
    try {
      // Usar el método base para crear el stream (SIN rate limit)
      const stream = this.createSSEStream(
        req,
        managerId,
        tenantId,
        {
          metadata: {
            isTest: true,
            userAgent: req.headers['user-agent'],
            ip: req.ip,
          },
        },
        undefined, // Sin IP tracking
        undefined, // Sin rate limit guard
      );
      
      this.logger.log(`✅ createSSEStream returned Observable`);
      
      return stream;
    } catch (error) {
      this.logger.error(`💥 ERROR in createSSEStream:`, error);
      throw error;
    }
  }

  /**
   * Extrae la IP del cliente
   */
  private getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded && typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    const realIp = req.headers['x-real-ip'];
    if (realIp && typeof realIp === 'string') {
      return realIp;
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
  }

  /**
   * Enviar un evento de prueba a un manager específico
   * POST /sse/test/send-event
   *
   * Body: {
   *   managerId: string;
   *   eventType: string;
   *   payload: any;
   * }
   */
  @Post('send-event')
  @HttpCode(HttpStatus.OK)
  async sendTestEvent(
    @Body()
    body: {
      managerId: string;
      eventType: string;
      payload: any;
    },
  ): Promise<{
    success: boolean;
    sent: number;
    message: string;
  }> {
    const { managerId, eventType, payload } = body;

    this.logger.log(
      `📤 Sending test event "${eventType}" to manager ${managerId}`,
    );

    const result = this.connectionManager.sendToManager(
      managerId,
      eventType,
      payload,
    );

    return {
      success: result.successCount > 0,
      sent: result.successCount,
      message:
        result.successCount > 0
          ? `Event sent to ${result.successCount} connection(s)`
          : `No active connections for manager ${managerId}`,
    };
  }

  /**
   * Forzar desconexión de todas las sesiones de un manager
   * POST /sse/test/force-disconnect
   *
   * Body: {
   *   managerId: string;
   *   reason?: string;
   * }
   */
  @Post('force-disconnect')
  @HttpCode(HttpStatus.OK)
  async forceDisconnect(
    @Body() body: { managerId: string; reason?: string },
  ): Promise<{
    success: boolean;
    disconnected: number;
    message: string;
  }> {
    const { managerId, reason = 'Forced disconnection via test API' } = body;

    this.logger.warn(
      `🔴 Force disconnecting manager ${managerId}. Reason: ${reason}`,
    );

    const disconnected = this.connectionManager.disconnectManager(
      managerId,
      reason,
    );

    return {
      success: true,
      disconnected,
      message: `Disconnected ${disconnected} session(s) for manager ${managerId}`,
    };
  }

  /**
   * Ver sesiones activas de un manager
   * GET /sse/test/sessions/:managerId
   */
  @Get('sessions/:managerId')
  async getManagerSessions(@Req() req: Request): Promise<{
    managerId: string;
    sessionsCount: number;
    sessions: Array<{
      clientId: string;
      connectedAt: Date;
      lastHeartbeat: Date;
      metadata?: any;
    }>;
  }> {
    const managerId = req.params.managerId as string;

    const sessions =
      this.connectionManager.getManagerSessionsInfo(managerId);

    return {
      managerId,
      sessionsCount: sessions.length,
      sessions,
    };
  }

  /**
   * Toggle del modo sesión única
   * POST /sse/test/single-session-mode
   *
   * Body: { enabled: boolean }
   */
  @Post('single-session-mode')
  @HttpCode(HttpStatus.OK)
  async toggleSingleSessionMode(
    @Body() body: { enabled: boolean },
  ): Promise<{
    success: boolean;
    singleSessionMode: boolean;
    message: string;
  }> {
    const { enabled } = body;

    this.connectionManager.setSingleSessionMode(enabled);
    const currentState = this.connectionManager.isSingleSessionMode();

    this.logger.log(
      `🎮 Single Session Mode ${enabled ? 'ENABLED' : 'DISABLED'}`,
    );

    return {
      success: true,
      singleSessionMode: currentState,
      message: `Single session mode is now ${currentState ? 'ENABLED' : 'DISABLED'}`,
    };
  }

  /**
   * Obtener estado del sistema SSE
   * GET /sse/test/status
   */
  @Get('status')
  async getStatus(): Promise<{
    singleSessionMode: boolean;
    metrics: any;
    timestamp: string;
  }> {
    const metrics = this.connectionManager.getMetrics();
    const singleSessionMode =
      this.connectionManager.isSingleSessionMode();

    return {
      singleSessionMode,
      metrics,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Broadcast de evento a TODOS los clientes conectados
   * POST /sse/test/broadcast
   *
   * Body: {
   *   eventType: string;
   *   payload: any;
   * }
   */
  @Post('broadcast')
  @HttpCode(HttpStatus.OK)
  async broadcast(
    @Body() body: { eventType: string; payload: any },
  ): Promise<{
    success: boolean;
    sent: number;
    message: string;
  }> {
    const { eventType, payload } = body;

    this.logger.log(`📡 Broadcasting event "${eventType}" to all clients`);

    const result = this.connectionManager.broadcast(
      eventType,
      payload,
    );

    return {
      success: result.successCount > 0,
      sent: result.successCount,
      message: `Event broadcasted to ${result.successCount} connection(s)`,
    };
  }
}
