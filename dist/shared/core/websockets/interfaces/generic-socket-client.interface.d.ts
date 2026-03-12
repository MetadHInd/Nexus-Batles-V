export interface ISocketClient<TEventTypes extends string | number, TPayloadMap extends Record<TEventTypes, any>, TClient = any> {
    connect(...args: any[]): Promise<void> | void;
    disconnect(): Promise<void> | void;
    on<K extends TEventTypes>(event: K, handler: SocketEventHandler<TEventTypes, TPayloadMap, K, TClient>): void;
    emit<K extends TEventTypes>(event: K, payload: TPayloadMap[K]): void;
}
export type SocketEventHandler<TEventTypes extends string | number, TPayloadMap extends Record<TEventTypes, any>, K extends TEventTypes, TClient = any> = (payload: TPayloadMap[K], client: TClient) => Promise<void> | void;
