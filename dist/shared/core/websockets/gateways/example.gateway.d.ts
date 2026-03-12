import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GenericGateway } from './generic.gateway';
import { SocketEventTypes, SocketEventPayloadMap, UserMessagePayload } from '../events/socket-events.types';
export declare class ExampleGateway extends GenericGateway<SocketEventTypes, SocketEventPayloadMap, Socket> implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleUserMessage(data: UserMessagePayload, client: Socket): void;
}
