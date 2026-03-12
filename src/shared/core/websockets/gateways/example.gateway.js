"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var generic_gateway_1 = require("./generic.gateway");
var socket_events_types_1 = require("../events/socket-events.types");
var ExampleGateway = function () {
    var _classDecorators = [(0, websockets_1.WebSocketGateway)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = generic_gateway_1.GenericGateway;
    var _instanceExtraInitializers = [];
    var _afterInit_decorators;
    var _handleUserMessage_decorators;
    var ExampleGateway = _classThis = /** @class */ (function (_super) {
        __extends(ExampleGateway_1, _super);
        function ExampleGateway_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            __runInitializers(_this, _instanceExtraInitializers);
            return _this;
        }
        // server: Server; // Eliminado: ya existe en la clase base
        ExampleGateway_1.prototype.afterInit = function (server) {
            this.setServer(server);
            this.on(socket_events_types_1.SocketEventTypes.USER_MESSAGE, this.handleUserMessage.bind(this));
        };
        ExampleGateway_1.prototype.handleConnection = function (client) {
            console.log(client.id, 'connected');
        };
        ExampleGateway_1.prototype.handleDisconnect = function (client) {
            console.log(client.id, 'Disconnected');
        };
        ExampleGateway_1.prototype.handleUserMessage = function (data, client) {
            console.log(client.id, 'connected Socket');
            // Broadcast the message to all clients
            this.emit(socket_events_types_1.SocketEventTypes.USER_MESSAGE, data);
        };
        return ExampleGateway_1;
    }(_classSuper));
    __setFunctionName(_classThis, "ExampleGateway");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _afterInit_decorators = [(0, websockets_1.WebSocketServer)()];
        _handleUserMessage_decorators = [(0, websockets_1.SubscribeMessage)(socket_events_types_1.SocketEventTypes.USER_MESSAGE)];
        __esDecorate(_classThis, null, _afterInit_decorators, { kind: "method", name: "afterInit", static: false, private: false, access: { has: function (obj) { return "afterInit" in obj; }, get: function (obj) { return obj.afterInit; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleUserMessage_decorators, { kind: "method", name: "handleUserMessage", static: false, private: false, access: { has: function (obj) { return "handleUserMessage" in obj; }, get: function (obj) { return obj.handleUserMessage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExampleGateway = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExampleGateway = _classThis;
}();
exports.ExampleGateway = ExampleGateway;
