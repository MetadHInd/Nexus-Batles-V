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
exports.ModuleModel = void 0;
var swagger_1 = require("@nestjs/swagger");
var ModuleModel = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _module_decorators;
    var _module_initializers = [];
    var _module_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _uuid_decorators;
    var _uuid_initializers = [];
    var _uuid_extraInitializers = [];
    var _slug_decorators;
    var _slug_initializers = [];
    var _slug_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ModuleModel(id, name, module, description, uuid, slug) {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.module = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _module_initializers, void 0));
                this.description = (__runInitializers(this, _module_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.uuid = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _uuid_initializers, void 0));
                this.slug = (__runInitializers(this, _uuid_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
                __runInitializers(this, _slug_extraInitializers);
                this.id = id;
                this.name = name;
                this.module = module;
                this.description = description;
                this.uuid = uuid;
                this.slug = slug;
            }
            ModuleModel.prototype.cacheKey = function () {
                return "module_".concat(this.id);
            };
            ModuleModel.prototype.cacheTTL = function () {
                return 3600; // 1 hora en segundos
            };
            ModuleModel.fromDatabase = function (data) {
                return new _a(data.id, data.name, data.module, data.description, data.uuid, data.slug);
            };
            ModuleModel.fromJSON = function (json) {
                return new _a(json.id, json.name, json.module, json.description, json.uuid, json.slug);
            };
            ModuleModel.prototype.toJSON = function () {
                return {
                    id: this.id,
                    name: this.name,
                    module: this.module,
                    description: this.description,
                    uuid: this.uuid,
                    slug: this.slug,
                };
            };
            return ModuleModel;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({
                    example: 1,
                    description: 'ID único del módulo',
                })];
            _name_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Orders Management',
                    description: 'Nombre del módulo',
                })];
            _module_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'orders',
                    description: 'Identificador del módulo',
                })];
            _description_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Módulo para gestión completa de órdenes',
                    description: 'Descripción detallada del módulo',
                    required: false,
                })];
            _uuid_decorators = [(0, swagger_1.ApiProperty)({
                    example: '550e8400-e29b-41d4-a716-446655440000',
                    description: 'UUID único del módulo',
                })];
            _slug_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'orders-management',
                    description: 'Slug único del módulo',
                    required: false,
                })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _module_decorators, { kind: "field", name: "module", static: false, private: false, access: { has: function (obj) { return "module" in obj; }, get: function (obj) { return obj.module; }, set: function (obj, value) { obj.module = value; } }, metadata: _metadata }, _module_initializers, _module_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _uuid_decorators, { kind: "field", name: "uuid", static: false, private: false, access: { has: function (obj) { return "uuid" in obj; }, get: function (obj) { return obj.uuid; }, set: function (obj, value) { obj.uuid = value; } }, metadata: _metadata }, _uuid_initializers, _uuid_extraInitializers);
            __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: function (obj) { return "slug" in obj; }, get: function (obj) { return obj.slug; }, set: function (obj, value) { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ModuleModel = ModuleModel;
