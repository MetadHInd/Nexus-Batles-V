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
exports.AppController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var path_1 = require("path");
var fs_1 = require("fs");
var AppController = function () {
    var _classDecorators = [(0, common_1.Controller)(), (0, swagger_1.ApiTags)('System')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getRoot_decorators;
    var _getLogin_decorators;
    var _getHealth_decorators;
    var AppController = _classThis = /** @class */ (function () {
        function AppController_1(appService) {
            this.appService = (__runInitializers(this, _instanceExtraInitializers), appService);
        }
        AppController_1.prototype.getRoot = function (res) {
            var filePath = (0, path_1.join)(process.cwd(), 'public', 'login.html');
            console.log('🔍 Looking for file at:', filePath);
            console.log('🔍 File exists:', (0, fs_1.existsSync)(filePath));
            console.log('🔍 Current working directory:', process.cwd());
            if ((0, fs_1.existsSync)(filePath)) {
                res.sendFile(filePath);
            }
            else {
                res.status(404).json({
                    error: 'login.html not found',
                    cwd: process.cwd(),
                    expectedPath: filePath
                });
            }
        };
        AppController_1.prototype.getLogin = function (res) {
            // Servir login.html también en /login.html
            var filePath = (0, path_1.join)(process.cwd(), 'public', 'login.html');
            if ((0, fs_1.existsSync)(filePath)) {
                res.sendFile(filePath);
            }
            else {
                res.status(404).json({
                    error: 'login.html not found',
                    cwd: process.cwd(),
                    expectedPath: filePath
                });
            }
        };
        AppController_1.prototype.getHealth = function () {
            return {
                status: 'ok',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
            };
        };
        return AppController_1;
    }());
    __setFunctionName(_classThis, "AppController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getRoot_decorators = [(0, common_1.Get)()];
        _getLogin_decorators = [(0, common_1.Get)('login.html')];
        _getHealth_decorators = [(0, common_1.Get)('health'), (0, swagger_1.ApiOperation)({
                summary: 'Health Check',
                description: 'Check if the application is running correctly',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Application is healthy',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'ok' },
                        timestamp: { type: 'string', example: '2023-12-01T10:00:00.000Z' },
                        uptime: { type: 'number', example: 123.456 },
                    },
                },
            })];
        __esDecorate(_classThis, null, _getRoot_decorators, { kind: "method", name: "getRoot", static: false, private: false, access: { has: function (obj) { return "getRoot" in obj; }, get: function (obj) { return obj.getRoot; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getLogin_decorators, { kind: "method", name: "getLogin", static: false, private: false, access: { has: function (obj) { return "getLogin" in obj; }, get: function (obj) { return obj.getLogin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getHealth_decorators, { kind: "method", name: "getHealth", static: false, private: false, access: { has: function (obj) { return "getHealth" in obj; }, get: function (obj) { return obj.getHealth; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppController = _classThis;
}();
exports.AppController = AppController;
