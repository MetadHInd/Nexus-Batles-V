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
exports.ListUsersDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var pagination_dto_1 = require("../../../../../../../../../src/shared/common/dtos/pagination.dto");
var ListUsersDto = function () {
    var _a;
    var _classSuper = pagination_dto_1.PaginationDto;
    var _userEmail_decorators;
    var _userEmail_initializers = [];
    var _userEmail_extraInitializers = [];
    var _userName_decorators;
    var _userName_initializers = [];
    var _userName_extraInitializers = [];
    var _role_idrole_decorators;
    var _role_idrole_initializers = [];
    var _role_idrole_extraInitializers = [];
    var _is_active_decorators;
    var _is_active_initializers = [];
    var _is_active_extraInitializers = [];
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(ListUsersDto, _super);
            function ListUsersDto() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.userEmail = __runInitializers(_this, _userEmail_initializers, void 0);
                _this.userName = (__runInitializers(_this, _userEmail_extraInitializers), __runInitializers(_this, _userName_initializers, void 0));
                _this.role_idrole = (__runInitializers(_this, _userName_extraInitializers), __runInitializers(_this, _role_idrole_initializers, void 0));
                _this.is_active = (__runInitializers(_this, _role_idrole_extraInitializers), __runInitializers(_this, _is_active_initializers, void 0));
                _this.search = (__runInitializers(_this, _is_active_extraInitializers), __runInitializers(_this, _search_initializers, void 0));
                __runInitializers(_this, _search_extraInitializers);
                return _this;
            }
            return ListUsersDto;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _userEmail_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filtrar por email' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)()];
            _userName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filtrar por nombre' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _role_idrole_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filtrar por rol ID' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _is_active_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filtrar por estado activo' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _search_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Búsqueda general' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _userEmail_decorators, { kind: "field", name: "userEmail", static: false, private: false, access: { has: function (obj) { return "userEmail" in obj; }, get: function (obj) { return obj.userEmail; }, set: function (obj, value) { obj.userEmail = value; } }, metadata: _metadata }, _userEmail_initializers, _userEmail_extraInitializers);
            __esDecorate(null, null, _userName_decorators, { kind: "field", name: "userName", static: false, private: false, access: { has: function (obj) { return "userName" in obj; }, get: function (obj) { return obj.userName; }, set: function (obj, value) { obj.userName = value; } }, metadata: _metadata }, _userName_initializers, _userName_extraInitializers);
            __esDecorate(null, null, _role_idrole_decorators, { kind: "field", name: "role_idrole", static: false, private: false, access: { has: function (obj) { return "role_idrole" in obj; }, get: function (obj) { return obj.role_idrole; }, set: function (obj, value) { obj.role_idrole = value; } }, metadata: _metadata }, _role_idrole_initializers, _role_idrole_extraInitializers);
            __esDecorate(null, null, _is_active_decorators, { kind: "field", name: "is_active", static: false, private: false, access: { has: function (obj) { return "is_active" in obj; }, get: function (obj) { return obj.is_active; }, set: function (obj, value) { obj.is_active = value; } }, metadata: _metadata }, _is_active_initializers, _is_active_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ListUsersDto = ListUsersDto;
