import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { EventBusService } from '../../services/service-cache/event-bus.service';
import { SSEConnectionManagerService } from './sse-connection-manager.service';
import {
  SSEEventListener,
  SSEEventListenerRegistry,
  SSEEventBridgeConfig,
} from '../interfaces/sse-event-listener.interface';

/**
 * Event Bridge: Conecta el EventBus con el sistema SSE
 * 
 * Este servicio es el puente entre el EventBus de la aplicación y SSE.
 * Escucha eventos del EventBus y los reenvía a los clientes SSE correspondientes.
 * 
 * Arquitectura:
 * - EventBus emite evento → Bridge lo escucha → SSE envía a clientes
 * 
 * Ventajas:
 * - Desacoplamiento total entre lógica de negocio y transporte
 * - Fácil agregar nuevos eventos sin cambiar código de negocio
 * - Sistema extensible mediante registros dinámicos
 */
@Injectable()
export class SSEEventBridgeService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SSEEventBridgeService.name);

  /** Registro de grupos de listeners */
  private readonly listenerRegistries = new Map<string, SSEEventListenerRegistry>();

  /** Configuración del bridge */
  private config: Required<SSEEventBridgeConfig> = {
    enableLogging: true,
    logLevel: 'info',
    enableMetrics: true,
    eventPrefixes: [],
    ignoredEvents: [],
    maxListenersPerEvent: 10,
  };

  /** Métricas de eventos procesados */
  private eventsProcessed = 0;
  private eventsByType = new Map<string, number>();

  constructor(
    private readonly eventBus: EventBusService,
    private readonly connectionManager: SSEConnectionManagerService,
  ) {}

  // ═══════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════

  onModuleInit() {
    this.logger.log('🌉 Initializing SSE Event Bridge...');
    this.logger.log('✅ SSE Event Bridge ready');
    this.logger.log(
      `📋 Registered ${this.listenerRegistries.size} listener group(s)`,
    );
  }

  onModuleDestroy() {
    this.logger.log('🛑 Shutting down SSE Event Bridge...');
    this.unregisterAllListeners();
  }

  // ═══════════════════════════════════════════════════════════════
  // CONFIGURACIÓN
  // ═══════════════════════════════════════════════════════════════

  /**
   * Actualiza la configuración del bridge
   */
  public updateConfig(config: Partial<SSEEventBridgeConfig>): void {
    this.config = { ...this.config, ...config };
    this.logger.log('⚙️ Event Bridge configuration updated');
  }

  /**
   * Obtiene la configuración actual
   */
  public getConfig(): Required<SSEEventBridgeConfig> {
    return { ...this.config };
  }

  // ═══════════════════════════════════════════════════════════════
  // REGISTRO DE LISTENERS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Registra un grupo de listeners de eventos
   * 
   * @param groupName Nombre del grupo (ej: 'GALATEA', 'AIA', 'USERS')
   * @param listeners Array de listeners a registrar
   * @param enabled Si el grupo está activo (default: true)
   * 
   * @example
   * ```typescript
   * bridge.registerEventListeners('GALATEA', [
   *   {
   *     eventName: 'GALATEA_PROGRESS',
   *     handler: (payload) => {
   *       connectionManager.sendToManager(
   *         payload.managerId,
   *         'GALATEA_PROGRESS',
   *         payload
   *       );
   *     }
   *   },
   *   {
   *     eventName: 'GALATEA_RESPONSE',
   *     handler: (payload) => { ... }
   *   }
   * ]);
   * ```
   */
  public registerEventListeners(
    groupName: string,
    listeners: SSEEventListener[],
    enabled = true,
  ): void {
    if (this.listenerRegistries.has(groupName)) {
      this.logger.warn(`Group "${groupName}" already registered, replacing...`);
      this.unregisterGroup(groupName);
    }

    // Crear registro
    const registry: SSEEventListenerRegistry = {
      groupName,
      listeners,
      enabled,
    };

    // Registrar listeners en el EventBus
    if (enabled) {
      listeners.forEach((listener) => {
        this.registerListenerInternal(groupName, listener);
      });
    }

    // Guardar registro
    this.listenerRegistries.set(groupName, registry);

    this.logger.log(
      `✅ Registered ${listeners.length} listener(s) for group "${groupName}"`,
    );
  }

  /**
   * Registra un listener individual (internal)
   */
  private registerListenerInternal(groupName: string, listener: SSEEventListener): void {
    const { eventName, handler, options } = listener;

    // Verificar si el evento debe ser ignorado
    if (this.config.ignoredEvents.includes(eventName)) {
      this.logger.debug(`Ignoring event "${eventName}" (in ignored list)`);
      return;
    }

    // Crear wrapper del handler
    const wrappedHandler = async (payload: any) => {
      try {
        // Validar payload si hay validador
        if (options?.validator) {
          if (!options.validator(payload)) {
            this.logger.warn(
              `Invalid payload for event "${eventName}", skipping SSE send`,
            );
            return;
          }
        }

        // Ejecutar handler
        await handler(payload);

        // Actualizar métricas
        if (this.config.enableMetrics) {
          this.eventsProcessed++;
          this.eventsByType.set(
            eventName,
            (this.eventsByType.get(eventName) || 0) + 1,
          );
        }

        // Logging
        if (this.config.enableLogging && this.config.logLevel === 'debug') {
          this.logger.debug(
            `🔄 Event "${eventName}" processed by group "${groupName}"`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Error processing event "${eventName}" in group "${groupName}":`,
          error,
        );
      }
    };

    // Registrar en EventBus
    this.eventBus.on(eventName, wrappedHandler);

    this.logger.debug(`📌 Listener registered: ${groupName}.${eventName}`);
  }

  /**
   * Registra un listener individual directamente
   * Útil para listeners ad-hoc sin grupo
   */
  public registerListener(
    eventName: string,
    handler: (payload: any) => void | Promise<void>,
    options?: SSEEventListener['options'],
  ): void {
    const listener: SSEEventListener = {
      eventName,
      handler,
      options,
    };

    this.registerListenerInternal('_adhoc', listener);
  }

  // ═══════════════════════════════════════════════════════════════
  // GESTIÓN DE GRUPOS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Habilita un grupo de listeners
   */
  public enableGroup(groupName: string): void {
    const registry = this.listenerRegistries.get(groupName);
    if (!registry) {
      this.logger.warn(`Group "${groupName}" not found`);
      return;
    }

    if (registry.enabled) {
      this.logger.debug(`Group "${groupName}" already enabled`);
      return;
    }

    // Registrar listeners
    registry.listeners.forEach((listener) => {
      this.registerListenerInternal(groupName, listener);
    });

    registry.enabled = true;
    this.logger.log(`✅ Group "${groupName}" enabled`);
  }

  /**
   * Deshabilita un grupo de listeners
   */
  public disableGroup(groupName: string): void {
    const registry = this.listenerRegistries.get(groupName);
    if (!registry) {
      this.logger.warn(`Group "${groupName}" not found`);
      return;
    }

    if (!registry.enabled) {
      this.logger.debug(`Group "${groupName}" already disabled`);
      return;
    }

    registry.enabled = false;
    this.logger.log(`⏸️ Group "${groupName}" disabled`);
  }

  /**
   * Desregistra un grupo completo
   */
  public unregisterGroup(groupName: string): void {
    const registry = this.listenerRegistries.get(groupName);
    if (!registry) {
      this.logger.warn(`Group "${groupName}" not found`);
      return;
    }

    // Desregistrar listeners
    registry.listeners.forEach((listener) => {
      this.eventBus.off(listener.eventName, listener.handler);
    });

    this.listenerRegistries.delete(groupName);
    this.logger.log(`🗑️ Group "${groupName}" unregistered`);
  }

  /**
   * Desregistra todos los grupos
   */
  private unregisterAllListeners(): void {
    const groups = Array.from(this.listenerRegistries.keys());
    groups.forEach((group) => this.unregisterGroup(group));
    this.logger.log(`Unregistered ${groups.length} group(s)`);
  }

  // ═══════════════════════════════════════════════════════════════
  // HELPERS PARA ENVÍO
  // ═══════════════════════════════════════════════════════════════

  /**
   * Helper: Envía evento SSE basado en managerId del payload
   * 
   * Útil para la mayoría de casos donde el payload incluye managerId
   */
  public sendToManagerFromPayload(
    eventName: string,
    payload: any & { managerId: string },
  ): void {
    if (!payload.managerId) {
      this.logger.warn(`Payload missing managerId for event "${eventName}"`);
      return;
    }

    this.connectionManager.sendToManager(
      payload.managerId,
      eventName,
      payload,
    );
  }

  /**
   * Helper: Envía evento SSE basado en tenantId del payload
   */
  public sendToTenantFromPayload(
    eventName: string,
    payload: any & { tenantId: string },
  ): void {
    if (!payload.tenantId) {
      this.logger.warn(`Payload missing tenantId for event "${eventName}"`);
      return;
    }

    this.connectionManager.sendToTenant(
      payload.tenantId,
      eventName,
      payload,
    );
  }

  /**
   * Helper: Broadcast evento SSE a todos los clientes
   */
  public broadcastFromPayload(eventName: string, payload: any): void {
    this.connectionManager.broadcast(eventName, payload);
  }

  // ═══════════════════════════════════════════════════════════════
  // CONSULTAS Y MÉTRICAS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Lista todos los grupos registrados
   */
  public listGroups(): string[] {
    return Array.from(this.listenerRegistries.keys());
  }

  /**
   * Obtiene información de un grupo
   */
  public getGroupInfo(groupName: string): SSEEventListenerRegistry | undefined {
    return this.listenerRegistries.get(groupName);
  }

  /**
   * Obtiene métricas del bridge
   */
  public getMetrics() {
    return {
      eventsProcessed: this.eventsProcessed,
      eventsByType: Object.fromEntries(this.eventsByType),
      activeGroups: Array.from(this.listenerRegistries.values())
        .filter((r) => r.enabled)
        .map((r) => ({
          name: r.groupName,
          listeners: r.listeners.length,
        })),
      totalGroups: this.listenerRegistries.size,
    };
  }

  /**
   * Resetea métricas
   */
  public resetMetrics(): void {
    this.eventsProcessed = 0;
    this.eventsByType.clear();
    this.logger.log('📊 Bridge metrics reset');
  }
}
