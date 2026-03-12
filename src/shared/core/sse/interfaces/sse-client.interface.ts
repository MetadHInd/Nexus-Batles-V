import { Response } from 'express';

/**
 * Representa un cliente SSE conectado
 */
export interface SSEClient {
  /** ID único del cliente (UUID) */
  id: string;

  /** ID del manager/usuario al que pertenece el cliente */
  managerId: string;

  /** ID del tenant (multi-tenancy) */
  tenantId: string;

  /** Stream de respuesta HTTP de Node.js */
  response: Response;

  /** Timestamp de cuando se conectó */
  connectedAt: Date;

  /** Timestamp del último heartbeat enviado */
  lastHeartbeat: Date;

  /** Último event ID recibido (para reconexión) */
  lastEventId?: string;

  /** Metadata adicional del cliente */
  metadata?: SSEClientMetadata;
}

/**
 * Metadata adicional de un cliente SSE
 */
export interface SSEClientMetadata {
  /** User agent del cliente */
  userAgent?: string;

  /** IP del cliente */
  ip?: string;

  /** ID de sesión (si aplica) */
  sessionId?: string;

  /** Información adicional personalizada */
  [key: string]: any;
}

/**
 * Opciones de configuración para conexiones SSE
 */
export interface SSEConnectionOptions {
  /** Intervalo de heartbeat en ms (default: 30000) */
  heartbeatInterval?: number;

  /** Timeout de conexión en ms (default: 300000 = 5 min) */
  connectionTimeout?: number;

  /** Número máximo de reintentos de reconexión (default: 5) */
  maxRetries?: number;

  /** Intervalo entre reintentos en ms (default: 3000) */
  retryInterval?: number;

  /** Tamaño máximo de payload en bytes (default: 65536 = 64KB) */
  maxPayloadSize?: number;

  /** Habilitar compresión de mensajes (default: false) */
  enableCompression?: boolean;
}

/**
 * Estadísticas de conexiones SSE
 */
export interface SSEConnectionStats {
  /** Total de conexiones activas */
  totalConnections: number;

  /** Número de managers con conexiones activas */
  totalManagers: number;

  /** Desglose de conexiones por manager */
  connectionsByManager: Array<{
    managerId: string;
    connections: number;
  }>;

  /** Desglose de conexiones por tenant */
  connectionsByTenant?: Array<{
    tenantId: string;
    connections: number;
  }>;

  /** Timestamp de las estadísticas */
  timestamp: Date;
}
