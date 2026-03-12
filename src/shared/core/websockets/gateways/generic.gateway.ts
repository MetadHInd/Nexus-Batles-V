/* eslint-disable @typescript-eslint/no-unused-vars */

import { Server } from 'socket.io';
import {
  ISocketClient,
  SocketEventHandler,
} from '../interfaces/generic-socket-client.interface';
/**
 * Gateway WebSocket genérico y extensible.
 * Puedes extender esta clase para crear gateways específicos.
 */
/**
 * Clase base genérica para gateways WebSocket.
 * No debe tener decoradores de NestJS ni propiedades de servidor.
 * Extiende esta clase en tus gateways concretos y aplica los decoradores allí.
 */
/**
 * Clase base genérica y polimórfica para gateways WebSocket.
 * Extiende esta clase para gateways concretos y especializa los tipos según el sistema de sockets y eventos.
 */
export class GenericGateway<
  TEventTypes extends string | number,
  TPayloadMap extends Record<TEventTypes, any>,
  TClient = any,
> implements ISocketClient<TEventTypes, TPayloadMap, TClient>
{
  protected server: Server;

  private handlers: Partial<
    Record<
      TEventTypes,
      SocketEventHandler<TEventTypes, TPayloadMap, any, TClient>
    >
  > = {};

  connect(..._args: any[]): void | Promise<void> {
    // Implementación opcional en subclases
  }

  disconnect(): void | Promise<void> {
    // Implementación opcional en subclases
  }

  setServer(server: Server) {
    this.server = server;
  }

  on<K extends TEventTypes>(
    event: K,
    handler: SocketEventHandler<TEventTypes, TPayloadMap, K, TClient>,
  ): void {
    this.handlers[event] = handler;
  }

  emit<K extends TEventTypes>(event: K, payload: TPayloadMap[K]): void {
    if (!this.server) throw new Error('Server instance not set');
    this.server.emit(String(event), payload);
  }

  /**
   * Handler genérico para todos los eventos registrados.
   * Debe ser llamado por el método decorado en el gateway concreto.
   */
  async handleEvent<K extends TEventTypes>(
    type: K,
    payload: TPayloadMap[K],
    client: TClient,
  ): Promise<void> {
    const handler = this.handlers[type] as
      | SocketEventHandler<TEventTypes, TPayloadMap, K, TClient>
      | undefined;
    if (handler) {
      await handler(payload, client);
    }
  }
}
