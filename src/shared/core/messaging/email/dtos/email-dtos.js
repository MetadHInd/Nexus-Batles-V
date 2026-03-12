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
exports.SendTemplateEmailDto = exports.SendBulkEmailDto = exports.SendEmailDto = void 0;
// src/shared/core/messaging/email/dtos/email-dtos.ts
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var SendEmailDto = function () {
    var _a;
    var _to_decorators;
    var _to_initializers = [];
    var _to_extraInitializers = [];
    var _subject_decorators;
    var _subject_initializers = [];
    var _subject_extraInitializers = [];
    var _html_decorators;
    var _html_initializers = [];
    var _html_extraInitializers = [];
    var _text_decorators;
    var _text_initializers = [];
    var _text_extraInitializers = [];
    var _attachments_decorators;
    var _attachments_initializers = [];
    var _attachments_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SendEmailDto() {
                this.to = __runInitializers(this, _to_initializers, void 0);
                this.subject = (__runInitializers(this, _to_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
                this.html = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _html_initializers, void 0));
                this.text = (__runInitializers(this, _html_extraInitializers), __runInitializers(this, _text_initializers, void 0));
                this.attachments = (__runInitializers(this, _text_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
                __runInitializers(this, _attachments_extraInitializers);
            }
            return SendEmailDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _to_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Destinatario(s) del correo',
                    example: 'destinatario@ejemplo.com o ["destinatario1@ejemplo.com", "destinatario2@ejemplo.com"]',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    // Convertir string a array si es un solo email
                    return typeof value === 'string' ? [value] : value;
                }), (0, class_validator_1.IsEmail)({}, { each: true })];
            _subject_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Asunto del correo',
                    example: 'Bienvenido a nuestra plataforma',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _html_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Contenido HTML del correo',
                    example: '<h1>Bienvenido</h1><p>Gracias por registrarte</p>',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _text_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Contenido de texto plano (alternativa para clientes sin HTML)',
                    example: 'Bienvenido. Gracias por registrarte.',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _attachments_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Archivos adjuntos',
                    example: [{ filename: 'manual.pdf', content: 'Base64...' }],
                }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _to_decorators, { kind: "field", name: "to", static: false, private: false, access: { has: function (obj) { return "to" in obj; }, get: function (obj) { return obj.to; }, set: function (obj, value) { obj.to = value; } }, metadata: _metadata }, _to_initializers, _to_extraInitializers);
            __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: function (obj) { return "subject" in obj; }, get: function (obj) { return obj.subject; }, set: function (obj, value) { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
            __esDecorate(null, null, _html_decorators, { kind: "field", name: "html", static: false, private: false, access: { has: function (obj) { return "html" in obj; }, get: function (obj) { return obj.html; }, set: function (obj, value) { obj.html = value; } }, metadata: _metadata }, _html_initializers, _html_extraInitializers);
            __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: function (obj) { return "text" in obj; }, get: function (obj) { return obj.text; }, set: function (obj, value) { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
            __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: function (obj) { return "attachments" in obj; }, get: function (obj) { return obj.attachments; }, set: function (obj, value) { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SendEmailDto = SendEmailDto;
var SendBulkEmailDto = function () {
    var _a;
    var _messages_decorators;
    var _messages_initializers = [];
    var _messages_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SendBulkEmailDto() {
                this.messages = __runInitializers(this, _messages_initializers, void 0);
                __runInitializers(this, _messages_extraInitializers);
            }
            return SendBulkEmailDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _messages_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Lista de correos a enviar',
                    type: [SendEmailDto],
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _messages_decorators, { kind: "field", name: "messages", static: false, private: false, access: { has: function (obj) { return "messages" in obj; }, get: function (obj) { return obj.messages; }, set: function (obj, value) { obj.messages = value; } }, metadata: _metadata }, _messages_initializers, _messages_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SendBulkEmailDto = SendBulkEmailDto;
var SendTemplateEmailDto = function () {
    var _a;
    var _to_decorators;
    var _to_initializers = [];
    var _to_extraInitializers = [];
    var _subject_decorators;
    var _subject_initializers = [];
    var _subject_extraInitializers = [];
    var _templateName_decorators;
    var _templateName_initializers = [];
    var _templateName_extraInitializers = [];
    var _templateData_decorators;
    var _templateData_initializers = [];
    var _templateData_extraInitializers = [];
    var _attachments_decorators;
    var _attachments_initializers = [];
    var _attachments_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SendTemplateEmailDto() {
                this.to = __runInitializers(this, _to_initializers, void 0);
                this.subject = (__runInitializers(this, _to_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
                this.templateName = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _templateName_initializers, void 0));
                this.templateData = (__runInitializers(this, _templateName_extraInitializers), __runInitializers(this, _templateData_initializers, void 0));
                this.attachments = (__runInitializers(this, _templateData_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
                __runInitializers(this, _attachments_extraInitializers);
            }
            return SendTemplateEmailDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _to_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Destinatario(s) del correo',
                    example: 'destinatario@ejemplo.com o ["destinatario1@ejemplo.com", "destinatario2@ejemplo.com"]',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return typeof value === 'string' ? [value] : value;
                }), (0, class_validator_1.IsEmail)({}, { each: true })];
            _subject_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Asunto del correo',
                    example: 'Bienvenido a nuestra plataforma',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _templateName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Nombre de la plantilla HTML a usar',
                    example: 'welcome',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _templateData_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Datos para reemplazar las variables en la plantilla',
                    example: {
                        userName: 'Juan Pérez',
                        actionUrl: 'https://ejemplo.com/activar',
                    },
                }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsNotEmpty)()];
            _attachments_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Archivos adjuntos',
                    example: [{ filename: 'manual.pdf', content: 'Base64...' }],
                }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _to_decorators, { kind: "field", name: "to", static: false, private: false, access: { has: function (obj) { return "to" in obj; }, get: function (obj) { return obj.to; }, set: function (obj, value) { obj.to = value; } }, metadata: _metadata }, _to_initializers, _to_extraInitializers);
            __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: function (obj) { return "subject" in obj; }, get: function (obj) { return obj.subject; }, set: function (obj, value) { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
            __esDecorate(null, null, _templateName_decorators, { kind: "field", name: "templateName", static: false, private: false, access: { has: function (obj) { return "templateName" in obj; }, get: function (obj) { return obj.templateName; }, set: function (obj, value) { obj.templateName = value; } }, metadata: _metadata }, _templateName_initializers, _templateName_extraInitializers);
            __esDecorate(null, null, _templateData_decorators, { kind: "field", name: "templateData", static: false, private: false, access: { has: function (obj) { return "templateData" in obj; }, get: function (obj) { return obj.templateData; }, set: function (obj, value) { obj.templateData = value; } }, metadata: _metadata }, _templateData_initializers, _templateData_extraInitializers);
            __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: function (obj) { return "attachments" in obj; }, get: function (obj) { return obj.attachments; }, set: function (obj, value) { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SendTemplateEmailDto = SendTemplateEmailDto;
