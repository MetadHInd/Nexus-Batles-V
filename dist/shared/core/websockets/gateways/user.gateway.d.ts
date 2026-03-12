import { GenericGateway } from './generic.gateway';
import { SocketEventTypes, SocketEventPayloadMap, UserMessagePayload } from '../events/socket-events.types';
import { Socket } from 'socket.io';
export declare class UserGateway extends GenericGateway<SocketEventTypes, SocketEventPayloadMap, Socket> {
    constructor();
    handleUserMessage(payload: UserMessagePayload, client: Socket): Promise<void>;
}
