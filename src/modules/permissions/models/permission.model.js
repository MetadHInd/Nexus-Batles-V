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
exports.PermissionModel = void 0;
var swagger_1 = require("@nestjs/swagger");
var PermissionModel = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
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
    var _tenant_ids_decorators;
    var _tenant_ids_initializers = [];
    var _tenant_ids_extraInitializers = [];
    var _action_id_decorators;
    var _action_id_initializers = [];
    var _action_id_extraInitializers = [];
    var _module_id_decorators;
    var _module_id_initializers = [];
    var _module_id_extraInitializers = [];
    var _slug_decorators;
    var _slug_initializers = [];
    var _slug_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PermissionModel(id, code, name, description, is_active, tenant_ids, action_id, module_id, slug) {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.code = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _code_initializers, void 0));
                this.name = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.is_active = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _is_active_initializers, void 0));
                this.tenant_ids = (__runInitializers(this, _is_active_extraInitializers), __runInitializers(this, _tenant_ids_initializers, void 0));
                this.action_id = (__runInitializers(this, _tenant_ids_extraInitializers), __runInitializers(this, _action_id_initializers, void 0));
                this.module_id = (__runInitializers(this, _action_id_extraInitializers), __runInitializers(this, _module_id_initializers, void 0));
                this.slug = (__runInitializers(this, _module_id_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
                __runInitializers(this, _slug_extraInitializers);
                this.id = id;
                this.code = code;
                this.name = name;
                this.description = description;
                this.is_active = is_active;
                this.tenant_ids = tenant_ids;
                this.action_id = action_id;
                this.module_id = module_id;
                this.slug = slug;
            }
            // Métodos de ICacheable
            PermissionModel.prototype.cacheKey = function () {
                return "permission:".concat(this.id);
            };
            PermissionModel.prototype.cacheTTL = function () {
                return 3600; // 1 hora en segundos
            };
            PermissionModel.prototype.toJSON = function () {
                return {
                    id: this.id,
                    code: this.code,
                    name: this.name,
                    description: this.description,
                    is_active: this.is_active,
                    tenant_ids: this.tenant_ids,
                    action_id: this.action_id,
                    module_id: this.module_id,
                    slug: this.slug,
                };
            };
            PermissionModel.fromJSON = function (json) {
                return new _a(json.id, json.code, json.name, json.description, json.is_active, json.tenant_ids, json.action_id, json.module_id, json.slug);
            };
            return PermissionModel;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({
                    example: 1,
                    description: 'ID único del permiso',
                })];
            _code_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'CREATE_ORDER',
                    description: 'Código único del permiso',
                })];
            _name_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Create Order',
                    description: 'Nombre descriptivo del permiso',
                })];
            _description_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Allows user to create new orders',
                    description: 'Descripción detallada del permiso',
                    required: false,
                })];
            _is_active_decorators = [(0, swagger_1.ApiProperty)({
                    example: true,
                    description: 'Indica si el permiso está activo',
                })];
            _tenant_ids_decorators = [(0, swagger_1.ApiProperty)({
                    example: ['development', 'production'],
                    description: 'IDs de tenants asociados',
                    type: [String],
                })];
            _action_id_decorators = [(0, swagger_1.ApiProperty)({
                    example: 1,
                    description: 'ID de la acción asociada',
                    required: false,
                })];
            _module_id_decorators = [(0, swagger_1.ApiProperty)({
                    example: 1,
                    description: 'ID del módulo asociado',
                })];
            _slug_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'orders-management:create',
                    description: 'Slug único del permiso',
                    required: false,
                })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: function (obj) { return "code" in obj; }, get: function (obj) { return obj.code; }, set: function (obj, value) { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _is_active_decorators, { kind: "field", name: "is_active", static: false, private: false, access: { has: function (obj) { return "is_active" in obj; }, get: function (obj) { return obj.is_active; }, set: function (obj, value) { obj.is_active = value; } }, metadata: _metadata }, _is_active_initializers, _is_active_extraInitializers);
            __esDecorate(null, null, _tenant_ids_decorators, { kind: "field", name: "tenant_ids", static: false, private: false, access: { has: function (obj) { return "tenant_ids" in obj; }, get: function (obj) { return obj.tenant_ids; }, set: function (obj, value) { obj.tenant_ids = value; } }, metadata: _metadata }, _tenant_ids_initializers, _tenant_ids_extraInitializers);
            __esDecorate(null, null, _action_id_decorators, { kind: "field", name: "action_id", static: false, private: false, access: { has: function (obj) { return "action_id" in obj; }, get: function (obj) { return obj.action_id; }, set: function (obj, value) { obj.action_id = value; } }, metadata: _metadata }, _action_id_initializers, _action_id_extraInitializers);
            __esDecorate(null, null, _module_id_decorators, { kind: "field", name: "module_id", static: false, private: false, access: { has: function (obj) { return "module_id" in obj; }, get: function (obj) { return obj.module_id; }, set: function (obj, value) { obj.module_id = value; } }, metadata: _metadata }, _module_id_initializers, _module_id_extraInitializers);
            __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: function (obj) { return "slug" in obj; }, get: function (obj) { return obj.slug; }, set: function (obj, value) { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PermissionModel = PermissionModel;
