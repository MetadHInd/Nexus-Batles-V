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
exports.EndpointCounterService = void 0;
var common_1 = require("@nestjs/common");
var constants_1 = require("@nestjs/common/constants");
var EndpointCounterService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EndpointCounterService = _classThis = /** @class */ (function () {
        function EndpointCounterService_1(modulesContainer, reflector) {
            this.modulesContainer = modulesContainer;
            this.reflector = reflector;
        }
        /**
         * Cuenta todos los endpoints de la aplicación
         */
        EndpointCounterService_1.prototype.countEndpoints = function () {
            var endpoints = [];
            var controllerCounts = {};
            var httpMethodCounts = {};
            var moduleCounts = {};
            // Iterar sobre todos los módulos
            for (var _i = 0, _a = this.modulesContainer.entries(); _i < _a.length; _i++) {
                var _b = _a[_i], moduleName = _b[0], moduleRef = _b[1];
                var controllers = moduleRef.controllers;
                var _loop_1 = function (controllerWrapper) {
                    if (!controllerWrapper.metatype)
                        return "continue";
                    var controllerInstance = controllerWrapper.instance;
                    if (!controllerInstance)
                        return "continue";
                    var controllerPath = this_1.reflector.get(constants_1.PATH_METADATA, controllerWrapper.metatype) || '';
                    var controllerDisplayName = controllerWrapper.metatype.name;
                    // Contar endpoints por módulo
                    var moduleDisplayName = this_1.getModuleDisplayName(moduleName);
                    moduleCounts[moduleDisplayName] = moduleCounts[moduleDisplayName] || 0;
                    // Obtener todos los métodos del controlador
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    var prototype = Object.getPrototypeOf(controllerInstance);
                    var methodNames = Object.getOwnPropertyNames(prototype).filter(function (name) {
                        return name !== 'constructor' &&
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            typeof prototype[name] === 'function';
                    });
                    for (var _f = 0, methodNames_1 = methodNames; _f < methodNames_1.length; _f++) {
                        var methodName = methodNames_1[_f];
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        var httpMethod = this_1.reflector.get(constants_1.METHOD_METADATA, prototype[methodName]);
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        var methodPath = this_1.reflector.get(constants_1.PATH_METADATA, prototype[methodName]);
                        if (httpMethod && methodPath !== undefined) {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                            var fullPath = this_1.buildFullPath(controllerPath, methodPath);
                            // Manejar el caso donde httpMethod puede ser un array o string
                            var httpMethodString = void 0;
                            if (Array.isArray(httpMethod)) {
                                httpMethodString =
                                    this_1.mapHttpMethodToString(httpMethod[0]) || 'UNKNOWN';
                            }
                            else if (typeof httpMethod === 'string') {
                                httpMethodString = httpMethod.toUpperCase();
                            }
                            else {
                                httpMethodString = this_1.mapHttpMethodToString(httpMethod);
                            }
                            var endpointInfo = {
                                controller: controllerDisplayName,
                                method: methodName,
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                path: methodPath,
                                httpMethod: httpMethodString,
                                fullPath: fullPath,
                            };
                            endpoints.push(endpointInfo);
                            // Contar por controlador
                            controllerCounts[controllerDisplayName] =
                                (controllerCounts[controllerDisplayName] || 0) + 1;
                            // Contar por método HTTP
                            httpMethodCounts[httpMethodString] =
                                (httpMethodCounts[httpMethodString] || 0) + 1;
                            // Incrementar contador del módulo
                            moduleCounts[moduleDisplayName]++;
                        }
                    }
                };
                var this_1 = this;
                // Iterar sobre todos los controladores del módulo
                for (var _c = 0, _d = controllers.entries(); _c < _d.length; _c++) {
                    var _e = _d[_c], controllerWrapper = _e[1];
                    _loop_1(controllerWrapper);
                }
            }
            return {
                totalEndpoints: endpoints.length,
                endpointsByController: controllerCounts,
                endpointsByHttpMethod: httpMethodCounts,
                endpointsByModule: moduleCounts,
                allEndpoints: endpoints.sort(function (a, b) {
                    return a.controller.localeCompare(b.controller);
                }),
                lastUpdated: new Date().toISOString(),
            };
        };
        /**
         * Obtiene estadísticas resumidas
         */
        EndpointCounterService_1.prototype.getEndpointSummary = function () {
            var stats = this.countEndpoints();
            // Top 10 controladores con más endpoints
            var topControllers = Object.entries(stats.endpointsByController)
                .sort(function (_a, _b) {
                var a = _a[1];
                var b = _b[1];
                return b - a;
            })
                .slice(0, 10)
                .map(function (_a) {
                var name = _a[0], count = _a[1];
                return ({ name: name, count: count });
            });
            return {
                total: stats.totalEndpoints,
                byHttpMethod: stats.endpointsByHttpMethod,
                topControllers: topControllers,
                lastUpdated: stats.lastUpdated,
            };
        };
        /**
         * Construye la ruta completa del endpoint
         */
        EndpointCounterService_1.prototype.buildFullPath = function (controllerPath, methodPath) {
            var basePath = controllerPath.startsWith('/')
                ? controllerPath
                : "/".concat(controllerPath);
            if (!methodPath || methodPath === '') {
                return basePath;
            }
            var cleanMethodPath = methodPath.startsWith('/')
                ? methodPath
                : "/".concat(methodPath);
            return "".concat(basePath).concat(cleanMethodPath).replace(/\/+/g, '/');
        };
        /**
         * Obtiene un nombre legible para el módulo
         */
        EndpointCounterService_1.prototype.getModuleDisplayName = function (moduleName) {
            // Limpiar el nombre del módulo para hacerlo más legible
            if (moduleName.includes('Module')) {
                return moduleName
                    .replace('Module', '')
                    .replace(/([A-Z])/g, ' $1')
                    .trim();
            }
            return moduleName;
        };
        /**
         * Busca endpoints por término
         */
        EndpointCounterService_1.prototype.searchEndpoints = function (searchTerm) {
            var stats = this.countEndpoints();
            var term = searchTerm.toLowerCase();
            return stats.allEndpoints.filter(function (endpoint) {
                return endpoint.controller.toLowerCase().includes(term) ||
                    endpoint.method.toLowerCase().includes(term) ||
                    endpoint.fullPath.toLowerCase().includes(term) ||
                    endpoint.httpMethod.toLowerCase().includes(term);
            });
        };
        /**
         * Mapea números de métodos HTTP a strings
         */
        EndpointCounterService_1.prototype.mapHttpMethodToString = function (httpMethod) {
            // NestJS usa constantes numéricas para los métodos HTTP
            var methodMap = {
                0: 'GET',
                1: 'POST',
                2: 'PUT',
                3: 'DELETE',
                4: 'PATCH',
                5: 'ALL',
                6: 'OPTIONS',
                7: 'HEAD',
            };
            if (typeof httpMethod === 'number') {
                return methodMap[httpMethod] || 'UNKNOWN';
            }
            if (typeof httpMethod === 'string') {
                return httpMethod.toUpperCase();
            }
            return 'UNKNOWN';
        };
        return EndpointCounterService_1;
    }());
    __setFunctionName(_classThis, "EndpointCounterService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EndpointCounterService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EndpointCounterService = _classThis;
}();
exports.EndpointCounterService = EndpointCounterService;
