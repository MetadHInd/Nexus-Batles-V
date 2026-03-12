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
exports.ConfigurableMessagingDto = exports.MessagingConfigDto = exports.BaseMessagingDto = void 0;
// src/shared/core/messaging/dtos/base-messaging.dto.ts
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var swagger_1 = require("@nestjs/swagger");
/**
 * DTO base para todas las peticiones de mensajería
 */
var BaseMessagingDto = function () {
    var _a;
    var _messageId_decorators;
    var _messageId_initializers = [];
    var _messageId_extraInitializers = [];
    var _tenantId_decorators;
    var _tenantId_initializers = [];
    var _tenantId_extraInitializers = [];
    var _metadata_decorators;
    var _metadata_initializers = [];
    var _metadata_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BaseMessagingDto() {
                this.messageId = __runInitializers(this, _messageId_initializers, void 0);
                this.tenantId = (__runInitializers(this, _messageId_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
                this.metadata = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
            return BaseMessagingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _messageId_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Identificador único para seguimiento del mensaje (opcional)',
                    example: 'msg-12345',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _tenantId_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Identificador del tenant/cliente (permite multitenancy)',
                    example: 'tenant-001',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Metadatos adicionales para propósitos de tracking',
                    example: { campaign: 'welcome', source: 'web' },
                }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _messageId_decorators, { kind: "field", name: "messageId", static: false, private: false, access: { has: function (obj) { return "messageId" in obj; }, get: function (obj) { return obj.messageId; }, set: function (obj, value) { obj.messageId = value; } }, metadata: _metadata }, _messageId_initializers, _messageId_extraInitializers);
            __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: function (obj) { return "tenantId" in obj; }, get: function (obj) { return obj.tenantId; }, set: function (obj, value) { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: function (obj) { return "metadata" in obj; }, get: function (obj) { return obj.metadata; }, set: function (obj, value) { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BaseMessagingDto = BaseMessagingDto;
/**
 * DTO para opciones de configuración común
 */
var MessagingConfigDto = function () {
    var _a;
    var _logDelivery_decorators;
    var _logDelivery_initializers = [];
    var _logDelivery_extraInitializers = [];
    var _retryOnFailure_decorators;
    var _retryOnFailure_initializers = [];
    var _retryOnFailure_extraInitializers = [];
    var _maxRetries_decorators;
    var _maxRetries_initializers = [];
    var _maxRetries_extraInitializers = [];
    var _retryDelay_decorators;
    var _retryDelay_initializers = [];
    var _retryDelay_extraInitializers = [];
    return _a = /** @class */ (function () {
            function MessagingConfigDto() {
                this.logDelivery = __runInitializers(this, _logDelivery_initializers, void 0);
                this.retryOnFailure = (__runInitializers(this, _logDelivery_extraInitializers), __runInitializers(this, _retryOnFailure_initializers, void 0));
                this.maxRetries = (__runInitializers(this, _retryOnFailure_extraInitializers), __runInitializers(this, _maxRetries_initializers, void 0));
                this.retryDelay = (__runInitializers(this, _maxRetries_extraInitializers), __runInitializers(this, _retryDelay_initializers, void 0));
                __runInitializers(this, _retryDelay_extraInitializers);
            }
            return MessagingConfigDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _logDelivery_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Si es true, se guarda un registro del envío en la base de datos',
                    default: true,
                }), (0, class_validator_1.IsOptional)()];
            _retryOnFailure_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Si es true, se reintenta el envío en caso de error',
                    default: true,
                }), (0, class_validator_1.IsOptional)()];
            _maxRetries_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Número máximo de reintentos',
                    default: 3,
                }), (0, class_validator_1.IsOptional)()];
            _retryDelay_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Tiempo a esperar para el reintento (en segundos)',
                    default: 60,
                }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _logDelivery_decorators, { kind: "field", name: "logDelivery", static: false, private: false, access: { has: function (obj) { return "logDelivery" in obj; }, get: function (obj) { return obj.logDelivery; }, set: function (obj, value) { obj.logDelivery = value; } }, metadata: _metadata }, _logDelivery_initializers, _logDelivery_extraInitializers);
            __esDecorate(null, null, _retryOnFailure_decorators, { kind: "field", name: "retryOnFailure", static: false, private: false, access: { has: function (obj) { return "retryOnFailure" in obj; }, get: function (obj) { return obj.retryOnFailure; }, set: function (obj, value) { obj.retryOnFailure = value; } }, metadata: _metadata }, _retryOnFailure_initializers, _retryOnFailure_extraInitializers);
            __esDecorate(null, null, _maxRetries_decorators, { kind: "field", name: "maxRetries", static: false, private: false, access: { has: function (obj) { return "maxRetries" in obj; }, get: function (obj) { return obj.maxRetries; }, set: function (obj, value) { obj.maxRetries = value; } }, metadata: _metadata }, _maxRetries_initializers, _maxRetries_extraInitializers);
            __esDecorate(null, null, _retryDelay_decorators, { kind: "field", name: "retryDelay", static: false, private: false, access: { has: function (obj) { return "retryDelay" in obj; }, get: function (obj) { return obj.retryDelay; }, set: function (obj, value) { obj.retryDelay = value; } }, metadata: _metadata }, _retryDelay_initializers, _retryDelay_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.MessagingConfigDto = MessagingConfigDto;
/**
 * DTO para peticiones de mensajería con configuración
 */
var ConfigurableMessagingDto = function () {
    var _a;
    var _classSuper = BaseMessagingDto;
    var _config_decorators;
    var _config_initializers = [];
    var _config_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(ConfigurableMessagingDto, _super);
            function ConfigurableMessagingDto() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.config = __runInitializers(_this, _config_initializers, void 0);
                __runInitializers(_this, _config_extraInitializers);
                return _this;
            }
            return ConfigurableMessagingDto;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _config_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Configuración adicional del mensaje',
                    type: function () { return MessagingConfigDto; },
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(function () { return MessagingConfigDto; })];
            __esDecorate(null, null, _config_decorators, { kind: "field", name: "config", static: false, private: false, access: { has: function (obj) { return "config" in obj; }, get: function (obj) { return obj.config; }, set: function (obj, value) { obj.config = value; } }, metadata: _metadata }, _config_initializers, _config_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ConfigurableMessagingDto = ConfigurableMessagingDto;
