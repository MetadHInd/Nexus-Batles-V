/**
 * Configuración de un listener de eventos para SSE
 */
export interface SSEEventListener {
  /** Nombre del evento a escuchar */
  eventName: string;

  /** Handler del evento */
  handler: (payload: any) => void | Promise<void>;

  /** Opciones adicionales del listener */
  options?: {
    /** Solo escuchar una vez */
    once?: boolean;

    /** Prioridad de ejecución (mayor = primero) */
    priority?: number;

    /** Validador de payload */
    validator?: (payload: any) => boolean;
  };
}

/**
 * Registro de listeners para el Event Bridge
 */
export interface SSEEventListenerRegistry {
  /** Nombre del grupo de listeners (ej: 'GALATEA', 'AIA', 'USERS') */
  groupName: string;

  /** Lista de listeners del grupo */
  listeners: SSEEventListener[];

  /** Indica si el grupo está activo */
  enabled: boolean;
}

/**
 * Configuración del Event Bridge
 */
export interface SSEEventBridgeConfig {
  /** Habilitar logging de eventos */
  enableLogging?: boolean;

  /** Nivel de logging (debug, info, warn, error) */
  logLevel?: 'debug' | 'info' | 'warn' | 'error';

  /** Habilitar métricas de eventos */
  enableMetrics?: boolean;

  /** Prefijos de eventos a escuchar (ej: ['GALATEA_', 'AIA_']) */
  eventPrefixes?: string[];

  /** Eventos a ignorar */
  ignoredEvents?: string[];

  /** Máximo de listeners por evento */
  maxListenersPerEvent?: number;
}
