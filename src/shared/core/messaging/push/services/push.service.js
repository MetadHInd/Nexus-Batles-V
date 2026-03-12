"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.PushService = void 0;
// src/shared/core/messaging/push/services/push.service.ts
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var circuit_breaker_handler_1 = require("../../../../utils/circuit-breaker.handler");
var PushService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PushService = _classThis = /** @class */ (function () {
        function PushService_1(httpService) {
            this.httpService = httpService;
            this.logger = new common_1.Logger(PushService.name);
            this.circuitBreaker = new circuit_breaker_handler_1.CircuitBreakerHandler();
        }
        PushService_1.prototype.send = function (message) {
            return __awaiter(this, void 0, void 0, function () {
                var sendFunction, breaker;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sendFunction = function () { return __awaiter(_this, void 0, void 0, function () {
                                var appId, apiKey, provider, response, _a, error_1;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _b.trys.push([0, 7, , 8]);
                                            appId = process.env.ONESIGNAL_APP_ID;
                                            apiKey = process.env.ONESIGNAL_API_KEY;
                                            provider = process.env.PUSH_PROVIDER || 'onesignal';
                                            if (!appId || !apiKey) {
                                                throw new Error('Push notification credentials missing');
                                            }
                                            response = void 0;
                                            _a = provider.toLowerCase();
                                            switch (_a) {
                                                case 'onesignal': return [3 /*break*/, 1];
                                                case 'firebase': return [3 /*break*/, 3];
                                            }
                                            return [3 /*break*/, 5];
                                        case 1: return [4 /*yield*/, this.sendOneSignalPush(appId, apiKey, message)];
                                        case 2:
                                            response = _b.sent();
                                            return [3 /*break*/, 6];
                                        case 3: return [4 /*yield*/, this.sendFirebasePush(apiKey, message)];
                                        case 4:
                                            response = _b.sent();
                                            return [3 /*break*/, 6];
                                        case 5: throw new Error("Unsupported push provider: ".concat(provider));
                                        case 6: return [2 /*return*/, {
                                                success: true,
                                                error: null,
                                                id: response.id || response.messageId || 'unknown',
                                                recipients: response.recipients || 1,
                                                details: response,
                                            }];
                                        case 7:
                                            error_1 = _b.sent();
                                            this.logger.error("Push notification error: ".concat(error_1.message), error_1.stack);
                                            return [2 /*return*/, {
                                                    success: false,
                                                    error: error_1.message,
                                                    code: error_1.code || 'unknown',
                                                    id: null,
                                                }];
                                        case 8: return [2 /*return*/];
                                    }
                                });
                            }); };
                            breaker = this.circuitBreaker.createBreaker(sendFunction);
                            return [4 /*yield*/, breaker.fire()];
                        case 1: return [2 /*return*/, (_a.sent())];
                    }
                });
            });
        };
        PushService_1.prototype.sendBulk = function (messages) {
            return __awaiter(this, void 0, void 0, function () {
                var results, _i, messages_1, message, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            results = [];
                            _i = 0, messages_1 = messages;
                            _c.label = 1;
                        case 1:
                            if (!(_i < messages_1.length)) return [3 /*break*/, 4];
                            message = messages_1[_i];
                            _b = (_a = results).push;
                            return [4 /*yield*/, this.send(message)];
                        case 2:
                            _b.apply(_a, [_c.sent()]);
                            _c.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, results];
                    }
                });
            });
        };
        // Implementación específica para OneSignal
        PushService_1.prototype.sendOneSignalPush = function (appId, apiKey, message) {
            return __awaiter(this, void 0, void 0, function () {
                var url, playerIds, payload, headers, response, error_2;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            url = 'https://onesignal.com/api/v1/notifications';
                            playerIds = Array.isArray(message.recipient.value)
                                ? message.recipient.value
                                : [message.recipient.value];
                            payload = __assign(__assign(__assign({ app_id: appId, name: message.content.title, include_player_ids: playerIds, headings: {
                                    en: message.content.title,
                                }, contents: {
                                    en: message.content.body,
                                } }, (message.content.data && {
                                data: message.content.data,
                            })), (message.content.url && {
                                url: message.content.url,
                            })), (message.content.buttons && {
                                buttons: message.content.buttons,
                            }));
                            headers = {
                                Authorization: "Basic ".concat(apiKey),
                                'Content-Type': 'application/json',
                            };
                            this.logger.debug("Sending OneSignal push notification with payload: ".concat(JSON.stringify(payload)));
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload, { headers: headers }))];
                        case 2:
                            response = _b.sent();
                            this.logger.log("OneSignal push notification sent successfully: ".concat(JSON.stringify(response.data)));
                            return [2 /*return*/, response.data];
                        case 3:
                            error_2 = _b.sent();
                            this.logger.error("OneSignal error details: ".concat(JSON.stringify(((_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data) || 'No details')));
                            throw error_2;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // Implementación para Firebase Cloud Messaging
        PushService_1.prototype.sendFirebasePush = function (apiKey, message) {
            return __awaiter(this, void 0, void 0, function () {
                var url, to, registration_ids, payload, headers, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = 'https://fcm.googleapis.com/fcm/send';
                            if (message.recipient.type === 'player_id') {
                                if (Array.isArray(message.recipient.value)) {
                                    registration_ids = message.recipient.value;
                                }
                                else {
                                    to = message.recipient.value;
                                }
                            }
                            else if (message.recipient.type === 'topic') {
                                to = "/topics/".concat(message.recipient.value);
                            }
                            payload = __assign(__assign(__assign(__assign({}, (to && { to: to })), (registration_ids && { registration_ids: registration_ids })), { notification: {
                                    title: message.content.title,
                                    body: message.content.body,
                                    image: message.content.imageUrl,
                                    click_action: message.content.url,
                                }, data: message.content.data || {} }), (message.priority && { priority: message.priority }));
                            headers = {
                                Authorization: "key=".concat(apiKey),
                                'Content-Type': 'application/json',
                            };
                            this.logger.debug("Sending Firebase push notification with payload: ".concat(JSON.stringify(payload)));
                            return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload, { headers: headers }))];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, __assign({ id: response.data.multicast_id || 'unknown', messageId: response.data.message_id, recipients: response.data.success || 0 }, response.data)];
                    }
                });
            });
        };
        return PushService_1;
    }());
    __setFunctionName(_classThis, "PushService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PushService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PushService = _classThis;
}();
exports.PushService = PushService;
