"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventBus = exports.EventBusService = void 0;
const events_1 = require("events");
class EventBusService {
    static instance;
    emitter;
    constructor() {
        this.emitter = new events_1.EventEmitter();
        this.emitter.setMaxListeners(50);
    }
    static getInstance() {
        if (!EventBusService.instance) {
            EventBusService.instance = new EventBusService();
        }
        return EventBusService.instance;
    }
    getEventKey(event) {
        if (typeof event === 'string') {
            return event;
        }
        if (Array.isArray(event) && event.length === 2) {
            const [cls, evt] = event;
            return `${cls.name}:${evt}`;
        }
        return event.name || event.toString();
    }
    emit(event, ...args) {
        this.emitter.emit(this.getEventKey(event), ...args);
    }
    on(event, handler) {
        this.emitter.on(this.getEventKey(event), handler);
    }
    off(event, handler) {
        this.emitter.off(this.getEventKey(event), handler);
    }
}
exports.EventBusService = EventBusService;
exports.eventBus = EventBusService.getInstance();
//# sourceMappingURL=event-bus.service.js.map