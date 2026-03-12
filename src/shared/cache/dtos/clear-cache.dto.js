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
exports.CacheKeysResponseDto = exports.GetCacheKeysDto = exports.ClearCacheResponseDto = exports.ClearModuleCacheDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var ClearModuleCacheDto = function () {
    var _a;
    var _modules_decorators;
    var _modules_initializers = [];
    var _modules_extraInitializers = [];
    var _tenantId_decorators;
    var _tenantId_initializers = [];
    var _tenantId_extraInitializers = [];
    var _clearAll_decorators;
    var _clearAll_initializers = [];
    var _clearAll_extraInitializers = [];
    var _customPattern_decorators;
    var _customPattern_initializers = [];
    var _customPattern_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ClearModuleCacheDto() {
                this.modules = __runInitializers(this, _modules_initializers, void 0);
                this.tenantId = (__runInitializers(this, _modules_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
                this.clearAll = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _clearAll_initializers, void 0));
                this.customPattern = (__runInitializers(this, _clearAll_extraInitializers), __runInitializers(this, _customPattern_initializers, void 0));
                __runInitializers(this, _customPattern_extraInitializers);
            }
            return ClearModuleCacheDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _modules_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Lista de módulos para limpiar su caché',
                    example: ['order', 'customer', 'menu'],
                    isArray: true,
                    type: String,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _tenantId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Tenant ID específico para limpiar caché (si no se proporciona, limpia del tenant actual)',
                    example: 'aiabase',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _clearAll_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Limpiar todo el caché (ignora módulos específicos)',
                    example: false,
                    default: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _customPattern_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Pattern personalizado para limpiar (formato: tenant:namespace:pattern)',
                    example: '*:order:*',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _modules_decorators, { kind: "field", name: "modules", static: false, private: false, access: { has: function (obj) { return "modules" in obj; }, get: function (obj) { return obj.modules; }, set: function (obj, value) { obj.modules = value; } }, metadata: _metadata }, _modules_initializers, _modules_extraInitializers);
            __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: function (obj) { return "tenantId" in obj; }, get: function (obj) { return obj.tenantId; }, set: function (obj, value) { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
            __esDecorate(null, null, _clearAll_decorators, { kind: "field", name: "clearAll", static: false, private: false, access: { has: function (obj) { return "clearAll" in obj; }, get: function (obj) { return obj.clearAll; }, set: function (obj, value) { obj.clearAll = value; } }, metadata: _metadata }, _clearAll_initializers, _clearAll_extraInitializers);
            __esDecorate(null, null, _customPattern_decorators, { kind: "field", name: "customPattern", static: false, private: false, access: { has: function (obj) { return "customPattern" in obj; }, get: function (obj) { return obj.customPattern; }, set: function (obj, value) { obj.customPattern = value; } }, metadata: _metadata }, _customPattern_initializers, _customPattern_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ClearModuleCacheDto = ClearModuleCacheDto;
var ClearCacheResponseDto = function () {
    var _a;
    var _success_decorators;
    var _success_initializers = [];
    var _success_extraInitializers = [];
    var _message_decorators;
    var _message_initializers = [];
    var _message_extraInitializers = [];
    var _keysDeleted_decorators;
    var _keysDeleted_initializers = [];
    var _keysDeleted_extraInitializers = [];
    var _details_decorators;
    var _details_initializers = [];
    var _details_extraInitializers = [];
    var _tenantId_decorators;
    var _tenantId_initializers = [];
    var _tenantId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ClearCacheResponseDto() {
                this.success = __runInitializers(this, _success_initializers, void 0);
                this.message = (__runInitializers(this, _success_extraInitializers), __runInitializers(this, _message_initializers, void 0));
                this.keysDeleted = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _keysDeleted_initializers, void 0));
                this.details = (__runInitializers(this, _keysDeleted_extraInitializers), __runInitializers(this, _details_initializers, void 0));
                this.tenantId = (__runInitializers(this, _details_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
                __runInitializers(this, _tenantId_extraInitializers);
            }
            return ClearCacheResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _success_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Indica si la operación fue exitosa',
                    example: true,
                })];
            _message_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Mensaje descriptivo del resultado',
                    example: 'Caché limpiado exitosamente para 3 módulos',
                })];
            _keysDeleted_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Número de claves eliminadas',
                    example: 45,
                })];
            _details_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Detalles de los módulos limpiados',
                    example: {
                        order: 15,
                        customer: 20,
                        menu: 10,
                    },
                })];
            _tenantId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Tenant ID usado para la operación',
                    example: 'aiabase',
                })];
            __esDecorate(null, null, _success_decorators, { kind: "field", name: "success", static: false, private: false, access: { has: function (obj) { return "success" in obj; }, get: function (obj) { return obj.success; }, set: function (obj, value) { obj.success = value; } }, metadata: _metadata }, _success_initializers, _success_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: function (obj) { return "message" in obj; }, get: function (obj) { return obj.message; }, set: function (obj, value) { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            __esDecorate(null, null, _keysDeleted_decorators, { kind: "field", name: "keysDeleted", static: false, private: false, access: { has: function (obj) { return "keysDeleted" in obj; }, get: function (obj) { return obj.keysDeleted; }, set: function (obj, value) { obj.keysDeleted = value; } }, metadata: _metadata }, _keysDeleted_initializers, _keysDeleted_extraInitializers);
            __esDecorate(null, null, _details_decorators, { kind: "field", name: "details", static: false, private: false, access: { has: function (obj) { return "details" in obj; }, get: function (obj) { return obj.details; }, set: function (obj, value) { obj.details = value; } }, metadata: _metadata }, _details_initializers, _details_extraInitializers);
            __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: function (obj) { return "tenantId" in obj; }, get: function (obj) { return obj.tenantId; }, set: function (obj, value) { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ClearCacheResponseDto = ClearCacheResponseDto;
var GetCacheKeysDto = function () {
    var _a;
    var _pattern_decorators;
    var _pattern_initializers = [];
    var _pattern_extraInitializers = [];
    var _tenantId_decorators;
    var _tenantId_initializers = [];
    var _tenantId_extraInitializers = [];
    var _module_decorators;
    var _module_initializers = [];
    var _module_extraInitializers = [];
    return _a = /** @class */ (function () {
            function GetCacheKeysDto() {
                this.pattern = __runInitializers(this, _pattern_initializers, void 0);
                this.tenantId = (__runInitializers(this, _pattern_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
                this.module = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _module_initializers, void 0));
                __runInitializers(this, _module_extraInitializers);
            }
            return GetCacheKeysDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _pattern_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Pattern para buscar claves (formato Redis)',
                    example: '*:order:*',
                    default: '*',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _tenantId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Tenant ID específico (si no se proporciona, usa el tenant actual)',
                    example: 'aiabase',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _module_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Módulo específico para filtrar',
                    example: 'order',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _pattern_decorators, { kind: "field", name: "pattern", static: false, private: false, access: { has: function (obj) { return "pattern" in obj; }, get: function (obj) { return obj.pattern; }, set: function (obj, value) { obj.pattern = value; } }, metadata: _metadata }, _pattern_initializers, _pattern_extraInitializers);
            __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: function (obj) { return "tenantId" in obj; }, get: function (obj) { return obj.tenantId; }, set: function (obj, value) { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
            __esDecorate(null, null, _module_decorators, { kind: "field", name: "module", static: false, private: false, access: { has: function (obj) { return "module" in obj; }, get: function (obj) { return obj.module; }, set: function (obj, value) { obj.module = value; } }, metadata: _metadata }, _module_initializers, _module_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.GetCacheKeysDto = GetCacheKeysDto;
var CacheKeysResponseDto = function () {
    var _a;
    var _success_decorators;
    var _success_initializers = [];
    var _success_extraInitializers = [];
    var _totalKeys_decorators;
    var _totalKeys_initializers = [];
    var _totalKeys_extraInitializers = [];
    var _keys_decorators;
    var _keys_initializers = [];
    var _keys_extraInitializers = [];
    var _groupedByModule_decorators;
    var _groupedByModule_initializers = [];
    var _groupedByModule_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CacheKeysResponseDto() {
                this.success = __runInitializers(this, _success_initializers, void 0);
                this.totalKeys = (__runInitializers(this, _success_extraInitializers), __runInitializers(this, _totalKeys_initializers, void 0));
                this.keys = (__runInitializers(this, _totalKeys_extraInitializers), __runInitializers(this, _keys_initializers, void 0));
                this.groupedByModule = (__runInitializers(this, _keys_extraInitializers), __runInitializers(this, _groupedByModule_initializers, void 0));
                __runInitializers(this, _groupedByModule_extraInitializers);
            }
            return CacheKeysResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _success_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Indica si la operación fue exitosa',
                    example: true,
                })];
            _totalKeys_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Total de claves encontradas',
                    example: 125,
                })];
            _keys_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Lista de claves encontradas',
                    example: ['galatea:order:findAll', 'galatea:customer:findById:id=123'],
                    isArray: true,
                })];
            _groupedByModule_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Claves agrupadas por módulo',
                    example: {
                        order: 45,
                        customer: 50,
                        menu: 30,
                    },
                })];
            __esDecorate(null, null, _success_decorators, { kind: "field", name: "success", static: false, private: false, access: { has: function (obj) { return "success" in obj; }, get: function (obj) { return obj.success; }, set: function (obj, value) { obj.success = value; } }, metadata: _metadata }, _success_initializers, _success_extraInitializers);
            __esDecorate(null, null, _totalKeys_decorators, { kind: "field", name: "totalKeys", static: false, private: false, access: { has: function (obj) { return "totalKeys" in obj; }, get: function (obj) { return obj.totalKeys; }, set: function (obj, value) { obj.totalKeys = value; } }, metadata: _metadata }, _totalKeys_initializers, _totalKeys_extraInitializers);
            __esDecorate(null, null, _keys_decorators, { kind: "field", name: "keys", static: false, private: false, access: { has: function (obj) { return "keys" in obj; }, get: function (obj) { return obj.keys; }, set: function (obj, value) { obj.keys = value; } }, metadata: _metadata }, _keys_initializers, _keys_extraInitializers);
            __esDecorate(null, null, _groupedByModule_decorators, { kind: "field", name: "groupedByModule", static: false, private: false, access: { has: function (obj) { return "groupedByModule" in obj; }, get: function (obj) { return obj.groupedByModule; }, set: function (obj, value) { obj.groupedByModule = value; } }, metadata: _metadata }, _groupedByModule_initializers, _groupedByModule_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CacheKeysResponseDto = CacheKeysResponseDto;
