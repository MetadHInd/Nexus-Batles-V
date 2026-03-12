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
exports.LoginResponseModel = void 0;
var swagger_1 = require("@nestjs/swagger");
var LoginResponseModel = function () {
    var _a;
    var _token_decorators;
    var _token_initializers = [];
    var _token_extraInitializers = [];
    var _user_decorators;
    var _user_initializers = [];
    var _user_extraInitializers = [];
    var _tenants_decorators;
    var _tenants_initializers = [];
    var _tenants_extraInitializers = [];
    var _defaultTenant_decorators;
    var _defaultTenant_initializers = [];
    var _defaultTenant_extraInitializers = [];
    return _a = /** @class */ (function () {
            function LoginResponseModel(token, user, tenants, defaultTenant) {
                this.token = __runInitializers(this, _token_initializers, void 0);
                this.user = (__runInitializers(this, _token_extraInitializers), __runInitializers(this, _user_initializers, void 0));
                this.tenants = (__runInitializers(this, _user_extraInitializers), __runInitializers(this, _tenants_initializers, void 0));
                this.defaultTenant = (__runInitializers(this, _tenants_extraInitializers), __runInitializers(this, _defaultTenant_initializers, void 0));
                __runInitializers(this, _defaultTenant_extraInitializers);
                this.token = token;
                this.user = user;
                if (tenants && tenants.length > 0) {
                    this.tenants = tenants;
                }
                if (defaultTenant) {
                    this.defaultTenant = defaultTenant;
                }
            }
            return LoginResponseModel;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _token_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'JWT token de autenticación',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                })];
            _user_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Información del usuario autenticado',
                    example: {
                        uuid: '550e8400-e29b-41d4-a716-446655440000',
                        email: 'user@example.com',
                        userName: 'John',
                        userLastName: 'Doe'
                    }
                })];
            _tenants_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Lista de tenants disponibles para el usuario (multitenancy deshabilitado)',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            tenant_sub: { type: 'string' },
                            slug: { type: 'string' },
                            name: { type: 'string' },
                            is_default: { type: 'boolean' }
                        }
                    },
                    required: false
                })];
            _defaultTenant_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Tenant predeterminado del usuario (multitenancy deshabilitado)',
                    example: '550e8400-e29b-41d4-a716-446655440000',
                    required: false
                })];
            __esDecorate(null, null, _token_decorators, { kind: "field", name: "token", static: false, private: false, access: { has: function (obj) { return "token" in obj; }, get: function (obj) { return obj.token; }, set: function (obj, value) { obj.token = value; } }, metadata: _metadata }, _token_initializers, _token_extraInitializers);
            __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: function (obj) { return "user" in obj; }, get: function (obj) { return obj.user; }, set: function (obj, value) { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
            __esDecorate(null, null, _tenants_decorators, { kind: "field", name: "tenants", static: false, private: false, access: { has: function (obj) { return "tenants" in obj; }, get: function (obj) { return obj.tenants; }, set: function (obj, value) { obj.tenants = value; } }, metadata: _metadata }, _tenants_initializers, _tenants_extraInitializers);
            __esDecorate(null, null, _defaultTenant_decorators, { kind: "field", name: "defaultTenant", static: false, private: false, access: { has: function (obj) { return "defaultTenant" in obj; }, get: function (obj) { return obj.defaultTenant; }, set: function (obj, value) { obj.defaultTenant = value; } }, metadata: _metadata }, _defaultTenant_initializers, _defaultTenant_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.LoginResponseModel = LoginResponseModel;
