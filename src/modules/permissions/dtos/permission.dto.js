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
exports.PermissionPaginationDto = exports.UpdatePermissionDto = exports.CreatePermissionDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var pagination_dto_1 = require("../../../../../../../../src/shared/common/dtos/pagination.dto");
var CreatePermissionDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _is_active_decorators;
    var _is_active_initializers = [];
    var _is_active_extraInitializers = [];
    var _action_id_decorators;
    var _action_id_initializers = [];
    var _action_id_extraInitializers = [];
    var _module_id_decorators;
    var _module_id_initializers = [];
    var _module_id_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePermissionDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.is_active = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _is_active_initializers, void 0));
                this.action_id = (__runInitializers(this, _is_active_extraInitializers), __runInitializers(this, _action_id_initializers, void 0));
                this.module_id = (__runInitializers(this, _action_id_extraInitializers), __runInitializers(this, _module_id_initializers, void 0));
                __runInitializers(this, _module_id_extraInitializers);
            }
            return CreatePermissionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Create Order',
                    description: 'Nombre descriptivo del permiso (se genera automáticamente si no se proporciona)',
                    maxLength: 255,
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Allows user to create new orders',
                    description: 'Descripción detallada del permiso',
                    maxLength: 500,
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(500)];
            _is_active_decorators = [(0, swagger_1.ApiProperty)({
                    example: true,
                    description: 'Indica si el permiso está activo',
                    required: false,
                    default: true,
                }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _action_id_decorators = [(0, swagger_1.ApiProperty)({
                    example: 1,
                    description: 'ID de la acción asociada',
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _module_id_decorators = [(0, swagger_1.ApiProperty)({
                    example: 1,
                    description: 'ID del módulo asociado',
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _is_active_decorators, { kind: "field", name: "is_active", static: false, private: false, access: { has: function (obj) { return "is_active" in obj; }, get: function (obj) { return obj.is_active; }, set: function (obj, value) { obj.is_active = value; } }, metadata: _metadata }, _is_active_initializers, _is_active_extraInitializers);
            __esDecorate(null, null, _action_id_decorators, { kind: "field", name: "action_id", static: false, private: false, access: { has: function (obj) { return "action_id" in obj; }, get: function (obj) { return obj.action_id; }, set: function (obj, value) { obj.action_id = value; } }, metadata: _metadata }, _action_id_initializers, _action_id_extraInitializers);
            __esDecorate(null, null, _module_id_decorators, { kind: "field", name: "module_id", static: false, private: false, access: { has: function (obj) { return "module_id" in obj; }, get: function (obj) { return obj.module_id; }, set: function (obj, value) { obj.module_id = value; } }, metadata: _metadata }, _module_id_initializers, _module_id_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePermissionDto = CreatePermissionDto;
var UpdatePermissionDto = function () {
    var _a;
    var _code_decorators;
    var _code_initializers = [];
    var _code_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _is_active_decorators;
    var _is_active_initializers = [];
    var _is_active_extraInitializers = [];
    var _action_id_decorators;
    var _action_id_initializers = [];
    var _action_id_extraInitializers = [];
    var _module_id_decorators;
    var _module_id_initializers = [];
    var _module_id_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdatePermissionDto() {
                this.code = __runInitializers(this, _code_initializers, void 0);
                this.name = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.is_active = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _is_active_initializers, void 0));
                this.action_id = (__runInitializers(this, _is_active_extraInitializers), __runInitializers(this, _action_id_initializers, void 0));
                this.module_id = (__runInitializers(this, _action_id_extraInitializers), __runInitializers(this, _module_id_initializers, void 0));
                __runInitializers(this, _module_id_extraInitializers);
            }
            return UpdatePermissionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _code_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'CREATE_ORDER',
                    description: 'Código único del permiso',
                    maxLength: 100,
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(100)];
            _name_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Create Order',
                    description: 'Nombre descriptivo del permiso',
                    maxLength: 255,
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Allows user to create new orders',
                    description: 'Descripción detallada del permiso',
                    maxLength: 500,
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(500)];
            _is_active_decorators = [(0, swagger_1.ApiProperty)({
                    example: true,
                    description: 'Indica si el permiso está activo',
                    required: false,
                }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _action_id_decorators = [(0, swagger_1.ApiProperty)({
                    example: 1,
                    description: 'ID de la acción asociada',
                    required: false,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _module_id_decorators = [(0, swagger_1.ApiProperty)({
                    example: 1,
                    description: 'ID del módulo asociado',
                    required: false,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: function (obj) { return "code" in obj; }, get: function (obj) { return obj.code; }, set: function (obj, value) { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _is_active_decorators, { kind: "field", name: "is_active", static: false, private: false, access: { has: function (obj) { return "is_active" in obj; }, get: function (obj) { return obj.is_active; }, set: function (obj, value) { obj.is_active = value; } }, metadata: _metadata }, _is_active_initializers, _is_active_extraInitializers);
            __esDecorate(null, null, _action_id_decorators, { kind: "field", name: "action_id", static: false, private: false, access: { has: function (obj) { return "action_id" in obj; }, get: function (obj) { return obj.action_id; }, set: function (obj, value) { obj.action_id = value; } }, metadata: _metadata }, _action_id_initializers, _action_id_extraInitializers);
            __esDecorate(null, null, _module_id_decorators, { kind: "field", name: "module_id", static: false, private: false, access: { has: function (obj) { return "module_id" in obj; }, get: function (obj) { return obj.module_id; }, set: function (obj, value) { obj.module_id = value; } }, metadata: _metadata }, _module_id_initializers, _module_id_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdatePermissionDto = UpdatePermissionDto;
var PermissionPaginationDto = function () {
    var _a;
    var _classSuper = pagination_dto_1.PaginationDto;
    var _is_active_decorators;
    var _is_active_initializers = [];
    var _is_active_extraInitializers = [];
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(PermissionPaginationDto, _super);
            function PermissionPaginationDto() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.is_active = __runInitializers(_this, _is_active_initializers, void 0);
                _this.search = (__runInitializers(_this, _is_active_extraInitializers), __runInitializers(_this, _search_initializers, void 0));
                __runInitializers(_this, _search_extraInitializers);
                return _this;
            }
            return PermissionPaginationDto;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _is_active_decorators = [(0, swagger_1.ApiProperty)({
                    example: true,
                    description: 'Filtrar por permisos activos/inactivos',
                    required: false,
                }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _search_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'CREATE',
                    description: 'Buscar por código de permiso (coincidencia parcial)',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _is_active_decorators, { kind: "field", name: "is_active", static: false, private: false, access: { has: function (obj) { return "is_active" in obj; }, get: function (obj) { return obj.is_active; }, set: function (obj, value) { obj.is_active = value; } }, metadata: _metadata }, _is_active_initializers, _is_active_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PermissionPaginationDto = PermissionPaginationDto;
