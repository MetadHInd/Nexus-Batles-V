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
exports.GmailMessageParamsDto = void 0;
// gmail-message-params.dto.ts
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var GmailMessageParamsDto = function () {
    var _a;
    var _messageId_decorators;
    var _messageId_initializers = [];
    var _messageId_extraInitializers = [];
    var _format_decorators;
    var _format_initializers = [];
    var _format_extraInitializers = [];
    var _metadataHeaders_decorators;
    var _metadataHeaders_initializers = [];
    var _metadataHeaders_extraInitializers = [];
    return _a = /** @class */ (function () {
            function GmailMessageParamsDto() {
                this.messageId = __runInitializers(this, _messageId_initializers, void 0);
                this.format = (__runInitializers(this, _messageId_extraInitializers), __runInitializers(this, _format_initializers, 'full'));
                this.metadataHeaders = (__runInitializers(this, _format_extraInitializers), __runInitializers(this, _metadataHeaders_initializers, void 0));
                __runInitializers(this, _metadataHeaders_extraInitializers);
            }
            return GmailMessageParamsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _messageId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Message ID' }), (0, class_validator_1.IsString)()];
            _format_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Message format (full, metadata, minimal, raw)',
                    default: 'full'
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _metadataHeaders_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Metadata headers to include',
                    type: [String]
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _messageId_decorators, { kind: "field", name: "messageId", static: false, private: false, access: { has: function (obj) { return "messageId" in obj; }, get: function (obj) { return obj.messageId; }, set: function (obj, value) { obj.messageId = value; } }, metadata: _metadata }, _messageId_initializers, _messageId_extraInitializers);
            __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: function (obj) { return "format" in obj; }, get: function (obj) { return obj.format; }, set: function (obj, value) { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
            __esDecorate(null, null, _metadataHeaders_decorators, { kind: "field", name: "metadataHeaders", static: false, private: false, access: { has: function (obj) { return "metadataHeaders" in obj; }, get: function (obj) { return obj.metadataHeaders; }, set: function (obj, value) { obj.metadataHeaders = value; } }, metadata: _metadata }, _metadataHeaders_initializers, _metadataHeaders_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.GmailMessageParamsDto = GmailMessageParamsDto;
