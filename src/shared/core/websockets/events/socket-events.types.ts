/**
 * Definición de todos los tipos de eventos y payloads para WebSockets.
 * Agrega aquí nuevos eventos y sus tipos de datos.
 */

// Ejemplo: Evento de mensaje de usuario
export enum SocketEventTypes {
  USER_MESSAGE = 'USER_MESSAGE',
  USER_JOIN = 'USER_JOIN',
  USER_LEAVE = 'USER_LEAVE',
}

export interface UserMessagePayload {
  userId: string;
  message: string;
}

/**
 * Enum para la dirección de los eventos WebSocket.
 */
export enum SocketEventDirection {
  IN = 'in',
  OUT = 'out',
  BOTH = 'both',
}

export interface UserJoinPayload {
  userId: string;
  username: string;
}

export interface UserLeavePayload {
  userId: string;
}

export interface SocketEventPayloadMap {
  [SocketEventTypes.USER_MESSAGE]: UserMessagePayload;
  [SocketEventTypes.USER_JOIN]: UserJoinPayload;
  [SocketEventTypes.USER_LEAVE]: UserLeavePayload;
}
