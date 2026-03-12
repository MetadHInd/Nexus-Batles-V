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
exports.RoleModel = void 0;
var swagger_1 = require("@nestjs/swagger");
var RoleModel = function () {
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
            function RoleModel(idrole, description, tenant_ids, is_super, hierarchy_level) {
                if (hierarchy_level === void 0) { hierarchy_level = 50; }
                this.idrole = __runInitializers(this, _idrole_initializers, void 0);
                this.description = (__runInitializers(this, _idrole_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.tenant_ids = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _tenant_ids_initializers, void 0));
                this.is_super = (__runInitializers(this, _tenant_ids_extraInitializers), __runInitializers(this, _is_super_initializers, void 0));
                this.hierarchy_level = (__runInitializers(this, _is_super_extraInitializers), __runInitializers(this, _hierarchy_level_initializers, void 0));
                __runInitializers(this, _hierarchy_level_extraInitializers);
                this.idrole = idrole;
                this.description = description;
                this.tenant_ids = tenant_ids;
                this.is_super = is_super;
                this.hierarchy_level = hierarchy_level;
            }
            RoleModel.prototype.cacheKey = function () {
                return "role:".concat(this.idrole);
            };
            RoleModel.prototype.cacheTTL = function () {
                // 1 hora en segundos
                return 3600;
            };
            RoleModel.prototype.toJSON = function () {
                return {
                    idrole: this.idrole,
                    description: this.description,
                    tenant_ids: this.tenant_ids,
                    is_super: this.is_super,
                    hierarchy_level: this.hierarchy_level,
                };
            };
            RoleModel.fromJSON = function (json) {
                return new _a(json.idrole, json.description, json.tenant_ids, json.is_super, json.hierarchy_level || 50);
            };
            RoleModel.fromPrisma = function (data) {
                return new _a(data.idrole, data.description, data.tenant_ids, data.is_super, data.hierarchy_level || 50);
            };
            return RoleModel;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _idrole_decorators = [(0, swagger_1.ApiProperty)({
                    example: 1,
                    description: 'Unique role ID',
                })];
            _description_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Administrador',
                    description: 'Role description',
                    maxLength: 45,
                })];
            _tenant_ids_decorators = [(0, swagger_1.ApiProperty)({
                    example: ['development', 'production'],
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
                    minimum: 1,
                    maximum: 100,
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
exports.RoleModel = RoleModel;
