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
exports.SendBulkPushDto = exports.SendPushDto = exports.PushContentDto = exports.PushRecipientDto = exports.PushButtonDto = void 0;
// src/shared/core/messaging/push/dtos/push-dtos.ts
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var PushButtonDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _text_decorators;
    var _text_initializers = [];
    var _text_extraInitializers = [];
    var _url_decorators;
    var _url_initializers = [];
    var _url_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PushButtonDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.text = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _text_initializers, void 0));
                this.url = (__runInitializers(this, _text_extraInitializers), __runInitializers(this, _url_initializers, void 0));
                __runInitializers(this, _url_extraInitializers);
            }
            return PushButtonDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'ID único del botón',
                    example: 'btn_1',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _text_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Texto a mostrar en el botón',
                    example: 'Ver detalles',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _url_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'URL a la que dirige el botón',
                    example: 'https://ejemplo.com/detalles',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: function (obj) { return "text" in obj; }, get: function (obj) { return obj.text; }, set: function (obj, value) { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
            __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: function (obj) { return "url" in obj; }, get: function (obj) { return obj.url; }, set: function (obj, value) { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PushButtonDto = PushButtonDto;
var PushRecipientDto = function () {
    var _a;
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _value_decorators;
    var _value_initializers = [];
    var _value_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PushRecipientDto() {
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.value = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _value_initializers, void 0));
                __runInitializers(this, _value_extraInitializers);
            }
            return PushRecipientDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Tipo de destinatario',
                    enum: ['player_id', 'segment', 'all', 'topic'],
                    example: 'player_id',
                }), (0, class_validator_1.IsEnum)(['player_id', 'segment', 'all', 'topic'])];
            _value_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'ID o IDs de destinatarios (depende del tipo)',
                    example: 'e4e87830-b954-11e3-811d-f3b376925f15',
                }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: function (obj) { return "value" in obj; }, get: function (obj) { return obj.value; }, set: function (obj, value) { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PushRecipientDto = PushRecipientDto;
var PushContentDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _body_decorators;
    var _body_initializers = [];
    var _body_extraInitializers = [];
    var _imageUrl_decorators;
    var _imageUrl_initializers = [];
    var _imageUrl_extraInitializers = [];
    var _url_decorators;
    var _url_initializers = [];
    var _url_extraInitializers = [];
    var _data_decorators;
    var _data_initializers = [];
    var _data_extraInitializers = [];
    var _buttons_decorators;
    var _buttons_initializers = [];
    var _buttons_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PushContentDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.body = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _body_initializers, void 0));
                this.imageUrl = (__runInitializers(this, _body_extraInitializers), __runInitializers(this, _imageUrl_initializers, void 0));
                this.url = (__runInitializers(this, _imageUrl_extraInitializers), __runInitializers(this, _url_initializers, void 0));
                this.data = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _data_initializers, void 0));
                this.buttons = (__runInitializers(this, _data_extraInitializers), __runInitializers(this, _buttons_initializers, void 0));
                __runInitializers(this, _buttons_extraInitializers);
            }
            return PushContentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Título de la notificación',
                    example: 'Nueva actualización disponible',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _body_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Cuerpo del mensaje',
                    example: 'Hemos lanzado nuevas funcionalidades. ¡Actualiza ahora!',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _imageUrl_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'URL de imagen para mostrar en la notificación',
                    example: 'https://ejemplo.com/imagen.jpg',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _url_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'URL para abrir al hacer clic en la notificación',
                    example: 'https://ejemplo.com/nueva-version',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _data_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Datos adicionales para enviar con la notificación',
                    example: { action: 'update', version: '2.0' },
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            _buttons_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Botones de acción para la notificación',
                    type: [PushButtonDto],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return PushButtonDto; })];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _body_decorators, { kind: "field", name: "body", static: false, private: false, access: { has: function (obj) { return "body" in obj; }, get: function (obj) { return obj.body; }, set: function (obj, value) { obj.body = value; } }, metadata: _metadata }, _body_initializers, _body_extraInitializers);
            __esDecorate(null, null, _imageUrl_decorators, { kind: "field", name: "imageUrl", static: false, private: false, access: { has: function (obj) { return "imageUrl" in obj; }, get: function (obj) { return obj.imageUrl; }, set: function (obj, value) { obj.imageUrl = value; } }, metadata: _metadata }, _imageUrl_initializers, _imageUrl_extraInitializers);
            __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: function (obj) { return "url" in obj; }, get: function (obj) { return obj.url; }, set: function (obj, value) { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
            __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: function (obj) { return "data" in obj; }, get: function (obj) { return obj.data; }, set: function (obj, value) { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
            __esDecorate(null, null, _buttons_decorators, { kind: "field", name: "buttons", static: false, private: false, access: { has: function (obj) { return "buttons" in obj; }, get: function (obj) { return obj.buttons; }, set: function (obj, value) { obj.buttons = value; } }, metadata: _metadata }, _buttons_initializers, _buttons_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PushContentDto = PushContentDto;
var SendPushDto = function () {
    var _a;
    var _recipient_decorators;
    var _recipient_initializers = [];
    var _recipient_extraInitializers = [];
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _scheduleFor_decorators;
    var _scheduleFor_initializers = [];
    var _scheduleFor_extraInitializers = [];
    var _ttl_decorators;
    var _ttl_initializers = [];
    var _ttl_extraInitializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _priority_extraInitializers = [];
    var _silent_decorators;
    var _silent_initializers = [];
    var _silent_extraInitializers = [];
    var _collapseId_decorators;
    var _collapseId_initializers = [];
    var _collapseId_extraInitializers = [];
    var _channelId_decorators;
    var _channelId_initializers = [];
    var _channelId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SendPushDto() {
                this.recipient = __runInitializers(this, _recipient_initializers, void 0);
                this.content = (__runInitializers(this, _recipient_extraInitializers), __runInitializers(this, _content_initializers, void 0));
                this.scheduleFor = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _scheduleFor_initializers, void 0));
                this.ttl = (__runInitializers(this, _scheduleFor_extraInitializers), __runInitializers(this, _ttl_initializers, void 0));
                this.priority = (__runInitializers(this, _ttl_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.silent = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _silent_initializers, void 0));
                this.collapseId = (__runInitializers(this, _silent_extraInitializers), __runInitializers(this, _collapseId_initializers, void 0));
                this.channelId = (__runInitializers(this, _collapseId_extraInitializers), __runInitializers(this, _channelId_initializers, void 0));
                __runInitializers(this, _channelId_extraInitializers);
            }
            return SendPushDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _recipient_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Información del destinatario',
                    type: PushRecipientDto,
                }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(function () { return PushRecipientDto; })];
            _content_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Contenido de la notificación',
                    type: PushContentDto,
                }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(function () { return PushContentDto; })];
            _scheduleFor_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Fecha para programar el envío (formato ISO)',
                    example: '2025-05-01T12:00:00Z',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _ttl_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Tiempo de vida en segundos',
                    example: 86400,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _priority_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Prioridad de la notificación',
                    enum: ['high', 'normal'],
                    example: 'high',
                }), (0, class_validator_1.IsEnum)(['high', 'normal']), (0, class_validator_1.IsOptional)()];
            _silent_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Si es true, no muestra la notificación visualmente',
                    example: false,
                }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _collapseId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'ID de colapso para agrupar notificaciones',
                    example: 'update-notification',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _channelId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'ID del canal para Android',
                    example: 'updates_channel',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _recipient_decorators, { kind: "field", name: "recipient", static: false, private: false, access: { has: function (obj) { return "recipient" in obj; }, get: function (obj) { return obj.recipient; }, set: function (obj, value) { obj.recipient = value; } }, metadata: _metadata }, _recipient_initializers, _recipient_extraInitializers);
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            __esDecorate(null, null, _scheduleFor_decorators, { kind: "field", name: "scheduleFor", static: false, private: false, access: { has: function (obj) { return "scheduleFor" in obj; }, get: function (obj) { return obj.scheduleFor; }, set: function (obj, value) { obj.scheduleFor = value; } }, metadata: _metadata }, _scheduleFor_initializers, _scheduleFor_extraInitializers);
            __esDecorate(null, null, _ttl_decorators, { kind: "field", name: "ttl", static: false, private: false, access: { has: function (obj) { return "ttl" in obj; }, get: function (obj) { return obj.ttl; }, set: function (obj, value) { obj.ttl = value; } }, metadata: _metadata }, _ttl_initializers, _ttl_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _silent_decorators, { kind: "field", name: "silent", static: false, private: false, access: { has: function (obj) { return "silent" in obj; }, get: function (obj) { return obj.silent; }, set: function (obj, value) { obj.silent = value; } }, metadata: _metadata }, _silent_initializers, _silent_extraInitializers);
            __esDecorate(null, null, _collapseId_decorators, { kind: "field", name: "collapseId", static: false, private: false, access: { has: function (obj) { return "collapseId" in obj; }, get: function (obj) { return obj.collapseId; }, set: function (obj, value) { obj.collapseId = value; } }, metadata: _metadata }, _collapseId_initializers, _collapseId_extraInitializers);
            __esDecorate(null, null, _channelId_decorators, { kind: "field", name: "channelId", static: false, private: false, access: { has: function (obj) { return "channelId" in obj; }, get: function (obj) { return obj.channelId; }, set: function (obj, value) { obj.channelId = value; } }, metadata: _metadata }, _channelId_initializers, _channelId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SendPushDto = SendPushDto;
var SendBulkPushDto = function () {
    var _a;
    var _messages_decorators;
    var _messages_initializers = [];
    var _messages_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SendBulkPushDto() {
                this.messages = __runInitializers(this, _messages_initializers, void 0);
                __runInitializers(this, _messages_extraInitializers);
            }
            return SendBulkPushDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _messages_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Lista de notificaciones a enviar',
                    type: [SendPushDto],
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return SendPushDto; })];
            __esDecorate(null, null, _messages_decorators, { kind: "field", name: "messages", static: false, private: false, access: { has: function (obj) { return "messages" in obj; }, get: function (obj) { return obj.messages; }, set: function (obj, value) { obj.messages = value; } }, metadata: _metadata }, _messages_initializers, _messages_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SendBulkPushDto = SendBulkPushDto;
