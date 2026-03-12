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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.RolePermissionDetailModel = exports.RolePermissionModel = void 0;
var swagger_1 = require("@nestjs/swagger");
var RolePermissionModel = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _role_id_decorators;
    var _role_id_initializers = [];
    var _role_id_extraInitializers = [];
    var _permission_id_decorators;
    var _permission_id_initializers = [];
    var _permission_id_extraInitializers = [];
    var _tenant_ids_decorators;
    var _tenant_ids_initializers = [];
    var _tenant_ids_extraInitializers = [];
    var _is_active_decorators;
    var _is_active_initializers = [];
    var _is_active_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RolePermissionModel(id, role_id, permission_id, tenant_ids, is_active) {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.role_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _role_id_initializers, void 0));
                this.permission_id = (__runInitializers(this, _role_id_extraInitializers), __runInitializers(this, _permission_id_initializers, void 0));
                this.tenant_ids = (__runInitializers(this, _permission_id_extraInitializers), __runInitializers(this, _tenant_ids_initializers, void 0));
                this.is_active = (__runInitializers(this, _tenant_ids_extraInitializers), __runInitializers(this, _is_active_initializers, void 0));
                __runInitializers(this, _is_active_extraInitializers);
                this.id = id;
                this.role_id = role_id;
                this.permission_id = permission_id;
                this.tenant_ids = tenant_ids;
                this.is_active = is_active;
            }
            // Métodos de ICacheable
            RolePermissionModel.prototype.cacheKey = function () {
                return "role_permission:".concat(this.id);
            };
            RolePermissionModel.prototype.cacheTTL = function () {
                return 3600; // 1 hora en segundos
            };
            RolePermissionModel.prototype.toJSON = function () {
                return {
                    id: this.id,
                    role_id: this.role_id,
                    permission_id: this.permission_id,
                    tenant_ids: this.tenant_ids,
                    is_active: this.is_active,
                };
            };
            RolePermissionModel.fromJSON = function (json) {
                return new _a(json.id, json.role_id, json.permission_id, json.tenant_ids, json.is_active);
            };
            return RolePermissionModel;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({
                    example: 1,
                    description: 'ID único del role_permission',
                })];
            _role_id_decorators = [(0, swagger_1.ApiProperty)({
                    example: 1,
                    description: 'ID del rol',
                })];
            _permission_id_decorators = [(0, swagger_1.ApiProperty)({
                    example: 1,
                    description: 'ID del permiso',
                })];
            _tenant_ids_decorators = [(0, swagger_1.ApiProperty)({
                    example: ['development', 'production'],
                    description: 'IDs de tenants asociados',
                    type: [String],
                })];
            _is_active_decorators = [(0, swagger_1.ApiProperty)({
                    example: true,
                    description: 'Indica si el permiso está activo para este rol',
                })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _role_id_decorators, { kind: "field", name: "role_id", static: false, private: false, access: { has: function (obj) { return "role_id" in obj; }, get: function (obj) { return obj.role_id; }, set: function (obj, value) { obj.role_id = value; } }, metadata: _metadata }, _role_id_initializers, _role_id_extraInitializers);
            __esDecorate(null, null, _permission_id_decorators, { kind: "field", name: "permission_id", static: false, private: false, access: { has: function (obj) { return "permission_id" in obj; }, get: function (obj) { return obj.permission_id; }, set: function (obj, value) { obj.permission_id = value; } }, metadata: _metadata }, _permission_id_initializers, _permission_id_extraInitializers);
            __esDecorate(null, null, _tenant_ids_decorators, { kind: "field", name: "tenant_ids", static: false, private: false, access: { has: function (obj) { return "tenant_ids" in obj; }, get: function (obj) { return obj.tenant_ids; }, set: function (obj, value) { obj.tenant_ids = value; } }, metadata: _metadata }, _tenant_ids_initializers, _tenant_ids_extraInitializers);
            __esDecorate(null, null, _is_active_decorators, { kind: "field", name: "is_active", static: false, private: false, access: { has: function (obj) { return "is_active" in obj; }, get: function (obj) { return obj.is_active; }, set: function (obj, value) { obj.is_active = value; } }, metadata: _metadata }, _is_active_initializers, _is_active_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RolePermissionModel = RolePermissionModel;
var RolePermissionDetailModel = function () {
    var _a;
    var _classSuper = RolePermissionModel;
    var _permission_decorators;
    var _permission_initializers = [];
    var _permission_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(RolePermissionDetailModel, _super);
            function RolePermissionDetailModel() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.permission = __runInitializers(_this, _permission_initializers, void 0);
                _this.role = (__runInitializers(_this, _permission_extraInitializers), __runInitializers(_this, _role_initializers, void 0));
                __runInitializers(_this, _role_extraInitializers);
                return _this;
            }
            RolePermissionDetailModel.prototype.toJSON = function () {
                return __assign(__assign({ id: this.id, role_id: this.role_id, permission_id: this.permission_id, tenant_ids: this.tenant_ids }, (this.permission && { permission: this.permission })), (this.role && { role: this.role }));
            };
            RolePermissionDetailModel.fromJSON = function (json) {
                var model = new _a(json.id, json.role_id, json.permission_id, json.tenant_ids, json.is_active);
                if (json.permission)
                    model.permission = json.permission;
                if (json.role)
                    model.role = json.role;
                return model;
            };
            return RolePermissionDetailModel;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _permission_decorators = [(0, swagger_1.ApiProperty)({
                    example: {
                        id: 1,
                        code: 'CREATE_ORDER',
                        name: 'Create Order',
                        description: 'Allows user to create new orders',
                        is_active: true,
                    },
                    description: 'Detalles del permiso',
                    required: false,
                })];
            _role_decorators = [(0, swagger_1.ApiProperty)({
                    example: {
                        idrole: 1,
                        description: 'Administrator',
                    },
                    description: 'Detalles del rol',
                    required: false,
                })];
            __esDecorate(null, null, _permission_decorators, { kind: "field", name: "permission", static: false, private: false, access: { has: function (obj) { return "permission" in obj; }, get: function (obj) { return obj.permission; }, set: function (obj, value) { obj.permission = value; } }, metadata: _metadata }, _permission_initializers, _permission_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RolePermissionDetailModel = RolePermissionDetailModel;
