/* eslint-disable @typescript-eslint/require-await */
import { WebSocketGateway } from '@nestjs/websockets';
import { GenericGateway } from './generic.gateway';
import {
  SocketEventTypes,
  SocketEventPayloadMap,
  UserMessagePayload,
} from '../events/socket-events.types';
import { Socket } from 'socket.io';

/**
 * Ejemplo de gateway específico para usuarios.
 * Extiende el gateway genérico y registra handlers personalizados.
 */
@WebSocketGateway()
export class UserGateway extends GenericGateway<
  SocketEventTypes,
  SocketEventPayloadMap,
  Socket
> {
  constructor() {
    super();
    // Registrar handler para USER_MESSAGE
    this.on(SocketEventTypes.USER_MESSAGE, (payload, client) =>
      this.handleUserMessage(payload, client),
    );
  }

  async handleUserMessage(payload: UserMessagePayload, client: Socket) {
    console.log(client.id, 'connected');
    // Lógica para manejar mensajes de usuario
    console.log(
      `[UserGateway] Mensaje de ${payload.userId}: ${payload.message}`,
    );
    // Puedes emitir eventos a otros clientes si es necesario
    this.emit(SocketEventTypes.USER_MESSAGE, payload);
  }
}
