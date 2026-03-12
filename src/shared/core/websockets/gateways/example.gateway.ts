import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GenericGateway } from './generic.gateway';
import {
  SocketEventTypes,
  SocketEventPayloadMap,
  UserMessagePayload,
} from '../events/socket-events.types';

@WebSocketGateway()
export class ExampleGateway
  extends GenericGateway<SocketEventTypes, SocketEventPayloadMap, Socket>
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  // server: Server; // Eliminado: ya existe en la clase base
  afterInit(server: Server) {
    this.setServer(server);
    this.on(SocketEventTypes.USER_MESSAGE, this.handleUserMessage.bind(this));
  }

  handleConnection(client: Socket) {
    console.log(client.id, 'connected');
  }

  handleDisconnect(client: Socket) {
    console.log(client.id, 'Disconnected');
  }

  @SubscribeMessage(SocketEventTypes.USER_MESSAGE)
  handleUserMessage(
    @MessageBody() data: UserMessagePayload,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(client.id, 'connected Socket');
    // Broadcast the message to all clients

    this.emit(SocketEventTypes.USER_MESSAGE, data);
  }
}
