import { Controller, Logger, Req } from '@nestjs/common';
import { Request } from 'express';
import { Observable, interval, Subject } from 'rxjs';
import { map, share, startWith } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { SSEConnectionManagerService } from '../services/sse-connection-manager.service';
import { SSEClient } from '../interfaces/sse-client.interface';

/**
 * Controller base abstracto para SSE
 * 
 * Proporciona la funcionalidad común para todos los endpoints SSE:
 * - Configuración de headers HTTP
 * - Registro de conexiones
 * - Cleanup automático
 * - Mensaje inicial de conexión
 * 
 * Los controllers específicos deben extender esta clase e implementar
 * sus propios endpoints usando el método `createSSEStream`
 */
@Controller()
export abstract class BaseSSEController {
  protected readonly logger: Logger;

  constructor(
    protected readonly connectionManager: SSEConnectionManagerService,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Crea un stream SSE para un cliente
   * 
   * @param req Request de Express
   * @param managerId ID del manager/usuario
   * @param tenantId ID del tenant
   * @param metadata Metadata adicional del cliente
   * @param clientIp IP del cliente (opcional, para rate limit cleanup)
   * @param rateLimitGuard Guard de rate limiting (opcional, para cleanup)
   * @returns Observable que mantiene la conexión abierta
   */
  protected createSSEStream(
    req: Request,
    managerId: string,
    tenantId: string,
    metadata?: Record<string, any>,
    clientIp?: string,
    rateLimitGuard?: any,
  ): Observable<any> {
    this.logger.log(`🚀 ENTERED createSSEStream method`);
    const clientId = uuidv4();
    const response = req.res!;
    
    this.logger.log(`🆔 Generated clientId: ${clientId}`);

    // ════════════════════════════════════════════════════════════
    // DESHABILITAR TIMEOUTS ANTES DE CUALQUIER OTRA COSA
    // ════════════════════════════════════════════════════════════
    
    // IMPORTANTE: Esto debe hacerse ANTES de que NestJS envíe los headers
    req.setTimeout(0);
    response.setTimeout(0);
    
    if (req.socket) {
      req.socket.setTimeout(0);
      req.socket.setKeepAlive(true, 30000);
    }
    
    this.logger.debug(`⚙️ Timeouts disabled for ${clientId}`);

    // ════════════════════════════════════════════════════════════
    // NOTA: Los headers SSE son configurados automáticamente por @Sse()
    // NO intentar configurarlos manualmente aquí
    // ════════════════════════════════════════════════════════════

    // ════════════════════════════════════════════════════════════
    // CREAR CLIENTE SSE
    // ════════════════════════════════════════════════════════════

    const client: SSEClient = {
      id: clientId,
      managerId,
      tenantId,
      response,
      connectedAt: new Date(),
      lastHeartbeat: new Date(),
      lastEventId: req.headers['last-event-id'] as string | undefined,
      metadata: {
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.socket.remoteAddress,
        managedByObservable: true, // Marcar para que ConnectionManager no escriba directamente
        ...metadata,
      },
    };

    // ════════════════════════════════════════════════════════════
    // REGISTRAR CONEXIÓN
    // ════════════════════════════════════════════════════════════

    this.logger.log(`📝 Registering client ${clientId}...`);
    this.connectionManager.addConnection(client);
    this.logger.log(`✅ Client ${clientId} registered successfully`);

    // ════════════════════════════════════════════════════════════
    // ENVIAR MENSAJE INICIAL
    // ════════════════════════════════════════════════════════════

    // NO enviar mensaje inicial aquí - causa conflicto con @Sse()
    // this.logger.log(`📤 Sending initial message to ${clientId}...`);
    // const sent = this.connectionManager.sendToClient(clientId, 'connected', {...});

    // ════════════════════════════════════════════════════════════
    // RETORNAR OBSERVABLE
    // ════════════════════════════════════════════════════════════

    this.logger.log(`🔄 Creating observable for client ${clientId}...`);

    // Función de cleanup (será llamada desde el Observable)
    const cleanup = () => {
      this.logger.log(`🧹 Cleaning up client ${clientId}...`);
      this.connectionManager.removeConnection(clientId);
    };

    // ════════════════════════════════════════════════════════════
    // CREAR STREAM SSE QUE NUNCA SE COMPLETA
    // ════════════════════════════════════════════════════════════
    
    this.logger.debug(`🎯 Creating SSE stream for ${clientId}`);
    
    const stream = interval(5000).pipe(
      startWith(-1), // Emitir un valor inicial inmediatamente
      map((tick) => {
        this.logger.debug(`⏰ Tick ${tick} for ${clientId}`);
        
        const eventType = tick === -1 ? 'connected' : 'heartbeat';
        const payload = {
          tick,
          timestamp: new Date().toISOString(),
          clientId,
          message: tick === -1 ? 'Connected successfully' : 'Heartbeat'
        };
        
        // NestJS @Sse() espera un objeto con 'data' y opcionalmente 'type'
        // para enviar eventos con tipo específico en formato SSE
        return {
          type: eventType,
          data: payload
        };
      })
    );

    // ════════════════════════════════════════════════════════════
    // REGISTRAR CLEANUP LISTENERS
    // ════════════════════════════════════════════════════════════

    req.on('close', () => {
      this.logger.log(`🔌 Connection closed for ${clientId}`);
      
      if (clientIp && rateLimitGuard) {
        rateLimitGuard.decrementConnection(clientIp);
      }
      
      cleanup();
    });

    req.on('error', (error) => {
      this.logger.error(`❌ Connection error for ${clientId}:`, error);
      cleanup();
    });

    this.logger.debug(`✅ Stream created for ${clientId}`);
    
    return stream;
  }

  /**
   * Envía un evento de error a un cliente específico
   */
  protected sendError(
    clientId: string,
    error: string,
    code: string,
    details?: any,
  ): void {
    this.connectionManager.sendToClient(clientId, 'error', {
      error,
      code,
      details,
    });
  }

  /**
   * Verifica si un cliente está conectado
   */
  protected isClientConnected(clientId: string): boolean {
    return this.connectionManager.isConnected(clientId);
  }

  /**
   * Obtiene información de un cliente
   */
  protected getClientInfo(clientId: string) {
    return this.connectionManager.getClient(clientId);
  }
}
