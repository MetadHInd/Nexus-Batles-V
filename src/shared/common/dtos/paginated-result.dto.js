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
exports.SimplePaginatedDto = exports.PaginatedResultDto = void 0;
var swagger_1 = require("@nestjs/swagger");
/**
 * 📊 DTO GENÉRICO PARA RESPUESTAS PAGINADAS
 *
 * Usa la misma estructura que PaginatedResponse pero con decoradores de Swagger
 */
var PaginatedResultDto = function () {
    var _a;
    var _data_decorators;
    var _data_initializers = [];
    var _data_extraInitializers = [];
    var _pagination_decorators;
    var _pagination_initializers = [];
    var _pagination_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PaginatedResultDto() {
                this.data = __runInitializers(this, _data_initializers, void 0);
                this.pagination = (__runInitializers(this, _data_extraInitializers), __runInitializers(this, _pagination_initializers, void 0));
                __runInitializers(this, _pagination_extraInitializers);
            }
            return PaginatedResultDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _data_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Array de datos de la página actual',
                    isArray: true,
                })];
            _pagination_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Metadatos de paginación',
                    type: 'object',
                    properties: {
                        currentPage: { type: 'number', example: 1 },
                        nextPage: { type: 'number', example: 2, nullable: true },
                        maxPage: { type: 'number', example: 10 },
                        totalItems: { type: 'number', example: 100 },
                        itemsPerPage: { type: 'number', example: 10 },
                        hasNextPage: { type: 'boolean', example: true },
                        hasPreviousPage: { type: 'boolean', example: false },
                    },
                })];
            __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: function (obj) { return "data" in obj; }, get: function (obj) { return obj.data; }, set: function (obj, value) { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
            __esDecorate(null, null, _pagination_decorators, { kind: "field", name: "pagination", static: false, private: false, access: { has: function (obj) { return "pagination" in obj; }, get: function (obj) { return obj.pagination; }, set: function (obj, value) { obj.pagination = value; } }, metadata: _metadata }, _pagination_initializers, _pagination_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PaginatedResultDto = PaginatedResultDto;
/**
 * 📋 DTO PARA RESPUESTAS PAGINADAS
 * Estructura completa de paginación con navegación
 */
var SimplePaginatedDto = function () {
    var _a;
    var _data_decorators;
    var _data_initializers = [];
    var _data_extraInitializers = [];
    var _pagination_decorators;
    var _pagination_initializers = [];
    var _pagination_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SimplePaginatedDto() {
                this.data = __runInitializers(this, _data_initializers, void 0);
                this.pagination = (__runInitializers(this, _data_extraInitializers), __runInitializers(this, _pagination_initializers, void 0));
                __runInitializers(this, _pagination_extraInitializers);
            }
            return SimplePaginatedDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _data_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Array de datos de la página actual',
                    isArray: true,
                })];
            _pagination_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Metadatos de paginación completos',
                    type: 'object',
                    properties: {
                        currentPage: { type: 'number', example: 2, description: 'Página actual' },
                        itemsPerPage: { type: 'number', example: 10, description: 'Items por página' },
                        totalItems: { type: 'number', example: 100, description: 'Total de registros' },
                        totalPages: { type: 'number', example: 10, description: 'Total de páginas (maxPage)' },
                        nextPage: { type: 'number', example: 3, nullable: true, description: 'Número de página siguiente (null si es la última)' },
                        previousPage: { type: 'number', example: 1, nullable: true, description: 'Número de página anterior (null si es la primera)' },
                        hasNextPage: { type: 'boolean', example: true, description: 'Indica si hay página siguiente' },
                        hasPreviousPage: { type: 'boolean', example: true, description: 'Indica si hay página anterior' },
                    },
                })];
            __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: function (obj) { return "data" in obj; }, get: function (obj) { return obj.data; }, set: function (obj, value) { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
            __esDecorate(null, null, _pagination_decorators, { kind: "field", name: "pagination", static: false, private: false, access: { has: function (obj) { return "pagination" in obj; }, get: function (obj) { return obj.pagination; }, set: function (obj, value) { obj.pagination = value; } }, metadata: _metadata }, _pagination_initializers, _pagination_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SimplePaginatedDto = SimplePaginatedDto;
