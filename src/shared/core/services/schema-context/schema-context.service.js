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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaContextService = void 0;
var common_1 = require("@nestjs/common");
var async_hooks_1 = require("async_hooks");
/**
 * 🔐 Schema Context Service
 *
 * Maneja el contexto del schema/tenant usando AsyncLocalStorage
 * para mantener el contexto aislado por request sin pasar parámetros.
 *
 * Thread-safe y compatible con async/await.
 */
var SchemaContextService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SchemaContextService = _classThis = /** @class */ (function () {
        function SchemaContextService_1() {
            this.asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
        }
        /**
         * Ejecutar código dentro de un contexto de schema específico
         */
        SchemaContextService_1.prototype.run = function (context, callback) {
            return this.asyncLocalStorage.run(context, callback);
        };
        /**
         * Obtener el contexto actual del schema
         */
        SchemaContextService_1.prototype.getContext = function () {
            return this.asyncLocalStorage.getStore();
        };
        /**
         * Obtener el nombre del schema actual
         */
        SchemaContextService_1.prototype.getCurrentSchema = function () {
            var context = this.getContext();
            return context === null || context === void 0 ? void 0 : context.schemaName;
        };
        /**
         * Obtener el UUID del tenant actual
         */
        SchemaContextService_1.prototype.getCurrentTenantUuid = function () {
            var context = this.getContext();
            return context === null || context === void 0 ? void 0 : context.tenantUuid;
        };
        /**
         * Verificar si hay un contexto activo
         */
        SchemaContextService_1.prototype.hasContext = function () {
            return this.getContext() !== undefined;
        };
        /**
         * Limpiar el contexto (útil para testing)
         */
        SchemaContextService_1.prototype.clearContext = function () {
            // AsyncLocalStorage se limpia automáticamente al salir del scope
            // Este método es principalmente para compatibilidad y testing
        };
        return SchemaContextService_1;
    }());
    __setFunctionName(_classThis, "SchemaContextService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SchemaContextService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SchemaContextService = _classThis;
}();
exports.SchemaContextService = SchemaContextService;
