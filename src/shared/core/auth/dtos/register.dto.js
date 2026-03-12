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
exports.RegisterDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var RegisterDto = function () {
    var _a;
    var _userEmail_decorators;
    var _userEmail_initializers = [];
    var _userEmail_extraInitializers = [];
    var _userPassword_decorators;
    var _userPassword_initializers = [];
    var _userPassword_extraInitializers = [];
    var _userName_decorators;
    var _userName_initializers = [];
    var _userName_extraInitializers = [];
    var _userLastName_decorators;
    var _userLastName_initializers = [];
    var _userLastName_extraInitializers = [];
    var _userPhone_decorators;
    var _userPhone_initializers = [];
    var _userPhone_extraInitializers = [];
    var _role_idrole_decorators;
    var _role_idrole_initializers = [];
    var _role_idrole_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RegisterDto() {
                this.userEmail = __runInitializers(this, _userEmail_initializers, void 0);
                this.userPassword = (__runInitializers(this, _userEmail_extraInitializers), __runInitializers(this, _userPassword_initializers, void 0));
                this.userName = (__runInitializers(this, _userPassword_extraInitializers), __runInitializers(this, _userName_initializers, void 0));
                this.userLastName = (__runInitializers(this, _userName_extraInitializers), __runInitializers(this, _userLastName_initializers, void 0));
                this.userPhone = (__runInitializers(this, _userLastName_extraInitializers), __runInitializers(this, _userPhone_initializers, void 0));
                this.role_idrole = (__runInitializers(this, _userPhone_extraInitializers), __runInitializers(this, _role_idrole_initializers, void 0));
                __runInitializers(this, _role_idrole_extraInitializers);
            }
            return RegisterDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userEmail_decorators = [(0, swagger_1.ApiProperty)({ example: 'john.doe@example.com', description: 'Email del usuario' }), (0, class_validator_1.IsEmail)()];
            _userPassword_decorators = [(0, swagger_1.ApiProperty)({ example: 'password123', description: 'Contraseña (mínimo 6 caracteres)' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(6)];
            _userName_decorators = [(0, swagger_1.ApiProperty)({ example: 'John', description: 'Nombre del usuario', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _userLastName_decorators = [(0, swagger_1.ApiProperty)({ example: 'Doe', description: 'Apellido del usuario', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _userPhone_decorators = [(0, swagger_1.ApiProperty)({ example: '+1234567890', description: 'Teléfono del usuario', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _role_idrole_decorators = [(0, swagger_1.ApiProperty)({ example: 2, description: 'ID del rol (por defecto: User)', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _userEmail_decorators, { kind: "field", name: "userEmail", static: false, private: false, access: { has: function (obj) { return "userEmail" in obj; }, get: function (obj) { return obj.userEmail; }, set: function (obj, value) { obj.userEmail = value; } }, metadata: _metadata }, _userEmail_initializers, _userEmail_extraInitializers);
            __esDecorate(null, null, _userPassword_decorators, { kind: "field", name: "userPassword", static: false, private: false, access: { has: function (obj) { return "userPassword" in obj; }, get: function (obj) { return obj.userPassword; }, set: function (obj, value) { obj.userPassword = value; } }, metadata: _metadata }, _userPassword_initializers, _userPassword_extraInitializers);
            __esDecorate(null, null, _userName_decorators, { kind: "field", name: "userName", static: false, private: false, access: { has: function (obj) { return "userName" in obj; }, get: function (obj) { return obj.userName; }, set: function (obj, value) { obj.userName = value; } }, metadata: _metadata }, _userName_initializers, _userName_extraInitializers);
            __esDecorate(null, null, _userLastName_decorators, { kind: "field", name: "userLastName", static: false, private: false, access: { has: function (obj) { return "userLastName" in obj; }, get: function (obj) { return obj.userLastName; }, set: function (obj, value) { obj.userLastName = value; } }, metadata: _metadata }, _userLastName_initializers, _userLastName_extraInitializers);
            __esDecorate(null, null, _userPhone_decorators, { kind: "field", name: "userPhone", static: false, private: false, access: { has: function (obj) { return "userPhone" in obj; }, get: function (obj) { return obj.userPhone; }, set: function (obj, value) { obj.userPhone = value; } }, metadata: _metadata }, _userPhone_initializers, _userPhone_extraInitializers);
            __esDecorate(null, null, _role_idrole_decorators, { kind: "field", name: "role_idrole", static: false, private: false, access: { has: function (obj) { return "role_idrole" in obj; }, get: function (obj) { return obj.role_idrole; }, set: function (obj, value) { obj.role_idrole = value; } }, metadata: _metadata }, _role_idrole_initializers, _role_idrole_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RegisterDto = RegisterDto;
