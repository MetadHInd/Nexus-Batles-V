/**
 * Utilidades y Helpers para SSE
 * 
 * Funciones útiles que puedes usar en tu implementación
 */

// ═══════════════════════════════════════════════════════════════
// GENERADORES DE IDs
// ═══════════════════════════════════════════════════════════════

/**
 * Genera un ID único para sesiones SSE
 */
export function generateSessionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `sess_${timestamp}_${random}`;
}

/**
 * Genera un ID único para clientes SSE
 */
export function generateClientId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `client_${timestamp}_${random}`;
}

// ═══════════════════════════════════════════════════════════════
// VALIDADORES DE PAYLOADS
// ═══════════════════════════════════════════════════════════════

/**
 * Valida que un payload tenga los campos requeridos
 */
export function validatePayload<T extends Record<string, any>>(
  payload: any,
  requiredFields: (keyof T)[],
): payload is T {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  return requiredFields.every(
    (field) => payload[field] !== undefined && payload[field] !== null,
  );
}

/**
 * Ejemplo de uso:
 * 
 * const isValid = validatePayload(payload, ['managerId', 'sessionId']);
 * if (!isValid) {
 *   throw new Error('Invalid payload');
 * }
 */

// ═══════════════════════════════════════════════════════════════
// TRANSFORMADORES DE DATOS
// ═══════════════════════════════════════════════════════════════

/**
 * Sanitiza un objeto removiendo campos sensibles
 */
export function sanitizePayload<T extends Record<string, any>>(
  payload: T,
  sensitiveFields: string[] = ['password', 'token', 'secret', 'apiKey'],
): Partial<T> {
  const sanitized = { ...payload };

  sensitiveFields.forEach((field) => {
    if (field in sanitized) {
      delete sanitized[field];
    }
  });

  return sanitized;
}

/**
 * Trunca strings largos en un payload
 */
export function truncatePayload(
  payload: any,
  maxLength: number = 1000,
): any {
  if (typeof payload === 'string') {
    return payload.length > maxLength
      ? payload.substring(0, maxLength) + '...[truncated]'
      : payload;
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => truncatePayload(item, maxLength));
  }

  if (typeof payload === 'object' && payload !== null) {
    const truncated: any = {};
    Object.keys(payload).forEach((key) => {
      truncated[key] = truncatePayload(payload[key], maxLength);
    });
    return truncated;
  }

  return payload;
}

// ═══════════════════════════════════════════════════════════════
// HELPERS DE TIMING
// ═══════════════════════════════════════════════════════════════

/**
 * Crea un delay con Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Ejecuta una función con timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string = 'Operation timed out',
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

/**
 * Retry con backoff exponencial
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    backoffMultiplier?: number;
  } = {},
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 30000,
    backoffMultiplier = 2,
  } = options;

  let lastError: Error;
  let delayMs = initialDelayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        throw lastError;
      }

      await delay(delayMs);
      delayMs = Math.min(delayMs * backoffMultiplier, maxDelayMs);
    }
  }

  throw lastError!;
}

// ═══════════════════════════════════════════════════════════════
// HELPERS DE MÉTRICAS
// ═══════════════════════════════════════════════════════════════

/**
 * Formatea bytes a string legible
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Formatea duración en ms a string legible
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Calcula throughput (eventos/segundo)
 */
export function calculateThroughput(
  eventCount: number,
  durationMs: number,
): number {
  if (durationMs === 0) return 0;
  return (eventCount / (durationMs / 1000));
}

// ═══════════════════════════════════════════════════════════════
// HELPERS DE LOGGING
// ═══════════════════════════════════════════════════════════════

/**
 * Logger personalizado para SSE con colores
 */
export class SSELogger {
  constructor(private context: string) {}

  info(message: string, ...args: any[]) {
    console.log(`[SSE:${this.context}] ℹ️  ${message}`, ...args);
  }

  success(message: string, ...args: any[]) {
    console.log(`[SSE:${this.context}] ✅ ${message}`, ...args);
  }

  warn(message: string, ...args: any[]) {
    console.warn(`[SSE:${this.context}] ⚠️  ${message}`, ...args);
  }

  error(message: string, error?: Error | any) {
    console.error(`[SSE:${this.context}] ❌ ${message}`, error);
  }

  debug(message: string, ...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[SSE:${this.context}] 🔍 ${message}`, ...args);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPERS DE VALIDACIÓN
// ═══════════════════════════════════════════════════════════════

/**
 * Verifica si una string es un UUID válido
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Verifica si un objeto está vacío
 */
export function isEmpty(obj: any): boolean {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  if (Array.isArray(obj)) return obj.length === 0;
  return false;
}

/**
 * Verifica si un evento SSE tiene estructura válida
 */
export function isValidSSEEvent(event: any): boolean {
  return (
    event &&
    typeof event === 'object' &&
    typeof event.event === 'string' &&
    event.data !== undefined
  );
}

// ═══════════════════════════════════════════════════════════════
// HELPERS DE DEBUGGING
// ═══════════════════════════════════════════════════════════════

/**
 * Crea un snapshot del estado SSE para debugging
 */
export function createSSESnapshot(connectionManager: any): object {
  return {
    timestamp: new Date().toISOString(),
    connections: {
      total: connectionManager.getAllConnections().length,
      stats: connectionManager.getStats(),
      metrics: connectionManager.getMetrics(),
    },
    memory: process.memoryUsage(),
    uptime: process.uptime(),
  };
}

/**
 * Pretty print de un objeto
 */
export function prettyPrint(obj: any, indent: number = 2): string {
  return JSON.stringify(obj, null, indent);
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

/**
 * Constantes útiles para SSE
 */
export const SSE_CONSTANTS = {
  // Timeouts
  DEFAULT_HEARTBEAT_INTERVAL: 30000, // 30 segundos
  DEFAULT_CONNECTION_TIMEOUT: 300000, // 5 minutos
  DEFAULT_RECONNECT_INTERVAL: 3000, // 3 segundos

  // Límites
  MAX_PAYLOAD_SIZE: 65536, // 64KB
  MAX_EVENT_NAME_LENGTH: 100,
  MAX_CONNECTIONS_PER_IP: 3,
  MAX_GLOBAL_CONNECTIONS: 10000,

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: 60000, // 1 minuto
  RATE_LIMIT_MAX_ATTEMPTS: 5,

  // Eventos del sistema
  SYSTEM_EVENTS: {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
    HEARTBEAT: 'heartbeat',
    ERROR: 'error',
    RECONNECT: 'reconnect',
  },

  // HTTP Headers
  HEADERS: {
    CONTENT_TYPE: 'text/event-stream',
    CACHE_CONTROL: 'no-cache, no-transform',
    CONNECTION: 'keep-alive',
    X_ACCEL_BUFFERING: 'no',
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// TIPOS ÚTILES
// ═══════════════════════════════════════════════════════════════

/**
 * Tipo para callback de evento SSE
 */
export type SSEEventCallback = (eventType: string, data: any) => void;

/**
 * Tipo para opciones de conexión SSE
 */
export type SSEConnectionConfig = {
  url: string;
  token?: string;
  managerId?: string;
  tenantId?: string;
  reconnect?: boolean;
  maxReconnectAttempts?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onMessage?: SSEEventCallback;
};

/**
 * Tipo para estado de conexión SSE
 */
export type SSEConnectionState =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'reconnecting'
  | 'error';
