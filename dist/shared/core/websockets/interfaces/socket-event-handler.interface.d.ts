import { SocketEventTypes, SocketEventPayloadMap } from '../events/socket-events.types';
export type SocketEventHandler<K extends SocketEventTypes> = (payload: SocketEventPayloadMap[K], client: any) => Promise<void> | void;
