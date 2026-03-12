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
exports.RoleResponseDto = exports.RolePaginationDto = exports.UpdateRoleDto = exports.CreateRoleDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var pagination_dto_1 = require("../../../../../../../../src/shared/common/dtos/pagination.dto");
var class_transformer_1 = require("class-transformer");
var CreateRoleDto = function () {
    var _a;
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _permission_ids_decorators;
    var _permission_ids_initializers = [];
    var _permission_ids_extraInitializers = [];
    var _is_super_decorators;
    var _is_super_initializers = [];
    var _is_super_extraInitializers = [];
    var _hierarchy_level_decorators;
    var _hierarchy_level_initializers = [];
    var _hierarchy_level_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateRoleDto() {
                this.description = __runInitializers(this, _description_initializers, void 0);
                this.permission_ids = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _permission_ids_initializers, void 0));
                this.is_super = (__runInitializers(this, _permission_ids_extraInitializers), __runInitializers(this, _is_super_initializers, void 0));
                this.hierarchy_level = (__runInitializers(this, _is_super_extraInitializers), __runInitializers(this, _hierarchy_level_initializers, void 0));
                __runInitializers(this, _hierarchy_level_extraInitializers);
            }
            return CreateRoleDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _description_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Administrador del Sistema',
                    description: 'Role description',
                    maxLength: 45,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(45)];
            _permission_ids_decorators = [(0, swagger_1.ApiProperty)({
                    example: [1, 2, 3],
                    description: 'Permission IDs to assign to the role',
                    required: false,
                    type: [Number],
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)({}, { each: true }), (0, class_transformer_1.Type)(function () { return Number; })];
            _is_super_decorators = [(0, swagger_1.ApiProperty)({
                    example: false,
                    description: 'Indicates if it is a super administrator role',
                    required: false,
                    default: false,
                }), (0, class_validator_1.IsOptional)()];
            _hierarchy_level_decorators = [(0, swagger_1.ApiProperty)({
                    example: 50,
                    description: 'Hierarchical level of the role (1-100). Higher number = higher authority',
                    required: false,
                    default: 50,
                    minimum: 1,
                    maximum: 100,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100), (0, class_transformer_1.Type)(function () { return Number; })];
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _permission_ids_decorators, { kind: "field", name: "permission_ids", static: false, private: false, access: { has: function (obj) { return "permission_ids" in obj; }, get: function (obj) { return obj.permission_ids; }, set: function (obj, value) { obj.permission_ids = value; } }, metadata: _metadata }, _permission_ids_initializers, _permission_ids_extraInitializers);
            __esDecorate(null, null, _is_super_decorators, { kind: "field", name: "is_super", static: false, private: false, access: { has: function (obj) { return "is_super" in obj; }, get: function (obj) { return obj.is_super; }, set: function (obj, value) { obj.is_super = value; } }, metadata: _metadata }, _is_super_initializers, _is_super_extraInitializers);
            __esDecorate(null, null, _hierarchy_level_decorators, { kind: "field", name: "hierarchy_level", static: false, private: false, access: { has: function (obj) { return "hierarchy_level" in obj; }, get: function (obj) { return obj.hierarchy_level; }, set: function (obj, value) { obj.hierarchy_level = value; } }, metadata: _metadata }, _hierarchy_level_initializers, _hierarchy_level_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateRoleDto = CreateRoleDto;
var UpdateRoleDto = function () {
    var _a;
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _permission_ids_decorators;
    var _permission_ids_initializers = [];
    var _permission_ids_extraInitializers = [];
    var _is_super_decorators;
    var _is_super_initializers = [];
    var _is_super_extraInitializers = [];
    var _hierarchy_level_decorators;
    var _hierarchy_level_initializers = [];
    var _hierarchy_level_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateRoleDto() {
                this.description = __runInitializers(this, _description_initializers, void 0);
                this.permission_ids = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _permission_ids_initializers, void 0));
                this.is_super = (__runInitializers(this, _permission_ids_extraInitializers), __runInitializers(this, _is_super_initializers, void 0));
                this.hierarchy_level = (__runInitializers(this, _is_super_extraInitializers), __runInitializers(this, _hierarchy_level_initializers, void 0));
                __runInitializers(this, _hierarchy_level_extraInitializers);
            }
            return UpdateRoleDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _description_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Administrador del Sistema',
                    description: 'Role description',
                    maxLength: 45,
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(45)];
            _permission_ids_decorators = [(0, swagger_1.ApiProperty)({
                    example: [1, 2, 3],
                    description: 'Permission IDs to assign to the role (replaces existing permissions)',
                    required: false,
                    type: [Number],
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)({}, { each: true }), (0, class_transformer_1.Type)(function () { return Number; })];
            _is_super_decorators = [(0, swagger_1.ApiProperty)({
                    example: false,
                    description: 'Indicates if it is a super administrator role',
                    required: false,
                }), (0, class_validator_1.IsOptional)()];
            _hierarchy_level_decorators = [(0, swagger_1.ApiProperty)({
                    example: 50,
                    description: 'Hierarchical level of the role (1-100). Higher number = higher authority',
                    required: false,
                    minimum: 1,
                    maximum: 100,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100), (0, class_transformer_1.Type)(function () { return Number; })];
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _permission_ids_decorators, { kind: "field", name: "permission_ids", static: false, private: false, access: { has: function (obj) { return "permission_ids" in obj; }, get: function (obj) { return obj.permission_ids; }, set: function (obj, value) { obj.permission_ids = value; } }, metadata: _metadata }, _permission_ids_initializers, _permission_ids_extraInitializers);
            __esDecorate(null, null, _is_super_decorators, { kind: "field", name: "is_super", static: false, private: false, access: { has: function (obj) { return "is_super" in obj; }, get: function (obj) { return obj.is_super; }, set: function (obj, value) { obj.is_super = value; } }, metadata: _metadata }, _is_super_initializers, _is_super_extraInitializers);
            __esDecorate(null, null, _hierarchy_level_decorators, { kind: "field", name: "hierarchy_level", static: false, private: false, access: { has: function (obj) { return "hierarchy_level" in obj; }, get: function (obj) { return obj.hierarchy_level; }, set: function (obj, value) { obj.hierarchy_level = value; } }, metadata: _metadata }, _hierarchy_level_initializers, _hierarchy_level_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateRoleDto = UpdateRoleDto;
var RolePaginationDto = function () {
    var _a;
    var _classSuper = pagination_dto_1.PaginationDto;
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    var _tenant_id_decorators;
    var _tenant_id_initializers = [];
    var _tenant_id_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(RolePaginationDto, _super);
            function RolePaginationDto() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.search = __runInitializers(_this, _search_initializers, void 0);
                _this.tenant_id = (__runInitializers(_this, _search_extraInitializers), __runInitializers(_this, _tenant_id_initializers, void 0));
                __runInitializers(_this, _tenant_id_extraInitializers);
                return _this;
            }
            return RolePaginationDto;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _search_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'admin',
                    description: 'Search by role description',
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _tenant_id_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'development',
                    description: 'Filter by tenant ID',
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _tenant_id_decorators, { kind: "field", name: "tenant_id", static: false, private: false, access: { has: function (obj) { return "tenant_id" in obj; }, get: function (obj) { return obj.tenant_id; }, set: function (obj, value) { obj.tenant_id = value; } }, metadata: _metadata }, _tenant_id_initializers, _tenant_id_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RolePaginationDto = RolePaginationDto;
var RoleResponseDto = function () {
    var _a;
    var _idrole_decorators;
    var _idrole_initializers = [];
    var _idrole_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _tenant_ids_decorators;
    var _tenant_ids_initializers = [];
    var _tenant_ids_extraInitializers = [];
    var _is_super_decorators;
    var _is_super_initializers = [];
    var _is_super_extraInitializers = [];
    var _hierarchy_level_decorators;
    var _hierarchy_level_initializers = [];
    var _hierarchy_level_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RoleResponseDto() {
                this.idrole = __runInitializers(this, _idrole_initializers, void 0);
                this.description = (__runInitializers(this, _idrole_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.tenant_ids = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _tenant_ids_initializers, void 0));
                this.is_super = (__runInitializers(this, _tenant_ids_extraInitializers), __runInitializers(this, _is_super_initializers, void 0));
                this.hierarchy_level = (__runInitializers(this, _is_super_extraInitializers), __runInitializers(this, _hierarchy_level_initializers, void 0));
                __runInitializers(this, _hierarchy_level_extraInitializers);
            }
            return RoleResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _idrole_decorators = [(0, swagger_1.ApiProperty)({
                    example: 1,
                    description: 'Role ID',
                })];
            _description_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Administrador del Sistema',
                    description: 'Role description',
                })];
            _tenant_ids_decorators = [(0, swagger_1.ApiProperty)({
                    example: ['development'],
                    description: 'Associated tenant IDs',
                    type: [String],
                })];
            _is_super_decorators = [(0, swagger_1.ApiProperty)({
                    example: false,
                    description: 'Indicates if it is a super administrator role',
                })];
            _hierarchy_level_decorators = [(0, swagger_1.ApiProperty)({
                    example: 50,
                    description: 'Hierarchical level of the role (1-100). Higher number = higher authority',
                })];
            __esDecorate(null, null, _idrole_decorators, { kind: "field", name: "idrole", static: false, private: false, access: { has: function (obj) { return "idrole" in obj; }, get: function (obj) { return obj.idrole; }, set: function (obj, value) { obj.idrole = value; } }, metadata: _metadata }, _idrole_initializers, _idrole_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _tenant_ids_decorators, { kind: "field", name: "tenant_ids", static: false, private: false, access: { has: function (obj) { return "tenant_ids" in obj; }, get: function (obj) { return obj.tenant_ids; }, set: function (obj, value) { obj.tenant_ids = value; } }, metadata: _metadata }, _tenant_ids_initializers, _tenant_ids_extraInitializers);
            __esDecorate(null, null, _is_super_decorators, { kind: "field", name: "is_super", static: false, private: false, access: { has: function (obj) { return "is_super" in obj; }, get: function (obj) { return obj.is_super; }, set: function (obj, value) { obj.is_super = value; } }, metadata: _metadata }, _is_super_initializers, _is_super_extraInitializers);
            __esDecorate(null, null, _hierarchy_level_decorators, { kind: "field", name: "hierarchy_level", static: false, private: false, access: { has: function (obj) { return "hierarchy_level" in obj; }, get: function (obj) { return obj.hierarchy_level; }, set: function (obj, value) { obj.hierarchy_level = value; } }, metadata: _metadata }, _hierarchy_level_initializers, _hierarchy_level_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RoleResponseDto = RoleResponseDto;
