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
exports.AssignPermissionsToRoleDto = exports.RolePermissionPaginationDto = exports.UpdateRolePermissionDto = exports.CreateRolePermissionDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var pagination_dto_1 = require("../../../../../../../../src/shared/common/dtos/pagination.dto");
var CreateRolePermissionDto = function () {
    var _a;
    var _role_id_decorators;
    var _role_id_initializers = [];
    var _role_id_extraInitializers = [];
    var _permission_code_decorators;
    var _permission_code_initializers = [];
    var _permission_code_extraInitializers = [];
    var _is_active_decorators;
    var _is_active_initializers = [];
    var _is_active_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateRolePermissionDto() {
                this.role_id = __runInitializers(this, _role_id_initializers, void 0);
                this.permission_code = (__runInitializers(this, _role_id_extraInitializers), __runInitializers(this, _permission_code_initializers, void 0));
                this.is_active = (__runInitializers(this, _permission_code_extraInitializers), __runInitializers(this, _is_active_initializers, void 0));
                __runInitializers(this, _is_active_extraInitializers);
            }
            return CreateRolePermissionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _role_id_decorators = [(0, swagger_1.ApiProperty)({
                    example: 1,
                    description: 'Role ID',
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _permission_code_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'CREATE_ORDER',
                    description: 'Permission code',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _is_active_decorators = [(0, swagger_1.ApiProperty)({
                    example: true,
                    description: 'Indicates if the permission is active for this role',
                    required: false,
                    default: true,
                }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _role_id_decorators, { kind: "field", name: "role_id", static: false, private: false, access: { has: function (obj) { return "role_id" in obj; }, get: function (obj) { return obj.role_id; }, set: function (obj, value) { obj.role_id = value; } }, metadata: _metadata }, _role_id_initializers, _role_id_extraInitializers);
            __esDecorate(null, null, _permission_code_decorators, { kind: "field", name: "permission_code", static: false, private: false, access: { has: function (obj) { return "permission_code" in obj; }, get: function (obj) { return obj.permission_code; }, set: function (obj, value) { obj.permission_code = value; } }, metadata: _metadata }, _permission_code_initializers, _permission_code_extraInitializers);
            __esDecorate(null, null, _is_active_decorators, { kind: "field", name: "is_active", static: false, private: false, access: { has: function (obj) { return "is_active" in obj; }, get: function (obj) { return obj.is_active; }, set: function (obj, value) { obj.is_active = value; } }, metadata: _metadata }, _is_active_initializers, _is_active_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateRolePermissionDto = CreateRolePermissionDto;
var UpdateRolePermissionDto = function () {
    var _a;
    var _role_id_decorators;
    var _role_id_initializers = [];
    var _role_id_extraInitializers = [];
    var _permission_code_decorators;
    var _permission_code_initializers = [];
    var _permission_code_extraInitializers = [];
    var _is_active_decorators;
    var _is_active_initializers = [];
    var _is_active_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateRolePermissionDto() {
                this.role_id = __runInitializers(this, _role_id_initializers, void 0);
                this.permission_code = (__runInitializers(this, _role_id_extraInitializers), __runInitializers(this, _permission_code_initializers, void 0));
                this.is_active = (__runInitializers(this, _permission_code_extraInitializers), __runInitializers(this, _is_active_initializers, void 0));
                __runInitializers(this, _is_active_extraInitializers);
            }
            return UpdateRolePermissionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _role_id_decorators = [(0, swagger_1.ApiProperty)({
                    example: 1,
                    description: 'Role ID',
                    required: false,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _permission_code_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'CREATE_ORDER',
                    description: 'Permission code',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _is_active_decorators = [(0, swagger_1.ApiProperty)({
                    example: true,
                    description: 'Indicates if the permission is active for this role',
                    required: false,
                }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _role_id_decorators, { kind: "field", name: "role_id", static: false, private: false, access: { has: function (obj) { return "role_id" in obj; }, get: function (obj) { return obj.role_id; }, set: function (obj, value) { obj.role_id = value; } }, metadata: _metadata }, _role_id_initializers, _role_id_extraInitializers);
            __esDecorate(null, null, _permission_code_decorators, { kind: "field", name: "permission_code", static: false, private: false, access: { has: function (obj) { return "permission_code" in obj; }, get: function (obj) { return obj.permission_code; }, set: function (obj, value) { obj.permission_code = value; } }, metadata: _metadata }, _permission_code_initializers, _permission_code_extraInitializers);
            __esDecorate(null, null, _is_active_decorators, { kind: "field", name: "is_active", static: false, private: false, access: { has: function (obj) { return "is_active" in obj; }, get: function (obj) { return obj.is_active; }, set: function (obj, value) { obj.is_active = value; } }, metadata: _metadata }, _is_active_initializers, _is_active_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateRolePermissionDto = UpdateRolePermissionDto;
var RolePermissionPaginationDto = function () {
    var _a;
    var _classSuper = pagination_dto_1.PaginationDto;
    var _role_id_decorators;
    var _role_id_initializers = [];
    var _role_id_extraInitializers = [];
    var _permission_code_decorators;
    var _permission_code_initializers = [];
    var _permission_code_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(RolePermissionPaginationDto, _super);
            function RolePermissionPaginationDto() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.role_id = __runInitializers(_this, _role_id_initializers, void 0);
                _this.permission_code = (__runInitializers(_this, _role_id_extraInitializers), __runInitializers(_this, _permission_code_initializers, void 0));
                __runInitializers(_this, _permission_code_extraInitializers);
                return _this;
            }
            return RolePermissionPaginationDto;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _role_id_decorators = [(0, swagger_1.ApiProperty)({
                    example: 1,
                    description: 'Filter by role ID',
                    required: false,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _permission_code_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'CREATE_ORDER',
                    description: 'Filter by permission code',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _role_id_decorators, { kind: "field", name: "role_id", static: false, private: false, access: { has: function (obj) { return "role_id" in obj; }, get: function (obj) { return obj.role_id; }, set: function (obj, value) { obj.role_id = value; } }, metadata: _metadata }, _role_id_initializers, _role_id_extraInitializers);
            __esDecorate(null, null, _permission_code_decorators, { kind: "field", name: "permission_code", static: false, private: false, access: { has: function (obj) { return "permission_code" in obj; }, get: function (obj) { return obj.permission_code; }, set: function (obj, value) { obj.permission_code = value; } }, metadata: _metadata }, _permission_code_initializers, _permission_code_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RolePermissionPaginationDto = RolePermissionPaginationDto;
var AssignPermissionsToRoleDto = function () {
    var _a;
    var _permission_ids_decorators;
    var _permission_ids_initializers = [];
    var _permission_ids_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AssignPermissionsToRoleDto() {
                this.permission_ids = __runInitializers(this, _permission_ids_initializers, void 0);
                __runInitializers(this, _permission_ids_extraInitializers);
            }
            return AssignPermissionsToRoleDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _permission_ids_decorators = [(0, swagger_1.ApiProperty)({
                    example: [1, 2, 3],
                    description: 'Permission IDs to assign to the role',
                    type: [Number],
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsNumber)({}, { each: true }), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _permission_ids_decorators, { kind: "field", name: "permission_ids", static: false, private: false, access: { has: function (obj) { return "permission_ids" in obj; }, get: function (obj) { return obj.permission_ids; }, set: function (obj, value) { obj.permission_ids = value; } }, metadata: _metadata }, _permission_ids_initializers, _permission_ids_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AssignPermissionsToRoleDto = AssignPermissionsToRoleDto;
