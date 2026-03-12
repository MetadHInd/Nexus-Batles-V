import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import {
  SSEClient,
  SSEConnectionOptions,
  SSEConnectionStats,
} from '../interfaces/sse-client.interface';
import {
  SSEEvent,
  SSESendOptions,
  SSESendResult,
} from '../interfaces/sse-event.interface';

/**
 * Servicio principal de gestión de conexiones SSE
 * 
 * Responsabilidades:
 * - Registrar y gestionar conexiones de clientes
 * - Enviar eventos a clientes específicos o grupos
 * - Mantener heartbeat para conexiones activas
 * - Limpiar conexiones inactivas
 * - Proporcionar estadísticas de conexiones
 */
@Injectable()
export class SSEConnectionManagerService implements OnModuleDestroy {
  private readonly logger = new Logger(SSEConnectionManagerService.name);

  // ═══════════════════════════════════════════════════════════════
  // ESTRUCTURAS DE DATOS
  // ═══════════════════════════════════════════════════════════════

  /** Map principal de conexiones: clientId -> SSEClient */
  private readonly connections = new Map<string, SSEClient>();

  /** Índice por managerId: managerId -> Set<clientId> */
  private readonly managerConnections = new Map<string, Set<string>>();

  /** Índice por tenantId: tenantId -> Set<clientId> */
  private readonly tenantConnections = new Map<string, Set<string>>();

  /** Interval de heartbeat */
  private heartbeatInterval: NodeJS.Timeout | null = null;

  /** Configuración de conexiones */
  private readonly config: Required<SSEConnectionOptions> & {
    singleSessionPerManager: boolean;
  } = {
    heartbeatInterval: 5000, // 5 segundos
    connectionTimeout: 300000, // 5 minutos
    maxRetries: 5,
    retryInterval: 3000, // 3 segundos
    maxPayloadSize: 65536, // 64KB
    enableCompression: false,
    singleSessionPerManager: true, // Sesión única por manager (como videojuegos)
  };

  /** Contador de eventos enviados (para métricas) */
  private eventsSentCounter = 0;

  /** Contador de bytes enviados (para métricas) */
  private bytesSentCounter = 0;

  /** Timestamp de inicio del servicio */
  private readonly startTime = Date.now();

  // ═══════════════════════════════════════════════════════════════
  // CONFIGURACIÓN Y LIFECYCLE
  // ═══════════════════════════════════════════════════════════════

  constructor() {
    this.logger.log('🚀 SSE Connection Manager initialized');
    this.startHeartbeat();
  }

  /**
   * Actualiza la configuración de conexiones
   */
  public updateConfig(config: Partial<SSEConnectionOptions>): void {
    Object.assign(this.config, config);
    this.logger.log('⚙️ SSE configuration updated');
  }

  /**
   * Cleanup al destruir el módulo
   */
  onModuleDestroy(): void {
    this.logger.log('🛑 Shutting down SSE Connection Manager...');
    this.stopHeartbeat();
    this.disconnectAll();
  }

  // ═══════════════════════════════════════════════════════════════
  // GESTIÓN DE CONEXIONES
  // ═══════════════════════════════════════════════════════════════

  /**
   * Registra una nueva conexión SSE
   */
  public addConnection(client: SSEClient): void {
    // 🎮 SINGLE SESSION POLICY: Desconectar sesiones anteriores del mismo manager
    if (this.config.singleSessionPerManager) {
      this.disconnectPreviousSessions(client.managerId, client.id);
    }

    // Validar que no exista ya
    if (this.connections.has(client.id)) {
      this.logger.warn(`Client ${client.id} already connected, replacing...`);
      this.removeConnection(client.id);
    }

    // Agregar a map principal
    this.connections.set(client.id, client);

    // Indexar por managerId
    if (!this.managerConnections.has(client.managerId)) {
      this.managerConnections.set(client.managerId, new Set());
    }
    this.managerConnections.get(client.managerId)!.add(client.id);

    // Indexar por tenantId
    if (!this.tenantConnections.has(client.tenantId)) {
      this.tenantConnections.set(client.tenantId, new Set());
    }
    this.tenantConnections.get(client.tenantId)!.add(client.id);

    this.logger.log(
      `✅ SSE Connected: ${client.id} | Manager: ${client.managerId} | Tenant: ${client.tenantId}`,
    );
    this.logger.debug(`Total connections: ${this.connections.size}`);
  }

  /**
   * Remueve una conexión SSE
   */
  public removeConnection(clientId: string, reason?: string): void {
    const client = this.connections.get(clientId);
    if (!client) {
      this.logger.debug(`Client ${clientId} not found for removal`);
      return;
    }

    // Remover de índice de manager
    this.managerConnections.get(client.managerId)?.delete(clientId);
    if (this.managerConnections.get(client.managerId)?.size === 0) {
      this.managerConnections.delete(client.managerId);
    }

    // Remover de índice de tenant
    this.tenantConnections.get(client.tenantId)?.delete(clientId);
    if (this.tenantConnections.get(client.tenantId)?.size === 0) {
      this.tenantConnections.delete(client.tenantId);
    }

    // Remover de map principal
    this.connections.delete(clientId);

    // Cerrar stream si aún está abierto
    try {
      if (client.response && !client.response.writableEnded) {
        client.response.end();
      }
    } catch (error) {
      this.logger.warn(`Error closing response for ${clientId}:`, error);
    }

    const logMessage = reason
      ? `❌ SSE Disconnected: ${clientId} (Reason: ${reason})`
      : `❌ SSE Disconnected: ${clientId}`;
    this.logger.log(logMessage);
    this.logger.debug(`Total connections: ${this.connections.size}`);
  }

  /**
   * Desconecta todos los clientes
   */
  private disconnectAll(): void {
    const clientIds = Array.from(this.connections.keys());
    clientIds.forEach((clientId) => this.removeConnection(clientId));
    this.logger.log(`Disconnected ${clientIds.length} client(s)`);
  }

  /**
   * 🎮 SINGLE SESSION POLICY
   * Desconecta sesiones anteriores de un manager (excepto la nueva)
   * Comportamiento tipo videojuego/streaming: solo una sesión activa por cuenta
   */
  private disconnectPreviousSessions(
    managerId: string,
    newClientId: string,
  ): void {
    const existingClients = this.managerConnections.get(managerId);

    if (!existingClients || existingClients.size === 0) {
      return; // No hay sesiones previas
    }

    // Obtener clientes existentes (excepto el nuevo que se está conectando)
    const clientsToDisconnect = Array.from(existingClients).filter(
      (clientId) => clientId !== newClientId,
    );

    if (clientsToDisconnect.length === 0) {
      return;
    }

    this.logger.warn(
      `🎮 Single Session Policy: Manager ${managerId} connecting from new device. Disconnecting ${clientsToDisconnect.length} previous session(s)...`,
    );

    // Notificar a cada cliente anterior que será desconectado
    clientsToDisconnect.forEach((clientId) => {
      const client = this.connections.get(clientId);
      if (!client) return;

      try {
        // Enviar evento de desconexión antes de cerrar
        const disconnectMessage = this.formatSSEMessage(
          'session_terminated',
          {
            reason: 'new_session_detected',
            message:
              'Tu sesión fue cerrada porque iniciaste sesión desde otro dispositivo',
            timestamp: new Date().toISOString(),
            reconnect: false, // No intentar reconectar automáticamente
          },
        );

        // Intentar enviar el mensaje (si el stream aún está abierto)
        if (client.response.writable) {
          client.response.write(disconnectMessage);
        }

        // Esperar un momento para que el mensaje llegue
        setTimeout(() => {
          this.removeConnection(clientId, 'New session from another device');
        }, 100);
      } catch (error) {
        this.logger.error(
          `Error notifying client ${clientId} of disconnection:`,
          error,
        );
        // Desconectar de todos modos
        this.removeConnection(clientId, 'New session from another device');
      }
    });

    this.logger.log(
      `✅ Previous sessions disconnected. New session established for manager ${managerId}`,
    );
  }

  /**
   * Obtiene un cliente por ID
   */
  public getClient(clientId: string): SSEClient | undefined {
    return this.connections.get(clientId);
  }

  /**
   * Verifica si un cliente está conectado
   */
  public isConnected(clientId: string): boolean {
    return this.connections.has(clientId);
  }

  // ═══════════════════════════════════════════════════════════════
  // CONSULTAS Y BÚSQUEDAS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Obtiene todos los clientes de un manager
   */
  public getManagerConnections(managerId: string): SSEClient[] {
    const clientIds = this.managerConnections.get(managerId);
    if (!clientIds) return [];

    return Array.from(clientIds)
      .map((id) => this.connections.get(id))
      .filter((client): client is SSEClient => client !== undefined);
  }

  /**
   * Obtiene todos los clientes de un tenant
   */
  public getTenantConnections(tenantId: string): SSEClient[] {
    const clientIds = this.tenantConnections.get(tenantId);
    if (!clientIds) return [];

    return Array.from(clientIds)
      .map((id) => this.connections.get(id))
      .filter((client): client is SSEClient => client !== undefined);
  }

  /**
   * Obtiene todos los clientes conectados
   */
  public getAllConnections(): SSEClient[] {
    return Array.from(this.connections.values());
  }

  // ═══════════════════════════════════════════════════════════════
  // ENVÍO DE EVENTOS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Envía un evento a un cliente específico
   */
  public sendToClient(
    clientId: string,
    event: string,
    data: any,
    options?: SSESendOptions,
  ): boolean {
    const client = this.connections.get(clientId);
    if (!client) {
      this.logger.debug(`Client ${clientId} not found`);
      return false;
    }

    // Aplicar filtro si existe
    if (options?.filter && !options.filter(client)) {
      this.logger.debug(`Client ${clientId} filtered out`);
      return false;
    }

    // Validar payload
    if (options?.validate && !options.validate(data)) {
      this.logger.warn(`Invalid payload for client ${clientId}`);
      return false;
    }

    // Transformar payload si es necesario
    const transformedData = options?.transform ? options.transform(data) : data;

    try {
      // IMPORTANTE: Si el cliente tiene metadata.managedByObservable,
      // NO escribir directamente al response (conflicto con @Sse())
      if (client.metadata?.managedByObservable) {
        this.logger.debug(
          `Skipping direct write for ${clientId} (managed by Observable)`,
        );
        return true; // Retornar true para no causar errores
      }

      // Verificar si el stream puede escribir
      if (!client.response.writable) {
        this.logger.warn(`Client ${clientId} stream not writable`);
        this.removeConnection(clientId);
        return false;
      }

      // Formatear mensaje SSE
      const formatted = this.formatSSEMessage(event, transformedData);

      // Validar tamaño de payload
      if (formatted.length > this.config.maxPayloadSize) {
        this.logger.error(
          `Payload too large for ${clientId}: ${formatted.length} bytes`,
        );
        return false;
      }

      // Escribir al stream
      const written = client.response.write(formatted);

      if (!written) {
        this.logger.warn(`Backpressure on client ${clientId}`);
      }

      // Actualizar métricas
      this.eventsSentCounter++;
      this.bytesSentCounter += formatted.length;

      return true;
    } catch (error) {
      this.logger.error(`Failed to send to ${clientId}:`, error);
      this.removeConnection(clientId);
      return false;
    }
  }

  /**
   * Envía un evento a todos los clientes de un manager
   */
  public sendToManager(
    managerId: string,
    event: string,
    data: any,
    options?: SSESendOptions,
  ): SSESendResult {
    const clients = this.getManagerConnections(managerId);

    if (clients.length === 0) {
      this.logger.debug(`No clients connected for manager ${managerId}`);
      return {
        successCount: 0,
        failureCount: 0,
        failedClientIds: [],
        timestamp: new Date(),
      };
    }

    return this.sendToMultiple(clients, event, data, options);
  }

  /**
   * Envía un evento a todos los clientes de un tenant
   */
  public sendToTenant(
    tenantId: string,
    event: string,
    data: any,
    options?: SSESendOptions,
  ): SSESendResult {
    const clients = this.getTenantConnections(tenantId);

    if (clients.length === 0) {
      this.logger.debug(`No clients connected for tenant ${tenantId}`);
      return {
        successCount: 0,
        failureCount: 0,
        failedClientIds: [],
        timestamp: new Date(),
      };
    }

    return this.sendToMultiple(clients, event, data, options);
  }

  /**
   * Broadcast: envía un evento a todos los clientes
   */
  public broadcast(
    event: string,
    data: any,
    options?: SSESendOptions,
  ): SSESendResult {
    const clients = this.getAllConnections();

    if (clients.length === 0) {
      this.logger.debug('No clients connected for broadcast');
      return {
        successCount: 0,
        failureCount: 0,
        failedClientIds: [],
        timestamp: new Date(),
      };
    }

    return this.sendToMultiple(clients, event, data, options);
  }

  /**
   * Envía un evento a múltiples clientes
   */
  private sendToMultiple(
    clients: SSEClient[],
    event: string,
    data: any,
    options?: SSESendOptions,
  ): SSESendResult {
    let successCount = 0;
    const failedClientIds: string[] = [];

    clients.forEach((client) => {
      if (this.sendToClient(client.id, event, data, options)) {
        successCount++;
      } else {
        failedClientIds.push(client.id);
      }
    });

    const result: SSESendResult = {
      successCount,
      failureCount: failedClientIds.length,
      failedClientIds,
      timestamp: new Date(),
    };

    if (failedClientIds.length > 0) {
      this.logger.warn(
        `Failed to send to ${failedClientIds.length}/${clients.length} clients`,
      );
    }

    return result;
  }

  // ═══════════════════════════════════════════════════════════════
  // FORMATEO DE MENSAJES SSE
  // ═══════════════════════════════════════════════════════════════

  /**
   * Formatea un mensaje al estándar SSE
   */
  private formatSSEMessage(event: string, data: any): string {
    const id = Date.now().toString();
    const timestamp = new Date().toISOString();

    // Agregar timestamp al payload si no existe
    const payload =
      typeof data === 'object' && data !== null
        ? { ...data, timestamp }
        : { value: data, timestamp };

    // Formato estándar SSE
    return [
      `id: ${id}`,
      `event: ${event}`,
      `data: ${JSON.stringify(payload)}`,
      '\n', // Doble newline indica fin de mensaje
    ].join('\n');
  }

  // ═══════════════════════════════════════════════════════════════
  // HEARTBEAT Y MANTENIMIENTO
  // ═══════════════════════════════════════════════════════════════

  /**
   * Inicia el sistema de heartbeat
   */
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      this.logger.warn('Heartbeat already started');
      return;
    }

    this.heartbeatInterval = setInterval(() => {
      this.performHeartbeat();
    }, this.config.heartbeatInterval);

    this.logger.log(
      `💓 Heartbeat started (interval: ${this.config.heartbeatInterval}ms)`,
    );
  }

  /**
   * Detiene el sistema de heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
      this.logger.log('💓 Heartbeat stopped');
    }
  }

  /**
   * Ejecuta un ciclo de heartbeat
   */
  private performHeartbeat(): void {
    const now = Date.now();
    let timedOutCount = 0;
    let heartbeatsSent = 0;

    this.connections.forEach((client, clientId) => {
      const timeSinceLastBeat = now - client.lastHeartbeat.getTime();

      // Verificar timeout
      if (timeSinceLastBeat > this.config.connectionTimeout) {
        this.logger.warn(
          `Client ${clientId} timed out (${timeSinceLastBeat}ms since last heartbeat)`,
        );
        this.removeConnection(clientId);
        timedOutCount++;
        return;
      }

      // Enviar heartbeat
      const sent = this.sendToClient(clientId, 'heartbeat', {
        serverTime: now,
      });

      if (sent) {
        client.lastHeartbeat = new Date();
        heartbeatsSent++;
      }
    });

    // Log solo si hay actividad
    if (this.connections.size > 0) {
      this.logger.debug(
        `💓 Heartbeat: ${heartbeatsSent} sent, ${timedOutCount} timed out`,
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ESTADÍSTICAS Y MÉTRICAS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Obtiene estadísticas de conexiones
   */
  public getStats(): SSEConnectionStats {
    const connectionsByManager = Array.from(
      this.managerConnections.entries(),
    ).map(([managerId, clients]) => ({
      managerId,
      connections: clients.size,
    }));

    const connectionsByTenant = Array.from(
      this.tenantConnections.entries(),
    ).map(([tenantId, clients]) => ({
      tenantId,
      connections: clients.size,
    }));

    return {
      totalConnections: this.connections.size,
      totalManagers: this.managerConnections.size,
      connectionsByManager,
      connectionsByTenant,
      timestamp: new Date(),
    };
  }

  /**
   * Obtiene métricas detalladas
   */
  public getMetrics() {
    const stats = this.getStats();
    const uptime = Date.now() - this.startTime;

    return {
      ...stats,
      uptime: {
        milliseconds: uptime,
        seconds: Math.floor(uptime / 1000),
        formatted: this.formatUptime(uptime),
      },
      throughput: {
        eventsSent: this.eventsSentCounter,
        bytesSent: this.bytesSentCounter,
        eventsPerSecond:
          this.eventsSentCounter / (uptime / 1000) || 0,
        bytesPerSecond:
          this.bytesSentCounter / (uptime / 1000) || 0,
      },
      config: this.config,
    };
  }

  /**
   * Formatea uptime a string legible
   */
  private formatUptime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  /**
   * Resetea contadores de métricas
   */
  public resetMetrics(): void {
    this.eventsSentCounter = 0;
    this.bytesSentCounter = 0;
    this.logger.log('📊 Metrics reset');
  }

  // ═══════════════════════════════════════════════════════════════
  // GESTIÓN DE SESIÓN ÚNICA
  // ═══════════════════════════════════════════════════════════════

  /**
   * Habilita/Deshabilita el modo de sesión única
   */
  public setSingleSessionMode(enabled: boolean): void {
    this.config.singleSessionPerManager = enabled;
    this.logger.log(
      `🎮 Single Session Mode: ${enabled ? 'ENABLED' : 'DISABLED'}`,
    );
  }

  /**
   * Obtiene el estado del modo sesión única
   */
  public isSingleSessionMode(): boolean {
    return this.config.singleSessionPerManager;
  }

  /**
   * Desconecta manualmente todas las sesiones de un manager
   * Útil para forzar cierre de sesión (ej: cambio de contraseña, ban, etc.)
   */
  public disconnectManager(
    managerId: string,
    reason: string = 'Forced disconnection',
  ): number {
    const clients = this.getManagerConnections(managerId);

    if (clients.length === 0) {
      this.logger.debug(`No active sessions for manager ${managerId}`);
      return 0;
    }

    this.logger.warn(
      `🔴 Force disconnect: ${clients.length} session(s) for manager ${managerId}. Reason: ${reason}`,
    );

    // Notificar a cada cliente
    clients.forEach((client) => {
      try {
        // Enviar evento de desconexión forzada
        const disconnectMessage = this.formatSSEMessage(
          'session_terminated',
          {
            reason: 'forced_disconnection',
            message: reason,
            timestamp: new Date().toISOString(),
            reconnect: false,
          },
        );

        if (client.response.writable) {
          client.response.write(disconnectMessage);
        }

        setTimeout(() => {
          this.removeConnection(client.id, reason);
        }, 100);
      } catch (error) {
        this.logger.error(`Error disconnecting client ${client.id}:`, error);
        this.removeConnection(client.id, reason);
      }
    });

    return clients.length;
  }

  /**
   * Obtiene información de sesiones activas de un manager
   */
  public getManagerSessionsInfo(managerId: string): Array<{
    clientId: string;
    connectedAt: Date;
    lastHeartbeat: Date;
    metadata?: any;
  }> {
    const clients = this.getManagerConnections(managerId);

    return clients.map((client) => ({
      clientId: client.id,
      connectedAt: client.connectedAt,
      lastHeartbeat: client.lastHeartbeat,
      metadata: client.metadata,
    }));
  }
}
