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
exports.MessagingStrategyManager = void 0;
var common_1 = require("@nestjs/common");
var firestore_message_interface_1 = require("../../database/interfaces/firestore-message.interface");
/**
 * Manager de estrategias de mensajería
 * Implementa patrón Strategy para múltiples proveedores
 * Guarda todos los mensajes en Firestore
 */
var MessagingStrategyManager = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MessagingStrategyManager = _classThis = /** @class */ (function () {
        function MessagingStrategyManager_1(prisma, twilioStrategy, firestoreMessaging) {
            this.prisma = prisma;
            this.twilioStrategy = twilioStrategy;
            this.firestoreMessaging = firestoreMessaging;
            this.logger = new common_1.Logger(MessagingStrategyManager.name);
            this.strategies = new Map();
            // Registrar estrategias disponibles
            this.registerStrategy('twilio', twilioStrategy);
        }
        /**
         * Registrar una nueva estrategia
         */
        MessagingStrategyManager_1.prototype.registerStrategy = function (name, strategy) {
            this.strategies.set(name, strategy);
            this.logger.log("Strategy registered: ".concat(name));
        };
        /**
         * Obtener estrategia por nombre
         */
        MessagingStrategyManager_1.prototype.getStrategy = function (name) {
            return this.strategies.get(name);
        };
        /**
         * Obtener configuración de servicio desde BD
         */
        MessagingStrategyManager_1.prototype.getServiceConfig = function (serviceId) {
            return __awaiter(this, void 0, void 0, function () {
                var config;
                return __generator(this, function (_a) {
                    try {
                        config = {
                            serviceId: serviceId,
                            serviceName: 'default',
                            provider: 'twilio',
                            phoneNumberId: process.env.TWILIO_PHONE_NUMBER || '',
                            credentials: {
                                accountSid: process.env.TWILIO_ACCOUNT_SID,
                                authToken: process.env.TWILIO_AUTH_TOKEN,
                            },
                        };
                        return [2 /*return*/, config];
                    }
                    catch (error) {
                        this.logger.error("Error getting service config: ".concat(error.message));
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * Obtener número de teléfono disponible para un servicio
         */
        MessagingStrategyManager_1.prototype.getPhoneNumber = function (serviceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    try {
                        // TODO: Query a tabla phone_numbers
                        // SELECT * FROM phone_numbers WHERE service_id = ? AND is_active = true LIMIT 1
                        // Fallback a env
                        return [2 /*return*/, {
                                id: '1',
                                phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
                                provider: 'twilio',
                                serviceId: serviceId,
                                isActive: true,
                                capabilities: {
                                    sms: true,
                                    voice: true,
                                    whatsapp: true,
                                },
                            }];
                    }
                    catch (error) {
                        this.logger.error("Error getting phone number: ".concat(error.message));
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * Enviar SMS usando estrategia apropiada
         */
        MessagingStrategyManager_1.prototype.sendSms = function (message_1) {
            return __awaiter(this, arguments, void 0, function (message, serviceId) {
                var config, strategy, result, conversationId, firestoreError_1, error_1;
                if (serviceId === void 0) { serviceId = 'default'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 7, , 8]);
                            return [4 /*yield*/, this.getServiceConfig(serviceId)];
                        case 1:
                            config = _a.sent();
                            if (!config) {
                                return [2 /*return*/, {
                                        success: false,
                                        error: 'Service configuration not found',
                                    }];
                            }
                            strategy = this.getStrategy(config.provider);
                            if (!strategy) {
                                return [2 /*return*/, {
                                        success: false,
                                        error: "Strategy not found: ".concat(config.provider),
                                    }];
                            }
                            if (!strategy.validateConfig(config)) {
                                return [2 /*return*/, {
                                        success: false,
                                        error: 'Invalid configuration',
                                    }];
                            }
                            return [4 /*yield*/, strategy.sendSms(message, config)];
                        case 2:
                            result = _a.sent();
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            conversationId = "sms_".concat(message.to, "_").concat(config.phoneNumberId);
                            return [4 /*yield*/, this.firestoreMessaging.saveOutboundMessage({
                                    conversationId: conversationId,
                                    channel: firestore_message_interface_1.MessageChannel.SMS,
                                    from: config.phoneNumberId,
                                    to: Array.isArray(message.to) ? message.to[0] : message.to,
                                    body: message.body,
                                    serviceId: serviceId,
                                    provider: config.provider,
                                    providerMessageId: result.messageId,
                                    metadata: message.metadata,
                                })];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            firestoreError_1 = _a.sent();
                            this.logger.error("Error saving SMS to Firestore: ".concat(firestoreError_1.message));
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/, result];
                        case 7:
                            error_1 = _a.sent();
                            this.logger.error("Error in sendSms: ".concat(error_1.message));
                            return [2 /*return*/, {
                                    success: false,
                                    error: error_1.message,
                                }];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Enviar WhatsApp usando estrategia apropiada
         */
        MessagingStrategyManager_1.prototype.sendWhatsApp = function (message_1) {
            return __awaiter(this, arguments, void 0, function (message, serviceId) {
                var config, strategy, result, conversationId, firestoreError_2, error_2;
                if (serviceId === void 0) { serviceId = 'default'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 7, , 8]);
                            return [4 /*yield*/, this.getServiceConfig(serviceId)];
                        case 1:
                            config = _a.sent();
                            if (!config) {
                                return [2 /*return*/, {
                                        success: false,
                                        error: "Configuration not found for service: ".concat(serviceId),
                                    }];
                            }
                            strategy = this.getStrategy(config.provider);
                            if (!strategy) {
                                return [2 /*return*/, {
                                        success: false,
                                        error: "Strategy not found: ".concat(config.provider),
                                    }];
                            }
                            if (!strategy.validateConfig(config)) {
                                return [2 /*return*/, {
                                        success: false,
                                        error: 'Invalid configuration',
                                    }];
                            }
                            return [4 /*yield*/, strategy.sendWhatsApp(message, config)];
                        case 2:
                            result = _a.sent();
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            conversationId = "whatsapp_".concat(message.to, "_").concat(config.phoneNumberId);
                            return [4 /*yield*/, this.firestoreMessaging.saveOutboundMessage({
                                    conversationId: conversationId,
                                    channel: firestore_message_interface_1.MessageChannel.WHATSAPP,
                                    from: config.phoneNumberId,
                                    to: message.to,
                                    body: message.body,
                                    serviceId: serviceId,
                                    provider: config.provider,
                                    providerMessageId: result.messageId,
                                    metadata: message.metadata,
                                })];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            firestoreError_2 = _a.sent();
                            this.logger.error("Error saving WhatsApp to Firestore: ".concat(firestoreError_2.message));
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/, result];
                        case 7:
                            error_2 = _a.sent();
                            this.logger.error("Error in sendWhatsApp: ".concat(error_2.message));
                            return [2 /*return*/, {
                                    success: false,
                                    error: error_2.message,
                                }];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Listar estrategias disponibles
         */
        MessagingStrategyManager_1.prototype.listStrategies = function () {
            return Array.from(this.strategies.keys());
        };
        /**
         * Validar si una estrategia está disponible
         */
        MessagingStrategyManager_1.prototype.hasStrategy = function (name) {
            return this.strategies.has(name);
        };
        return MessagingStrategyManager_1;
    }());
    __setFunctionName(_classThis, "MessagingStrategyManager");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MessagingStrategyManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MessagingStrategyManager = _classThis;
}();
exports.MessagingStrategyManager = MessagingStrategyManager;
