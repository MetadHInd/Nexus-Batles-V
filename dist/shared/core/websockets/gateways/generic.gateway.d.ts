import { Server } from 'socket.io';
import { ISocketClient, SocketEventHandler } from '../interfaces/generic-socket-client.interface';
export declare class GenericGateway<TEventTypes extends string | number, TPayloadMap extends Record<TEventTypes, any>, TClient = any> implements ISocketClient<TEventTypes, TPayloadMap, TClient> {
    protected server: Server;
    private handlers;
    connect(..._args: any[]): void | Promise<void>;
    disconnect(): void | Promise<void>;
    setServer(server: Server): void;
    on<K extends TEventTypes>(event: K, handler: SocketEventHandler<TEventTypes, TPayloadMap, K, TClient>): void;
    emit<K extends TEventTypes>(event: K, payload: TPayloadMap[K]): void;
    handleEvent<K extends TEventTypes>(type: K, payload: TPayloadMap[K], client: TClient): Promise<void>;
}
