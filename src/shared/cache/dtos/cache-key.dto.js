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
exports.CacheStatsDto = exports.ClearCachePatternDto = exports.SetCacheDto = exports.CachePatternDto = exports.CacheKeyDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CacheKeyDto = function () {
    var _a;
    var _key_decorators;
    var _key_initializers = [];
    var _key_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CacheKeyDto() {
                this.key = __runInitializers(this, _key_initializers, void 0);
                __runInitializers(this, _key_extraInitializers);
            }
            return CacheKeyDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _key_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Clave de cache a buscar',
                    example: 'user_id_1'
                }), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _key_decorators, { kind: "field", name: "key", static: false, private: false, access: { has: function (obj) { return "key" in obj; }, get: function (obj) { return obj.key; }, set: function (obj, value) { obj.key = value; } }, metadata: _metadata }, _key_initializers, _key_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CacheKeyDto = CacheKeyDto;
var CachePatternDto = function () {
    var _a;
    var _pattern_decorators;
    var _pattern_initializers = [];
    var _pattern_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CachePatternDto() {
                this.pattern = __runInitializers(this, _pattern_initializers, void 0);
                __runInitializers(this, _pattern_extraInitializers);
            }
            return CachePatternDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _pattern_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Patrón de búsqueda (soporta wildcards *)',
                    example: 'user_*'
                }), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _pattern_decorators, { kind: "field", name: "pattern", static: false, private: false, access: { has: function (obj) { return "pattern" in obj; }, get: function (obj) { return obj.pattern; }, set: function (obj, value) { obj.pattern = value; } }, metadata: _metadata }, _pattern_initializers, _pattern_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CachePatternDto = CachePatternDto;
var SetCacheDto = function () {
    var _a;
    var _key_decorators;
    var _key_initializers = [];
    var _key_extraInitializers = [];
    var _value_decorators;
    var _value_initializers = [];
    var _value_extraInitializers = [];
    var _ttl_decorators;
    var _ttl_initializers = [];
    var _ttl_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SetCacheDto() {
                this.key = __runInitializers(this, _key_initializers, void 0);
                this.value = (__runInitializers(this, _key_extraInitializers), __runInitializers(this, _value_initializers, void 0));
                this.ttl = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _ttl_initializers, void 0));
                __runInitializers(this, _ttl_extraInitializers);
            }
            return SetCacheDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _key_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Clave del cache',
                    example: 'test_key'
                }), (0, class_validator_1.IsString)()];
            _value_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Valor a guardar (será serializado a JSON)',
                    example: { data: 'test value' }
                })];
            _ttl_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Tiempo de expiración en segundos (opcional)',
                    example: 3600
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            __esDecorate(null, null, _key_decorators, { kind: "field", name: "key", static: false, private: false, access: { has: function (obj) { return "key" in obj; }, get: function (obj) { return obj.key; }, set: function (obj, value) { obj.key = value; } }, metadata: _metadata }, _key_initializers, _key_extraInitializers);
            __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: function (obj) { return "value" in obj; }, get: function (obj) { return obj.value; }, set: function (obj, value) { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(null, null, _ttl_decorators, { kind: "field", name: "ttl", static: false, private: false, access: { has: function (obj) { return "ttl" in obj; }, get: function (obj) { return obj.ttl; }, set: function (obj, value) { obj.ttl = value; } }, metadata: _metadata }, _ttl_initializers, _ttl_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SetCacheDto = SetCacheDto;
var ClearCachePatternDto = function () {
    var _a;
    var _pattern_decorators;
    var _pattern_initializers = [];
    var _pattern_extraInitializers = [];
    var _paginationOnly_decorators;
    var _paginationOnly_initializers = [];
    var _paginationOnly_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ClearCachePatternDto() {
                this.pattern = __runInitializers(this, _pattern_initializers, void 0);
                this.paginationOnly = (__runInitializers(this, _pattern_extraInitializers), __runInitializers(this, _paginationOnly_initializers, void 0));
                __runInitializers(this, _paginationOnly_extraInitializers);
            }
            return ClearCachePatternDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _pattern_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Patrón específico a limpiar (opcional, si no se provee limpia todo)',
                    example: 'users_*'
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _paginationOnly_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Solo limpiar caches de paginación',
                    default: false
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _pattern_decorators, { kind: "field", name: "pattern", static: false, private: false, access: { has: function (obj) { return "pattern" in obj; }, get: function (obj) { return obj.pattern; }, set: function (obj, value) { obj.pattern = value; } }, metadata: _metadata }, _pattern_initializers, _pattern_extraInitializers);
            __esDecorate(null, null, _paginationOnly_decorators, { kind: "field", name: "paginationOnly", static: false, private: false, access: { has: function (obj) { return "paginationOnly" in obj; }, get: function (obj) { return obj.paginationOnly; }, set: function (obj, value) { obj.paginationOnly = value; } }, metadata: _metadata }, _paginationOnly_initializers, _paginationOnly_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ClearCachePatternDto = ClearCachePatternDto;
var CacheStatsDto = function () {
    var _a;
    var _totalKeys_decorators;
    var _totalKeys_initializers = [];
    var _totalKeys_extraInitializers = [];
    var _memoryUsage_decorators;
    var _memoryUsage_initializers = [];
    var _memoryUsage_extraInitializers = [];
    var _connected_decorators;
    var _connected_initializers = [];
    var _connected_extraInitializers = [];
    var _serverInfo_decorators;
    var _serverInfo_initializers = [];
    var _serverInfo_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CacheStatsDto() {
                this.totalKeys = __runInitializers(this, _totalKeys_initializers, void 0);
                this.memoryUsage = (__runInitializers(this, _totalKeys_extraInitializers), __runInitializers(this, _memoryUsage_initializers, void 0));
                this.connected = (__runInitializers(this, _memoryUsage_extraInitializers), __runInitializers(this, _connected_initializers, void 0));
                this.serverInfo = (__runInitializers(this, _connected_extraInitializers), __runInitializers(this, _serverInfo_initializers, void 0));
                __runInitializers(this, _serverInfo_extraInitializers);
            }
            return CacheStatsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _totalKeys_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total de claves en cache' })];
            _memoryUsage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Uso de memoria estimado (bytes)' })];
            _connected_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estado de conexión con Redis' })];
            _serverInfo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Información del servidor Redis' })];
            __esDecorate(null, null, _totalKeys_decorators, { kind: "field", name: "totalKeys", static: false, private: false, access: { has: function (obj) { return "totalKeys" in obj; }, get: function (obj) { return obj.totalKeys; }, set: function (obj, value) { obj.totalKeys = value; } }, metadata: _metadata }, _totalKeys_initializers, _totalKeys_extraInitializers);
            __esDecorate(null, null, _memoryUsage_decorators, { kind: "field", name: "memoryUsage", static: false, private: false, access: { has: function (obj) { return "memoryUsage" in obj; }, get: function (obj) { return obj.memoryUsage; }, set: function (obj, value) { obj.memoryUsage = value; } }, metadata: _metadata }, _memoryUsage_initializers, _memoryUsage_extraInitializers);
            __esDecorate(null, null, _connected_decorators, { kind: "field", name: "connected", static: false, private: false, access: { has: function (obj) { return "connected" in obj; }, get: function (obj) { return obj.connected; }, set: function (obj, value) { obj.connected = value; } }, metadata: _metadata }, _connected_initializers, _connected_extraInitializers);
            __esDecorate(null, null, _serverInfo_decorators, { kind: "field", name: "serverInfo", static: false, private: false, access: { has: function (obj) { return "serverInfo" in obj; }, get: function (obj) { return obj.serverInfo; }, set: function (obj, value) { obj.serverInfo = value; } }, metadata: _metadata }, _serverInfo_initializers, _serverInfo_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CacheStatsDto = CacheStatsDto;
