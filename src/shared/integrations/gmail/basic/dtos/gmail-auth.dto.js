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
exports.GmailAuthDto = void 0;
// gmail-auth.dto.ts
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var GmailAuthDto = function () {
    var _a;
    var _clientId_decorators;
    var _clientId_initializers = [];
    var _clientId_extraInitializers = [];
    var _clientSecret_decorators;
    var _clientSecret_initializers = [];
    var _clientSecret_extraInitializers = [];
    var _redirectUri_decorators;
    var _redirectUri_initializers = [];
    var _redirectUri_extraInitializers = [];
    var _refreshToken_decorators;
    var _refreshToken_initializers = [];
    var _refreshToken_extraInitializers = [];
    var _accessToken_decorators;
    var _accessToken_initializers = [];
    var _accessToken_extraInitializers = [];
    return _a = /** @class */ (function () {
            function GmailAuthDto() {
                this.clientId = __runInitializers(this, _clientId_initializers, void 0);
                this.clientSecret = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _clientSecret_initializers, void 0));
                this.redirectUri = (__runInitializers(this, _clientSecret_extraInitializers), __runInitializers(this, _redirectUri_initializers, void 0));
                this.refreshToken = (__runInitializers(this, _redirectUri_extraInitializers), __runInitializers(this, _refreshToken_initializers, void 0));
                this.accessToken = (__runInitializers(this, _refreshToken_extraInitializers), __runInitializers(this, _accessToken_initializers, void 0));
                __runInitializers(this, _accessToken_extraInitializers);
            }
            return GmailAuthDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _clientId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Gmail client ID' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _clientSecret_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Gmail client secret' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _redirectUri_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'OAuth redirect URI' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _refreshToken_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'OAuth refresh token' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _accessToken_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'OAuth access token' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: function (obj) { return "clientId" in obj; }, get: function (obj) { return obj.clientId; }, set: function (obj, value) { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
            __esDecorate(null, null, _clientSecret_decorators, { kind: "field", name: "clientSecret", static: false, private: false, access: { has: function (obj) { return "clientSecret" in obj; }, get: function (obj) { return obj.clientSecret; }, set: function (obj, value) { obj.clientSecret = value; } }, metadata: _metadata }, _clientSecret_initializers, _clientSecret_extraInitializers);
            __esDecorate(null, null, _redirectUri_decorators, { kind: "field", name: "redirectUri", static: false, private: false, access: { has: function (obj) { return "redirectUri" in obj; }, get: function (obj) { return obj.redirectUri; }, set: function (obj, value) { obj.redirectUri = value; } }, metadata: _metadata }, _redirectUri_initializers, _redirectUri_extraInitializers);
            __esDecorate(null, null, _refreshToken_decorators, { kind: "field", name: "refreshToken", static: false, private: false, access: { has: function (obj) { return "refreshToken" in obj; }, get: function (obj) { return obj.refreshToken; }, set: function (obj, value) { obj.refreshToken = value; } }, metadata: _metadata }, _refreshToken_initializers, _refreshToken_extraInitializers);
            __esDecorate(null, null, _accessToken_decorators, { kind: "field", name: "accessToken", static: false, private: false, access: { has: function (obj) { return "accessToken" in obj; }, get: function (obj) { return obj.accessToken; }, set: function (obj, value) { obj.accessToken = value; } }, metadata: _metadata }, _accessToken_initializers, _accessToken_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.GmailAuthDto = GmailAuthDto;
