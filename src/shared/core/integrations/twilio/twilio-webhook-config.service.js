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
var Twilio = require("twilio");
/**
 * Servicio para configurar automáticamente webhooks de Twilio
 * Elimina la necesidad de configurar manualmente en Twilio Console
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
            if (!accountSid || !authToken) {
                throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in environment variables');
            }
            this.client = new Twilio.Twilio(accountSid, authToken);
            // Auto-detectar base URL desde variables de entorno o usar valor por defecto
            this.baseUrl =
                process.env.API_BASE_URL ||
                    process.env.BASE_URL ||
                    'http://localhost:3000';
            this.logger.log("Twilio Webhook Config Service initialized with base URL: ".concat(this.baseUrl));
        }
        /**
         * Obtiene las URLs de webhook generadas automáticamente
         */
        TwilioWebhookConfigService_1.prototype.getWebhookUrls = function () {
            var baseUrl = this.baseUrl.replace(/\/$/, ''); // Remove trailing slash
            return {
                baseUrl: baseUrl,
                statusCallback: "".concat(baseUrl, "/api/messaging/sms/webhooks/twilio/status"),
                incomingSms: "".concat(baseUrl, "/api/messaging/sms/webhooks/twilio/incoming"),
                conversationsWebhook: "".concat(baseUrl, "/api/messaging/sms/webhooks/twilio/conversations"),
                healthCheck: "".concat(baseUrl, "/api/messaging/sms/webhooks/health"),
            };
        };
        /**
         * Configura webhooks en el número de teléfono de Twilio
         */
        TwilioWebhookConfigService_1.prototype.configurePhoneNumberWebhooks = function (phoneNumber) {
            return __awaiter(this, void 0, void 0, function () {
                var phone, urls, phoneNumbers, twilioPhone, updated, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            phone = phoneNumber || process.env.TWILIO_PHONE_NUMBER;
                            if (!phone) {
                                throw new Error('Phone number not provided and TWILIO_PHONE_NUMBER not set');
                            }
                            this.logger.log("Configuring webhooks for phone number: ".concat(phone));
                            urls = this.getWebhookUrls();
                            return [4 /*yield*/, this.client.incomingPhoneNumbers.list({
                                    phoneNumber: phone,
                                    limit: 1,
                                })];
                        case 1:
                            phoneNumbers = _a.sent();
                            if (phoneNumbers.length === 0) {
                                throw new Error("Phone number ".concat(phone, " not found in your Twilio account"));
                            }
                            twilioPhone = phoneNumbers[0];
                            return [4 /*yield*/, this.client
                                    .incomingPhoneNumbers(twilioPhone.sid)
                                    .update({
                                    smsUrl: urls.incomingSms,
                                    smsMethod: 'POST',
                                    statusCallback: urls.statusCallback,
                                    statusCallbackMethod: 'POST',
                                })];
                        case 2:
                            updated = _a.sent();
                            this.logger.log("\u2705 Phone webhooks configured successfully for ".concat(phone));
                            return [2 /*return*/, {
                                    success: true,
                                    phoneNumber: phone,
                                    phoneSid: twilioPhone.sid,
                                    webhooks: {
                                        incomingSms: urls.incomingSms,
                                        statusCallback: urls.statusCallback,
                                    },
                                    friendlyName: updated.friendlyName,
                                }];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.error("Error configuring phone webhooks: ".concat(error_1.message));
                            throw error_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Configura webhooks en el Messaging Service
         */
        TwilioWebhookConfigService_1.prototype.configureMessagingServiceWebhooks = function (messagingServiceSid) {
            return __awaiter(this, void 0, void 0, function () {
                var serviceSid, urls, updated, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            serviceSid = messagingServiceSid || process.env.TWILIO_MESSAGING_SERVICE_SID;
                            if (!serviceSid) {
                                this.logger.warn('No Messaging Service SID provided, skipping Messaging Service webhook configuration');
                                return [2 /*return*/, {
                                        success: false,
                                        message: 'No Messaging Service SID provided',
                                        skipped: true,
                                    }];
                            }
                            this.logger.log("Configuring webhooks for Messaging Service: ".concat(serviceSid));
                            urls = this.getWebhookUrls();
                            return [4 /*yield*/, this.client.messaging.v1
                                    .services(serviceSid)
                                    .update({
                                    statusCallback: urls.statusCallback,
                                    inboundRequestUrl: urls.incomingSms,
                                    inboundMethod: 'POST',
                                })];
                        case 1:
                            updated = _a.sent();
                            this.logger.log("\u2705 Messaging Service webhooks configured successfully");
                            return [2 /*return*/, {
                                    success: true,
                                    messagingServiceSid: serviceSid,
                                    friendlyName: updated.friendlyName,
                                    webhooks: {
                                        statusCallback: urls.statusCallback,
                                        inboundRequestUrl: urls.incomingSms,
                                    },
                                }];
                        case 2:
                            error_2 = _a.sent();
                            this.logger.error("Error configuring Messaging Service webhooks: ".concat(error_2.message));
                            return [2 /*return*/, {
                                    success: false,
                                    error: error_2.message,
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Configura webhooks para Conversations API
         */
        TwilioWebhookConfigService_1.prototype.configureConversationsWebhooks = function (conversationServiceSid) {
            return __awaiter(this, void 0, void 0, function () {
                var serviceSid, services, urls, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            serviceSid = conversationServiceSid;
                            if (!!serviceSid) return [3 /*break*/, 2];
                            this.logger.log('No Conversation Service SID provided, fetching default...');
                            return [4 /*yield*/, this.client.conversations.v1.services.list({
                                    limit: 1,
                                })];
                        case 1:
                            services = _a.sent();
                            if (services.length === 0) {
                                throw new Error('No Conversation Service found. Create one in Twilio Console first.');
                            }
                            serviceSid = services[0].sid;
                            this.logger.log("Using default Conversation Service: ".concat(serviceSid));
                            _a.label = 2;
                        case 2:
                            urls = this.getWebhookUrls();
                            // Obtener configuración actual
                            return [4 /*yield*/, this.client.conversations.v1
                                    .services(serviceSid)
                                    .configuration()
                                    .fetch()];
                        case 3:
                            // Obtener configuración actual
                            _a.sent();
                            this.logger.log("\u2705 Conversations service verified successfully");
                            this.logger.warn("\u26A0\uFE0F Conversations webhooks must be configured manually in Twilio Console");
                            this.logger.log("Console URL: https://console.twilio.com/us1/develop/conversations/manage/services/".concat(serviceSid));
                            return [2 /*return*/, {
                                    success: true,
                                    conversationServiceSid: serviceSid,
                                    webhook: urls.conversationsWebhook,
                                    note: 'Webhook URL must be configured manually in Twilio Console for Conversations',
                                    consoleUrl: "https://console.twilio.com/us1/develop/conversations/manage/services/".concat(serviceSid),
                                    manualSteps: [
                                        '1. Go to Twilio Console → Conversations → Services',
                                        '2. Select your service',
                                        '3. Go to Webhooks tab',
                                        "4. Set Post-Event Webhook URL to: ".concat(urls.conversationsWebhook),
                                        '5. Enable events: onMessageAdded, onDeliveryUpdated',
                                        '6. Method: POST',
                                        '7. Click Save',
                                    ],
                                }];
                        case 4:
                            error_3 = _a.sent();
                            this.logger.error("Error configuring Conversations webhooks: ".concat(error_3.message));
                            return [2 /*return*/, {
                                    success: false,
                                    error: error_3.message,
                                }];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Configura todos los webhooks automáticamente
         */
        TwilioWebhookConfigService_1.prototype.configureAllWebhooks = function () {
            return __awaiter(this, void 0, void 0, function () {
                var results, _a, error_4, _b, error_5, _c, error_6;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            this.logger.log('🚀 Starting automatic webhook configuration for all services...');
                            results = {
                                baseUrl: this.baseUrl,
                                phoneNumber: null,
                                messagingService: null,
                                conversations: null,
                                timestamp: new Date().toISOString(),
                            };
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 3, , 4]);
                            _a = results;
                            return [4 /*yield*/, this.configurePhoneNumberWebhooks()];
                        case 2:
                            _a.phoneNumber =
                                _d.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_4 = _d.sent();
                            this.logger.error("Phone configuration failed: ".concat(error_4.message));
                            results.phoneNumber = { success: false, error: error_4.message };
                            return [3 /*break*/, 4];
                        case 4:
                            _d.trys.push([4, 6, , 7]);
                            _b = results;
                            return [4 /*yield*/, this.configureMessagingServiceWebhooks()];
                        case 5:
                            _b.messagingService =
                                _d.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            error_5 = _d.sent();
                            this.logger.error("Messaging Service configuration failed: ".concat(error_5.message));
                            results.messagingService = { success: false, error: error_5.message };
                            return [3 /*break*/, 7];
                        case 7:
                            _d.trys.push([7, 9, , 10]);
                            _c = results;
                            return [4 /*yield*/, this.configureConversationsWebhooks()];
                        case 8:
                            _c.conversations =
                                _d.sent();
                            return [3 /*break*/, 10];
                        case 9:
                            error_6 = _d.sent();
                            this.logger.error("Conversations configuration failed: ".concat(error_6.message));
                            results.conversations = { success: false, error: error_6.message };
                            return [3 /*break*/, 10];
                        case 10:
                            this.logger.log('✅ Webhook configuration completed');
                            return [2 /*return*/, results];
                    }
                });
            });
        };
        /**
         * Verifica qué webhooks están configurados actualmente
         */
        TwilioWebhookConfigService_1.prototype.verifyWebhooks = function () {
            return __awaiter(this, void 0, void 0, function () {
                var phone, phoneNumbers, twilioPhone, expectedUrls, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            phone = process.env.TWILIO_PHONE_NUMBER;
                            if (!phone) {
                                throw new Error('TWILIO_PHONE_NUMBER not set');
                            }
                            return [4 /*yield*/, this.client.incomingPhoneNumbers.list({
                                    phoneNumber: phone,
                                    limit: 1,
                                })];
                        case 1:
                            phoneNumbers = _a.sent();
                            if (phoneNumbers.length === 0) {
                                throw new Error("Phone number ".concat(phone, " not found"));
                            }
                            twilioPhone = phoneNumbers[0];
                            expectedUrls = this.getWebhookUrls();
                            return [2 /*return*/, {
                                    phoneNumber: phone,
                                    currentWebhooks: {
                                        smsUrl: twilioPhone.smsUrl,
                                        statusCallback: twilioPhone.statusCallback,
                                    },
                                    expectedWebhooks: {
                                        smsUrl: expectedUrls.incomingSms,
                                        statusCallback: expectedUrls.statusCallback,
                                    },
                                    isConfigured: twilioPhone.smsUrl === expectedUrls.incomingSms &&
                                        twilioPhone.statusCallback === expectedUrls.statusCallback,
                                }];
                        case 2:
                            error_7 = _a.sent();
                            this.logger.error("Error verifying webhooks: ".concat(error_7.message));
                            throw error_7;
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
