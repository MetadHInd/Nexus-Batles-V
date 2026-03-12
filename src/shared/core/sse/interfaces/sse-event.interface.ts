/**
 * Estructura de un evento SSE
 */
export interface SSEEvent<T = any> {
  /** ID único del evento (opcional, para reconexión) */
  id?: string;

  /** Nombre/tipo del evento */
  event: string;

  /** Payload del evento */
  data: T;

  /** Tiempo de reintento en ms (opcional) */
  retry?: number;

  /** Timestamp del evento */
  timestamp: string;
}

/**
 * Interfaz para formatear eventos SSE
 */
export interface SSEEventFormatter {
  /**
   * Formatea un evento al formato SSE estándar
   * @param event Evento a formatear
   * @returns String en formato SSE
   */
  format<T>(event: SSEEvent<T>): string;
}

/**
 * Opciones para enviar eventos SSE
 */
export interface SSESendOptions {
  /** Filtrar clientes antes de enviar */
  filter?: (client: any) => boolean;

  /** Transformar payload antes de enviar */
  transform?: (data: any) => any;

  /** Validar payload antes de enviar */
  validate?: (data: any) => boolean;

  /** Retry en caso de fallo */
  retry?: {
    attempts: number;
    delayMs: number;
  };
}

/**
 * Resultado de envío de eventos SSE
 */
export interface SSESendResult {
  /** Número de clientes a los que se envió exitosamente */
  successCount: number;

  /** Número de clientes que fallaron */
  failureCount: number;

  /** IDs de clientes que fallaron */
  failedClientIds: string[];

  /** Timestamp del envío */
  timestamp: Date;
}
