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
exports.BulkDeleteModuleDto = exports.UpdateModuleDto = exports.CreateModuleDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var CreateModuleDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _module_decorators;
    var _module_initializers = [];
    var _module_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _slug_decorators;
    var _slug_initializers = [];
    var _slug_extraInitializers = [];
    var _action_ids_decorators;
    var _action_ids_initializers = [];
    var _action_ids_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateModuleDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.module = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _module_initializers, void 0));
                this.description = (__runInitializers(this, _module_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.slug = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
                this.action_ids = (__runInitializers(this, _slug_extraInitializers), __runInitializers(this, _action_ids_initializers, void 0));
                __runInitializers(this, _action_ids_extraInitializers);
            }
            return CreateModuleDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Orders Management',
                    description: 'Nombre del módulo',
                    maxLength: 150,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(150)];
            _module_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'orders',
                    description: 'Identificador del módulo',
                    maxLength: 150,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(150)];
            _description_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Módulo para gestión completa de órdenes',
                    description: 'Descripción detallada del módulo',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _slug_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'orders-management',
                    description: 'Slug único del módulo',
                    maxLength: 255,
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(255)];
            _action_ids_decorators = [(0, swagger_1.ApiProperty)({
                    example: [1, 2, 3],
                    description: 'Array de IDs de actions para crear permisos automáticamente',
                    type: [Number],
                    required: false,
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)({ each: true }), (0, class_transformer_1.Type)(function () { return Number; })];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _module_decorators, { kind: "field", name: "module", static: false, private: false, access: { has: function (obj) { return "module" in obj; }, get: function (obj) { return obj.module; }, set: function (obj, value) { obj.module = value; } }, metadata: _metadata }, _module_initializers, _module_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: function (obj) { return "slug" in obj; }, get: function (obj) { return obj.slug; }, set: function (obj, value) { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
            __esDecorate(null, null, _action_ids_decorators, { kind: "field", name: "action_ids", static: false, private: false, access: { has: function (obj) { return "action_ids" in obj; }, get: function (obj) { return obj.action_ids; }, set: function (obj, value) { obj.action_ids = value; } }, metadata: _metadata }, _action_ids_initializers, _action_ids_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateModuleDto = CreateModuleDto;
var UpdateModuleDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _module_decorators;
    var _module_initializers = [];
    var _module_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _slug_decorators;
    var _slug_initializers = [];
    var _slug_extraInitializers = [];
    var _action_ids_decorators;
    var _action_ids_initializers = [];
    var _action_ids_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateModuleDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.module = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _module_initializers, void 0));
                this.description = (__runInitializers(this, _module_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.slug = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
                this.action_ids = (__runInitializers(this, _slug_extraInitializers), __runInitializers(this, _action_ids_initializers, void 0));
                __runInitializers(this, _action_ids_extraInitializers);
            }
            return UpdateModuleDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Orders Management Updated',
                    description: 'Nombre del módulo',
                    maxLength: 150,
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(150)];
            _module_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'orders-v2',
                    description: 'Identificador del módulo',
                    maxLength: 150,
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(150)];
            _description_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Descripción actualizada',
                    description: 'Descripción detallada del módulo',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _slug_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'orders-management-v2',
                    description: 'Slug único del módulo',
                    maxLength: 255,
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(255)];
            _action_ids_decorators = [(0, swagger_1.ApiProperty)({
                    example: [1, 2, 3],
                    description: 'Array de IDs de actions para crear permisos automáticamente',
                    type: [Number],
                    required: false,
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)({ each: true }), (0, class_transformer_1.Type)(function () { return Number; })];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _module_decorators, { kind: "field", name: "module", static: false, private: false, access: { has: function (obj) { return "module" in obj; }, get: function (obj) { return obj.module; }, set: function (obj, value) { obj.module = value; } }, metadata: _metadata }, _module_initializers, _module_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: function (obj) { return "slug" in obj; }, get: function (obj) { return obj.slug; }, set: function (obj, value) { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
            __esDecorate(null, null, _action_ids_decorators, { kind: "field", name: "action_ids", static: false, private: false, access: { has: function (obj) { return "action_ids" in obj; }, get: function (obj) { return obj.action_ids; }, set: function (obj, value) { obj.action_ids = value; } }, metadata: _metadata }, _action_ids_initializers, _action_ids_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateModuleDto = UpdateModuleDto;
var BulkDeleteModuleDto = function () {
    var _a;
    var _ids_decorators;
    var _ids_initializers = [];
    var _ids_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BulkDeleteModuleDto() {
                this.ids = __runInitializers(this, _ids_initializers, void 0);
                __runInitializers(this, _ids_extraInitializers);
            }
            return BulkDeleteModuleDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _ids_decorators = [(0, swagger_1.ApiProperty)({
                    example: [1, 2, 3],
                    description: 'Array de IDs de módulos a eliminar',
                    type: [Number],
                }), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _ids_decorators, { kind: "field", name: "ids", static: false, private: false, access: { has: function (obj) { return "ids" in obj; }, get: function (obj) { return obj.ids; }, set: function (obj, value) { obj.ids = value; } }, metadata: _metadata }, _ids_initializers, _ids_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BulkDeleteModuleDto = BulkDeleteModuleDto;
