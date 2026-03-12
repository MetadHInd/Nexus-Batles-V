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
exports.TwilioWebhookConfigService = void 0;
var common_1 = require("@nestjs/common");
var twilio_1 = require("twilio");
/**
 * Servicio para configurar webhooks de Twilio automáticamente
 */
var TwilioWebhookConfigService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TwilioWebhookConfigService = _classThis = /** @class */ (function () {
        function TwilioWebhookConfigService_1() {
            this.logger = new common_1.Logger(TwilioWebhookConfigService.name);
            var accountSid = process.env.TWILIO_ACCOUNT_SID;
            var authToken = process.env.TWILIO_AUTH_TOKEN;
            if (accountSid && authToken) {
                this.client = new twilio_1.Twilio(accountSid, authToken);
            }
        }
        /**
         * Obtener la URL base del servidor actual
         */
        TwilioWebhookConfigService_1.prototype.getBaseUrl = function () {
            // Prioridad 1: Variable de entorno explícita
            if (process.env.API_BASE_URL) {
                return process.env.API_BASE_URL;
            }
            // Prioridad 2: URL de producción
            if (process.env.PRODUCTION_URL) {
                return process.env.PRODUCTION_URL;
            }
            // Prioridad 3: Detectar según NODE_ENV
            if (process.env.NODE_ENV === 'production') {
                // En producción, debes tener configurada la URL
                this.logger.warn('⚠️ API_BASE_URL not set in production environment');
                return 'https://api.tu-dominio.com'; // Fallback
            }
            // Desarrollo: localhost
            var port = process.env.PORT || 3000;
            return "http://localhost:".concat(port);
        };
        /**
         * Generar URLs de webhook
         */
        TwilioWebhookConfigService_1.prototype.getWebhookUrls = function () {
            var baseUrl = this.getBaseUrl();
            // URL unificada para todos los eventos (sin /api/messaging)
            var unifiedWebhook = "".concat(baseUrl, "/sms/webhook");
            return {
                baseUrl: baseUrl,
                // URL principal unificada
                unified: unifiedWebhook,
                // Todas las URLs apuntan al mismo endpoint unificado
                statusCallback: unifiedWebhook,
                incomingSms: unifiedWebhook,
                conversationsWebhook: unifiedWebhook,
                healthCheck: "".concat(baseUrl, "/sms/webhook/health"),
            };
        };
        /**
         * Configurar webhook en número de teléfono de Twilio
         */
        TwilioWebhookConfigService_1.prototype.configurePhoneNumberWebhooks = function (phoneNumber) {
            return __awaiter(this, void 0, void 0, function () {
                var phone, phoneNumbers, phoneNumberSid, urls, updatedNumber, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            phone = phoneNumber || process.env.TWILIO_PHONE_NUMBER;
                            if (!phone) {
                                throw new Error('Phone number not provided and TWILIO_PHONE_NUMBER not set');
                            }
                            this.logger.log("\uD83D\uDCDE Configuring webhooks for phone number: ".concat(phone));
                            return [4 /*yield*/, this.client.incomingPhoneNumbers.list({
                                    phoneNumber: phone,
                                })];
                        case 1:
                            phoneNumbers = _a.sent();
                            if (phoneNumbers.length === 0) {
                                throw new Error("Phone number ".concat(phone, " not found in Twilio account"));
                            }
                            phoneNumberSid = phoneNumbers[0].sid;
                            urls = this.getWebhookUrls();
                            return [4 /*yield*/, this.client
                                    .incomingPhoneNumbers(phoneNumberSid)
                                    .update({
                                    smsUrl: urls.incomingSms,
                                    smsMethod: 'POST',
                                    statusCallback: urls.statusCallback,
                                    statusCallbackMethod: 'POST',
                                })];
                        case 2:
                            updatedNumber = _a.sent();
                            this.logger.log("\u2705 Webhooks configured successfully for ".concat(phone));
                            return [2 /*return*/, {
                                    success: true,
                                    phoneNumber: phone,
                                    phoneSid: phoneNumberSid,
                                    webhooks: {
                                        incomingSms: urls.incomingSms,
                                        statusCallback: urls.statusCallback,
                                    },
                                    updatedAt: new Date().toISOString(),
                                }];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.error("\u274C Error configuring phone webhooks: ".concat(error_1.message));
                            throw error_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Configurar webhook en Messaging Service
         */
        TwilioWebhookConfigService_1.prototype.configureMessagingServiceWebhooks = function (messagingServiceSid) {
            return __awaiter(this, void 0, void 0, function () {
                var serviceSid, urls, updatedService, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            serviceSid = messagingServiceSid || process.env.TWILIO_MESSAGING_SERVICE_SID;
                            if (!serviceSid) {
                                this.logger.warn('⚠️ No Messaging Service SID provided, skipping');
                                return [2 /*return*/, { success: false, reason: 'No Messaging Service SID' }];
                            }
                            this.logger.log("\uD83D\uDCE8 Configuring webhooks for Messaging Service: ".concat(serviceSid));
                            urls = this.getWebhookUrls();
                            return [4 /*yield*/, this.client.messaging.v1
                                    .services(serviceSid)
                                    .update({
                                    statusCallback: urls.statusCallback,
                                    inboundRequestUrl: urls.incomingSms,
                                    inboundMethod: 'POST',
                                })];
                        case 1:
                            updatedService = _a.sent();
                            this.logger.log("\u2705 Messaging Service webhooks configured successfully");
                            return [2 /*return*/, {
                                    success: true,
                                    messagingServiceSid: serviceSid,
                                    webhooks: {
                                        incomingSms: urls.incomingSms,
                                        statusCallback: urls.statusCallback,
                                    },
                                    updatedAt: new Date().toISOString(),
                                }];
                        case 2:
                            error_2 = _a.sent();
                            this.logger.error("\u274C Error configuring Messaging Service webhooks: ".concat(error_2.message));
                            throw error_2;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Configurar webhook en Conversations Service
         */
        TwilioWebhookConfigService_1.prototype.configureConversationsWebhooks = function (conversationServiceSid) {
            return __awaiter(this, void 0, void 0, function () {
                var serviceSid, urls, webhook, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            serviceSid = conversationServiceSid || 'default';
                            this.logger.log("\uD83D\uDCAC Configuring webhooks for Conversations Service: ".concat(serviceSid));
                            urls = this.getWebhookUrls();
                            return [4 /*yield*/, this.client.conversations.v1.configuration
                                    .webhooks()
                                    .update({
                                    postWebhookUrl: urls.conversationsWebhook,
                                    method: 'POST',
                                    filters: ['onMessageAdded', 'onMessageUpdated'],
                                })];
                        case 1:
                            webhook = _a.sent();
                            this.logger.log("\u2705 Conversations webhooks configured successfully");
                            return [2 /*return*/, {
                                    success: true,
                                    conversationServiceSid: serviceSid,
                                    webhooks: {
                                        postWebhook: urls.conversationsWebhook,
                                        filters: ['onMessageAdded', 'onMessageUpdated'],
                                    },
                                    updatedAt: new Date().toISOString(),
                                }];
                        case 2:
                            error_3 = _a.sent();
                            this.logger.error("\u274C Error configuring Conversations webhooks: ".concat(error_3.message));
                            throw error_3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Configurar todos los webhooks automáticamente
         */
        TwilioWebhookConfigService_1.prototype.configureAllWebhooks = function (config) {
            return __awaiter(this, void 0, void 0, function () {
                var phoneNumber, messagingServiceSid, conversationServiceSid, results, _a, error_4, _b, error_5, _c, error_6, error_7;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            this.logger.log('🚀 Starting automatic webhook configuration...');
                            phoneNumber = (config === null || config === void 0 ? void 0 : config.phoneNumber) || process.env.TWILIO_PHONE_NUMBER;
                            messagingServiceSid = (config === null || config === void 0 ? void 0 : config.messagingServiceSid) || process.env.TWILIO_MESSAGING_SERVICE_SID;
                            conversationServiceSid = config === null || config === void 0 ? void 0 : config.conversationServiceSid;
                            this.logger.log("\uD83D\uDCF1 Phone Number: ".concat(phoneNumber));
                            if (messagingServiceSid) {
                                this.logger.log("\uD83D\uDCE6 Messaging Service SID: ".concat(messagingServiceSid));
                            }
                            if (conversationServiceSid) {
                                this.logger.log("\uD83D\uDCAC Conversation Service SID: ".concat(conversationServiceSid));
                            }
                            results = {
                                baseUrl: this.getBaseUrl(),
                                phoneNumber: null,
                                messagingService: null,
                                conversations: null,
                                timestamp: new Date().toISOString(),
                            };
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 12, , 13]);
                            _d.label = 2;
                        case 2:
                            _d.trys.push([2, 4, , 5]);
                            _a = results;
                            return [4 /*yield*/, this.configurePhoneNumberWebhooks(phoneNumber)];
                        case 3:
                            _a.phoneNumber = _d.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_4 = _d.sent();
                            this.logger.warn("Phone number webhook config failed: ".concat(error_4.message));
                            results.phoneNumber = { success: false, error: error_4.message };
                            return [3 /*break*/, 5];
                        case 5:
                            _d.trys.push([5, 7, , 8]);
                            _b = results;
                            return [4 /*yield*/, this.configureMessagingServiceWebhooks(messagingServiceSid)];
                        case 6:
                            _b.messagingService =
                                _d.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            error_5 = _d.sent();
                            this.logger.warn("Messaging Service webhook config failed: ".concat(error_5.message));
                            results.messagingService = { success: false, error: error_5.message };
                            return [3 /*break*/, 8];
                        case 8:
                            _d.trys.push([8, 10, , 11]);
                            _c = results;
                            return [4 /*yield*/, this.configureConversationsWebhooks(conversationServiceSid)];
                        case 9:
                            _c.conversations = _d.sent();
                            return [3 /*break*/, 11];
                        case 10:
                            error_6 = _d.sent();
                            this.logger.warn("Conversations webhook config failed: ".concat(error_6.message));
                            results.conversations = { success: false, error: error_6.message };
                            return [3 /*break*/, 11];
                        case 11:
                            this.logger.log('✅ Webhook configuration completed');
                            return [2 /*return*/, results];
                        case 12:
                            error_7 = _d.sent();
                            this.logger.error("\u274C Error in webhook configuration: ".concat(error_7.message));
                            throw error_7;
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Verificar webhooks configurados
         */
        TwilioWebhookConfigService_1.prototype.verifyWebhooks = function (phoneNumber) {
            return __awaiter(this, void 0, void 0, function () {
                var phone, phoneNumbers, number, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            phone = phoneNumber || process.env.TWILIO_PHONE_NUMBER;
                            if (!phone) {
                                throw new Error('Phone number not provided');
                            }
                            return [4 /*yield*/, this.client.incomingPhoneNumbers.list({
                                    phoneNumber: phone,
                                })];
                        case 1:
                            phoneNumbers = _a.sent();
                            if (phoneNumbers.length === 0) {
                                throw new Error("Phone number ".concat(phone, " not found"));
                            }
                            number = phoneNumbers[0];
                            return [2 /*return*/, {
                                    phoneNumber: phone,
                                    phoneSid: number.sid,
                                    currentWebhooks: {
                                        smsUrl: number.smsUrl,
                                        smsMethod: number.smsMethod,
                                        statusCallback: number.statusCallback,
                                        statusCallbackMethod: number.statusCallbackMethod,
                                    },
                                    expectedWebhooks: this.getWebhookUrls(),
                                }];
                        case 2:
                            error_8 = _a.sent();
                            this.logger.error("Error verifying webhooks: ".concat(error_8.message));
                            throw error_8;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return TwilioWebhookConfigService_1;
    }());
    __setFunctionName(_classThis, "TwilioWebhookConfigService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TwilioWebhookConfigService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TwilioWebhookConfigService = _classThis;
}();
exports.TwilioWebhookConfigService = TwilioWebhookConfigService;
