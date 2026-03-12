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
exports.ChangePasswordDto = exports.UpdateUserDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var UpdateUserDto = function () {
    var _a;
    var _userName_decorators;
    var _userName_initializers = [];
    var _userName_extraInitializers = [];
    var _userLastName_decorators;
    var _userLastName_initializers = [];
    var _userLastName_extraInitializers = [];
    var _userEmail_decorators;
    var _userEmail_initializers = [];
    var _userEmail_extraInitializers = [];
    var _userPhone_decorators;
    var _userPhone_initializers = [];
    var _userPhone_extraInitializers = [];
    var _role_idrole_decorators;
    var _role_idrole_initializers = [];
    var _role_idrole_extraInitializers = [];
    var _is_active_decorators;
    var _is_active_initializers = [];
    var _is_active_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateUserDto() {
                this.userName = __runInitializers(this, _userName_initializers, void 0);
                this.userLastName = (__runInitializers(this, _userName_extraInitializers), __runInitializers(this, _userLastName_initializers, void 0));
                this.userEmail = (__runInitializers(this, _userLastName_extraInitializers), __runInitializers(this, _userEmail_initializers, void 0));
                this.userPhone = (__runInitializers(this, _userEmail_extraInitializers), __runInitializers(this, _userPhone_initializers, void 0));
                this.role_idrole = (__runInitializers(this, _userPhone_extraInitializers), __runInitializers(this, _role_idrole_initializers, void 0));
                this.is_active = (__runInitializers(this, _role_idrole_extraInitializers), __runInitializers(this, _is_active_initializers, void 0));
                __runInitializers(this, _is_active_extraInitializers);
            }
            return UpdateUserDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Nombre del usuario' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _userLastName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Apellido del usuario' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _userEmail_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Email del usuario' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)()];
            _userPhone_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Teléfono del usuario' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _role_idrole_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'ID del rol' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _is_active_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Estado activo' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _userName_decorators, { kind: "field", name: "userName", static: false, private: false, access: { has: function (obj) { return "userName" in obj; }, get: function (obj) { return obj.userName; }, set: function (obj, value) { obj.userName = value; } }, metadata: _metadata }, _userName_initializers, _userName_extraInitializers);
            __esDecorate(null, null, _userLastName_decorators, { kind: "field", name: "userLastName", static: false, private: false, access: { has: function (obj) { return "userLastName" in obj; }, get: function (obj) { return obj.userLastName; }, set: function (obj, value) { obj.userLastName = value; } }, metadata: _metadata }, _userLastName_initializers, _userLastName_extraInitializers);
            __esDecorate(null, null, _userEmail_decorators, { kind: "field", name: "userEmail", static: false, private: false, access: { has: function (obj) { return "userEmail" in obj; }, get: function (obj) { return obj.userEmail; }, set: function (obj, value) { obj.userEmail = value; } }, metadata: _metadata }, _userEmail_initializers, _userEmail_extraInitializers);
            __esDecorate(null, null, _userPhone_decorators, { kind: "field", name: "userPhone", static: false, private: false, access: { has: function (obj) { return "userPhone" in obj; }, get: function (obj) { return obj.userPhone; }, set: function (obj, value) { obj.userPhone = value; } }, metadata: _metadata }, _userPhone_initializers, _userPhone_extraInitializers);
            __esDecorate(null, null, _role_idrole_decorators, { kind: "field", name: "role_idrole", static: false, private: false, access: { has: function (obj) { return "role_idrole" in obj; }, get: function (obj) { return obj.role_idrole; }, set: function (obj, value) { obj.role_idrole = value; } }, metadata: _metadata }, _role_idrole_initializers, _role_idrole_extraInitializers);
            __esDecorate(null, null, _is_active_decorators, { kind: "field", name: "is_active", static: false, private: false, access: { has: function (obj) { return "is_active" in obj; }, get: function (obj) { return obj.is_active; }, set: function (obj, value) { obj.is_active = value; } }, metadata: _metadata }, _is_active_initializers, _is_active_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateUserDto = UpdateUserDto;
var ChangePasswordDto = function () {
    var _a;
    var _currentPassword_decorators;
    var _currentPassword_initializers = [];
    var _currentPassword_extraInitializers = [];
    var _newPassword_decorators;
    var _newPassword_initializers = [];
    var _newPassword_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ChangePasswordDto() {
                this.currentPassword = __runInitializers(this, _currentPassword_initializers, void 0);
                this.newPassword = (__runInitializers(this, _currentPassword_extraInitializers), __runInitializers(this, _newPassword_initializers, void 0));
                __runInitializers(this, _newPassword_extraInitializers);
            }
            return ChangePasswordDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _currentPassword_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Contraseña actual' }), (0, class_validator_1.IsString)()];
            _newPassword_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Nueva contraseña' }), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _currentPassword_decorators, { kind: "field", name: "currentPassword", static: false, private: false, access: { has: function (obj) { return "currentPassword" in obj; }, get: function (obj) { return obj.currentPassword; }, set: function (obj, value) { obj.currentPassword = value; } }, metadata: _metadata }, _currentPassword_initializers, _currentPassword_extraInitializers);
            __esDecorate(null, null, _newPassword_decorators, { kind: "field", name: "newPassword", static: false, private: false, access: { has: function (obj) { return "newPassword" in obj; }, get: function (obj) { return obj.newPassword; }, set: function (obj, value) { obj.newPassword = value; } }, metadata: _metadata }, _newPassword_initializers, _newPassword_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ChangePasswordDto = ChangePasswordDto;
