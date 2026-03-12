"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointCounterService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const constants_1 = require("@nestjs/common/constants");
let EndpointCounterService = class EndpointCounterService {
    modulesContainer;
    reflector;
    constructor(modulesContainer, reflector) {
        this.modulesContainer = modulesContainer;
        this.reflector = reflector;
    }
    countEndpoints() {
        const endpoints = [];
        const controllerCounts = {};
        const httpMethodCounts = {};
        const moduleCounts = {};
        for (const [moduleName, moduleRef] of this.modulesContainer.entries()) {
            const controllers = moduleRef.controllers;
            for (const [, controllerWrapper] of controllers.entries()) {
                if (!controllerWrapper.metatype)
                    continue;
                const controllerInstance = controllerWrapper.instance;
                if (!controllerInstance)
                    continue;
                const controllerPath = this.reflector.get(constants_1.PATH_METADATA, controllerWrapper.metatype) || '';
                const controllerDisplayName = controllerWrapper.metatype.name;
                const moduleDisplayName = this.getModuleDisplayName(moduleName);
                moduleCounts[moduleDisplayName] = moduleCounts[moduleDisplayName] || 0;
                const prototype = Object.getPrototypeOf(controllerInstance);
                const methodNames = Object.getOwnPropertyNames(prototype).filter((name) => name !== 'constructor' &&
                    typeof prototype[name] === 'function');
                for (const methodName of methodNames) {
                    const httpMethod = this.reflector.get(constants_1.METHOD_METADATA, prototype[methodName]);
                    const methodPath = this.reflector.get(constants_1.PATH_METADATA, prototype[methodName]);
                    if (httpMethod && methodPath !== undefined) {
                        const fullPath = this.buildFullPath(controllerPath, methodPath);
                        let httpMethodString;
                        if (Array.isArray(httpMethod)) {
                            httpMethodString =
                                this.mapHttpMethodToString(httpMethod[0]) || 'UNKNOWN';
                        }
                        else if (typeof httpMethod === 'string') {
                            httpMethodString = httpMethod.toUpperCase();
                        }
                        else {
                            httpMethodString = this.mapHttpMethodToString(httpMethod);
                        }
                        const endpointInfo = {
                            controller: controllerDisplayName,
                            method: methodName,
                            path: methodPath,
                            httpMethod: httpMethodString,
                            fullPath: fullPath,
                        };
                        endpoints.push(endpointInfo);
                        controllerCounts[controllerDisplayName] =
                            (controllerCounts[controllerDisplayName] || 0) + 1;
                        httpMethodCounts[httpMethodString] =
                            (httpMethodCounts[httpMethodString] || 0) + 1;
                        moduleCounts[moduleDisplayName]++;
                    }
                }
            }
        }
        return {
            totalEndpoints: endpoints.length,
            endpointsByController: controllerCounts,
            endpointsByHttpMethod: httpMethodCounts,
            endpointsByModule: moduleCounts,
            allEndpoints: endpoints.sort((a, b) => a.controller.localeCompare(b.controller)),
            lastUpdated: new Date().toISOString(),
        };
    }
    getEndpointSummary() {
        const stats = this.countEndpoints();
        const topControllers = Object.entries(stats.endpointsByController)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([name, count]) => ({ name, count }));
        return {
            total: stats.totalEndpoints,
            byHttpMethod: stats.endpointsByHttpMethod,
            topControllers,
            lastUpdated: stats.lastUpdated,
        };
    }
    buildFullPath(controllerPath, methodPath) {
        const basePath = controllerPath.startsWith('/')
            ? controllerPath
            : `/${controllerPath}`;
        if (!methodPath || methodPath === '') {
            return basePath;
        }
        const cleanMethodPath = methodPath.startsWith('/')
            ? methodPath
            : `/${methodPath}`;
        return `${basePath}${cleanMethodPath}`.replace(/\/+/g, '/');
    }
    getModuleDisplayName(moduleName) {
        if (moduleName.includes('Module')) {
            return moduleName
                .replace('Module', '')
                .replace(/([A-Z])/g, ' $1')
                .trim();
        }
        return moduleName;
    }
    searchEndpoints(searchTerm) {
        const stats = this.countEndpoints();
        const term = searchTerm.toLowerCase();
        return stats.allEndpoints.filter((endpoint) => endpoint.controller.toLowerCase().includes(term) ||
            endpoint.method.toLowerCase().includes(term) ||
            endpoint.fullPath.toLowerCase().includes(term) ||
            endpoint.httpMethod.toLowerCase().includes(term));
    }
    mapHttpMethodToString(httpMethod) {
        const methodMap = {
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
    }
};
exports.EndpointCounterService = EndpointCounterService;
exports.EndpointCounterService = EndpointCounterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.ModulesContainer,
        core_1.Reflector])
], EndpointCounterService);
//# sourceMappingURL=endpoint-counter.service.js.map