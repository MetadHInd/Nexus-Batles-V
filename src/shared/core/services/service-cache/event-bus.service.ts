/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { EventEmitter } from 'events';

type EventHandler = (...args: any[]) => void;
type EventClass = new (...args: any[]) => any;
type EventKey = string | EventClass | [EventClass, string];

export class EventBusService {
  private static instance: EventBusService;
  private emitter: EventEmitter;

  private constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(50);
  }

  public static getInstance(): EventBusService {
    if (!EventBusService.instance) {
      EventBusService.instance = new EventBusService();
    }
    return EventBusService.instance;
  }

  private getEventKey(event: EventKey): string {
    if (typeof event === 'string') {
      return event;
    }
    if (Array.isArray(event) && event.length === 2) {
      const [cls, evt] = event;
      return `${cls.name}:${evt}`;
    }
    // Use the class constructor's name as the key
    return event.name || event.toString();
  }

  public emit<T>(event: EventKey, ...args: T[]): void {
    this.emitter.emit(this.getEventKey(event), ...args);
  }

  public on(event: EventKey, handler: EventHandler): void {
    this.emitter.on(this.getEventKey(event), handler);
  }

  public off(event: EventKey, handler: EventHandler): void {
    this.emitter.off(this.getEventKey(event), handler);
  }
}

export const eventBus = EventBusService.getInstance();
