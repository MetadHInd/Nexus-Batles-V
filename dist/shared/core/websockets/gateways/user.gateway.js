"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const generic_gateway_1 = require("./generic.gateway");
const socket_events_types_1 = require("../events/socket-events.types");
let UserGateway = class UserGateway extends generic_gateway_1.GenericGateway {
    constructor() {
        super();
        this.on(socket_events_types_1.SocketEventTypes.USER_MESSAGE, (payload, client) => this.handleUserMessage(payload, client));
    }
    async handleUserMessage(payload, client) {
        console.log(client.id, 'connected');
        console.log(`[UserGateway] Mensaje de ${payload.userId}: ${payload.message}`);
        this.emit(socket_events_types_1.SocketEventTypes.USER_MESSAGE, payload);
    }
};
exports.UserGateway = UserGateway;
exports.UserGateway = UserGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [])
], UserGateway);
//# sourceMappingURL=user.gateway.js.map