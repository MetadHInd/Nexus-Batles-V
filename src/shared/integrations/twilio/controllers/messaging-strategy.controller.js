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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingStrategyController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var MessagingStrategyController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('04 - Messaging Strategy'), (0, common_1.Controller)('messaging-strategy'), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _listStrategies_decorators;
    var _getServiceConfig_decorators;
    var _getPhoneNumber_decorators;
    var _sendSms_decorators;
    var _sendWhatsApp_decorators;
    var _health_decorators;
    var MessagingStrategyController = _classThis = /** @class */ (function () {
        function MessagingStrategyController_1(strategyManager) {
            this.strategyManager = (__runInitializers(this, _instanceExtraInitializers), strategyManager);
        }
        MessagingStrategyController_1.prototype.listStrategies = function () {
            return {
                strategies: this.strategyManager.listStrategies(),
            };
        };
        MessagingStrategyController_1.prototype.getServiceConfig = function (serviceId) {
            return __awaiter(this, void 0, void 0, function () {
                var config;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.strategyManager.getServiceConfig(serviceId)];
                        case 1:
                            config = _a.sent();
                            return [2 /*return*/, {
                                    success: !!config,
                                    config: config,
                                }];
                    }
                });
            });
        };
        MessagingStrategyController_1.prototype.getPhoneNumber = function (serviceId) {
            return __awaiter(this, void 0, void 0, function () {
                var phoneNumber;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.strategyManager.getPhoneNumber(serviceId)];
                        case 1:
                            phoneNumber = _a.sent();
                            return [2 /*return*/, {
                                    success: !!phoneNumber,
                                    phoneNumber: phoneNumber,
                                }];
                    }
                });
            });
        };
        MessagingStrategyController_1.prototype.sendSms = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.strategyManager.sendSms(body.message, body.serviceId || 'default')];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        MessagingStrategyController_1.prototype.sendWhatsApp = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.strategyManager.sendWhatsApp(body.message, body.serviceId || 'default')];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        MessagingStrategyController_1.prototype.health = function () {
            return {
                status: 'ok',
                strategies: this.strategyManager.listStrategies(),
                timestamp: new Date().toISOString(),
            };
        };
        return MessagingStrategyController_1;
    }());
    __setFunctionName(_classThis, "MessagingStrategyController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _listStrategies_decorators = [(0, common_1.Get)('strategies'), (0, swagger_1.ApiOperation)({
                summary: 'Listar estrategias disponibles',
                description: 'Retorna todas las estrategias de mensajería configuradas'
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Lista de estrategias obtenida exitosamente',
                schema: {
                    type: 'object',
                    properties: {
                        strategies: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['twilio', 'aws-sns', 'custom']
                        }
                    }
                }
            })];
        _getServiceConfig_decorators = [(0, common_1.Get)('service/:serviceId/config'), (0, swagger_1.ApiOperation)({
                summary: 'Obtener configuración de servicio',
                description: 'Retorna la configuración del servicio de mensajería especificado'
            }), (0, swagger_1.ApiParam)({ name: 'serviceId', description: 'ID del servicio', example: 'default' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Configuración obtenida exitosamente' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Servicio no encontrado' })];
        _getPhoneNumber_decorators = [(0, common_1.Get)('service/:serviceId/phone'), (0, swagger_1.ApiOperation)({
                summary: 'Obtener número de teléfono de servicio',
                description: 'Retorna el número de teléfono asociado al servicio'
            }), (0, swagger_1.ApiParam)({ name: 'serviceId', description: 'ID del servicio', example: 'default' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Número de teléfono obtenido exitosamente' })];
        _sendSms_decorators = [(0, common_1.Post)('sms/send'), (0, swagger_1.ApiOperation)({
                summary: 'Enviar SMS usando estrategia',
                description: 'Envía un mensaje SMS utilizando la estrategia configurada'
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'SMS enviado exitosamente' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Error al enviar SMS' })];
        _sendWhatsApp_decorators = [(0, common_1.Post)('whatsapp/send'), (0, swagger_1.ApiOperation)({
                summary: 'Enviar WhatsApp usando estrategia',
                description: 'Envía un mensaje de WhatsApp utilizando la estrategia configurada'
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'WhatsApp enviado exitosamente' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Error al enviar WhatsApp' })];
        _health_decorators = [(0, common_1.Get)('health'), (0, swagger_1.ApiOperation)({
                summary: 'Health check del sistema de estrategias',
                description: 'Verifica el estado del sistema de estrategias de mensajería'
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Sistema operativo' })];
        __esDecorate(_classThis, null, _listStrategies_decorators, { kind: "method", name: "listStrategies", static: false, private: false, access: { has: function (obj) { return "listStrategies" in obj; }, get: function (obj) { return obj.listStrategies; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getServiceConfig_decorators, { kind: "method", name: "getServiceConfig", static: false, private: false, access: { has: function (obj) { return "getServiceConfig" in obj; }, get: function (obj) { return obj.getServiceConfig; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPhoneNumber_decorators, { kind: "method", name: "getPhoneNumber", static: false, private: false, access: { has: function (obj) { return "getPhoneNumber" in obj; }, get: function (obj) { return obj.getPhoneNumber; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _sendSms_decorators, { kind: "method", name: "sendSms", static: false, private: false, access: { has: function (obj) { return "sendSms" in obj; }, get: function (obj) { return obj.sendSms; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _sendWhatsApp_decorators, { kind: "method", name: "sendWhatsApp", static: false, private: false, access: { has: function (obj) { return "sendWhatsApp" in obj; }, get: function (obj) { return obj.sendWhatsApp; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _health_decorators, { kind: "method", name: "health", static: false, private: false, access: { has: function (obj) { return "health" in obj; }, get: function (obj) { return obj.health; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MessagingStrategyController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MessagingStrategyController = _classThis;
}();
exports.MessagingStrategyController = MessagingStrategyController;
