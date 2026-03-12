"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var HealthController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('20 - System'), (0, common_1.Controller)('health')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getHealth_decorators;
    var _getReadiness_decorators;
    var _getLiveness_decorators;
    var HealthController = _classThis = /** @class */ (function () {
        function HealthController_1() {
            __runInitializers(this, _instanceExtraInitializers);
        }
        HealthController_1.prototype.getHealth = function () {
            return {
                status: 'OK',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development',
                version: process.env.npm_package_version || '1.0.0',
                database: {
                    connected: !!process.env.DATABASE_URL,
                    dev_connected: !!process.env.DATABASE_URL_DEV,
                },
                services: {
                    auth: !!process.env.AUTH_URL,
                    smtp: !!process.env.SMTP_HOST,
                    gemini: !!process.env.GEMINI_API_KEY,
                    openai: !!process.env.OPENAI_API_KEY,
                    stripe: !!process.env.STRIPE_SECRET_KEY,
                },
            };
        };
        HealthController_1.prototype.getReadiness = function () {
            // Check if all critical services are available
            var criticalServices = ['DATABASE_URL', 'JWT_SECRET', 'AUTH_URL'];
            var missingServices = criticalServices.filter(function (service) { return !process.env[service]; });
            if (missingServices.length > 0) {
                return {
                    status: 'NOT_READY',
                    missing_services: missingServices,
                    timestamp: new Date().toISOString(),
                };
            }
            return {
                status: 'READY',
                timestamp: new Date().toISOString(),
                services_loaded: criticalServices.length,
            };
        };
        HealthController_1.prototype.getLiveness = function () {
            return {
                status: 'ALIVE',
                timestamp: new Date().toISOString(),
                pid: process.pid,
                memory: process.memoryUsage(),
            };
        };
        return HealthController_1;
    }());
    __setFunctionName(_classThis, "HealthController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getHealth_decorators = [(0, common_1.Get)()];
        _getReadiness_decorators = [(0, common_1.Get)('ready')];
        _getLiveness_decorators = [(0, common_1.Get)('live')];
        __esDecorate(_classThis, null, _getHealth_decorators, { kind: "method", name: "getHealth", static: false, private: false, access: { has: function (obj) { return "getHealth" in obj; }, get: function (obj) { return obj.getHealth; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getReadiness_decorators, { kind: "method", name: "getReadiness", static: false, private: false, access: { has: function (obj) { return "getReadiness" in obj; }, get: function (obj) { return obj.getReadiness; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getLiveness_decorators, { kind: "method", name: "getLiveness", static: false, private: false, access: { has: function (obj) { return "getLiveness" in obj; }, get: function (obj) { return obj.getLiveness; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HealthController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HealthController = _classThis;
}();
exports.HealthController = HealthController;
