type EventHandler = (...args: any[]) => void;
type EventClass = new (...args: any[]) => any;
type EventKey = string | EventClass | [EventClass, string];
export declare class EventBusService {
    private static instance;
    private emitter;
    private constructor();
    static getInstance(): EventBusService;
    private getEventKey;
    emit<T>(event: EventKey, ...args: T[]): void;
    on(event: EventKey, handler: EventHandler): void;
    off(event: EventKey, handler: EventHandler): void;
}
export declare const eventBus: EventBusService;
export {};
