import {
  SocketEventTypes,
  SocketEventPayloadMap,
} from '../events/socket-events.types';

/**
 * Contrato para handlers de eventos WebSocket.
 * Implementa este tipo para asegurar tipado fuerte en los handlers.
 */
export type SocketEventHandler<K extends SocketEventTypes> = (
  payload: SocketEventPayloadMap[K],
  client: any, // Puedes tipar con Socket si usas socket.io
) => Promise<void> | void;
