"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageDto = void 0;
// src/shared/core/messaging/dtos/messaging-dtos.ts
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var SendMessageDto = function () {
    var _a;
    var _channel_decorators;
    var _channel_initializers = [];
    var _channel_extraInitializers = [];
    var _providerName_decorators;
    var _providerName_initializers = [];
    var _providerName_extraInitializers = [];
    var _recipient_decorators;
    var _recipient_initializers = [];
    var _recipient_extraInitializers = [];
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _options_decorators;
    var _options_initializers = [];
    var _options_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SendMessageDto() {
                this.channel = __runInitializers(this, _channel_initializers, void 0);
                this.providerName = (__runInitializers(this, _channel_extraInitializers), __runInitializers(this, _providerName_initializers, void 0));
                this.recipient = (__runInitializers(this, _providerName_extraInitializers), __runInitializers(this, _recipient_initializers, void 0));
                this.content = (__runInitializers(this, _recipient_extraInitializers), __runInitializers(this, _content_initializers, void 0));
                this.options = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _options_initializers, void 0));
                __runInitializers(this, _options_extraInitializers);
            }
            return SendMessageDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _channel_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Canal de envío del mensaje',
                    enum: ['email', 'push', 'sms'],
                    example: 'email',
                }), (0, class_validator_1.IsEnum)(['email', 'push', 'sms'])];
            _providerName_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Nombre del proveedor específico a utilizar',
                    example: 'onesignal, twilio, smtp',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _recipient_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Destinatario(s) del mensaje. Para email/sms puede ser un string o array, para push debe seguir el formato específico',
                    example: 'recipient@example.com o {type: "player_id", value: "xxxx"}',
                }), (0, class_validator_1.IsNotEmpty)()];
            _content_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Contenido del mensaje (varía según el canal)',
                    example: {
                        subject: 'Asunto (para email)',
                        html: '<p>Contenido HTML</p> (para email)',
                        title: 'Título de notificación (para push)',
                        body: 'Cuerpo del mensaje (para push/sms)',
                        text: 'Texto del SMS (para sms)',
                    },
                }), (0, class_validator_1.IsObject)()];
            _options_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Opciones adicionales según el canal',
                    example: {
                        scheduleFor: '2025-05-01T12:00:00Z',
                        ttl: 86400,
                        priority: 'high',
                        silent: false,
                        from: '+12025550142',
                        attachments: [{ filename: 'doc.pdf', content: 'base64data' }],
                    },
                }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _channel_decorators, { kind: "field", name: "channel", static: false, private: false, access: { has: function (obj) { return "channel" in obj; }, get: function (obj) { return obj.channel; }, set: function (obj, value) { obj.channel = value; } }, metadata: _metadata }, _channel_initializers, _channel_extraInitializers);
            __esDecorate(null, null, _providerName_decorators, { kind: "field", name: "providerName", static: false, private: false, access: { has: function (obj) { return "providerName" in obj; }, get: function (obj) { return obj.providerName; }, set: function (obj, value) { obj.providerName = value; } }, metadata: _metadata }, _providerName_initializers, _providerName_extraInitializers);
            __esDecorate(null, null, _recipient_decorators, { kind: "field", name: "recipient", static: false, private: false, access: { has: function (obj) { return "recipient" in obj; }, get: function (obj) { return obj.recipient; }, set: function (obj, value) { obj.recipient = value; } }, metadata: _metadata }, _recipient_initializers, _recipient_extraInitializers);
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            __esDecorate(null, null, _options_decorators, { kind: "field", name: "options", static: false, private: false, access: { has: function (obj) { return "options" in obj; }, get: function (obj) { return obj.options; }, set: function (obj, value) { obj.options = value; } }, metadata: _metadata }, _options_initializers, _options_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SendMessageDto = SendMessageDto;
