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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const generic_gateway_1 = require("./generic.gateway");
const socket_events_types_1 = require("../events/socket-events.types");
let ExampleGateway = class ExampleGateway extends generic_gateway_1.GenericGateway {
    afterInit(server) {
        this.setServer(server);
        this.on(socket_events_types_1.SocketEventTypes.USER_MESSAGE, this.handleUserMessage.bind(this));
    }
    handleConnection(client) {
        console.log(client.id, 'connected');
    }
    handleDisconnect(client) {
        console.log(client.id, 'Disconnected');
    }
    handleUserMessage(data, client) {
        console.log(client.id, 'connected Socket');
        this.emit(socket_events_types_1.SocketEventTypes.USER_MESSAGE, data);
    }
};
exports.ExampleGateway = ExampleGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Server]),
    __metadata("design:returntype", void 0)
], ExampleGateway.prototype, "afterInit", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(socket_events_types_1.SocketEventTypes.USER_MESSAGE),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ExampleGateway.prototype, "handleUserMessage", null);
exports.ExampleGateway = ExampleGateway = __decorate([
    (0, websockets_1.WebSocketGateway)()
], ExampleGateway);
//# sourceMappingURL=example.gateway.js.map