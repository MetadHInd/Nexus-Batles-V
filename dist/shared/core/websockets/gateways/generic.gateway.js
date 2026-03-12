"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericGateway = void 0;
class GenericGateway {
    server;
    handlers = {};
    connect(..._args) {
    }
    disconnect() {
    }
    setServer(server) {
        this.server = server;
    }
    on(event, handler) {
        this.handlers[event] = handler;
    }
    emit(event, payload) {
        if (!this.server)
            throw new Error('Server instance not set');
        this.server.emit(String(event), payload);
    }
    async handleEvent(type, payload, client) {
        const handler = this.handlers[type];
        if (handler) {
            await handler(payload, client);
        }
    }
}
exports.GenericGateway = GenericGateway;
//# sourceMappingURL=generic.gateway.js.map