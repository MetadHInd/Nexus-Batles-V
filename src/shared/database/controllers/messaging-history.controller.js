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
exports.MessagingHistoryController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var MessagingHistoryController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Messaging History'), (0, common_1.Controller)('messaging-history')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getConversationMessages_decorators;
    var _getConversation_decorators;
    var _listActiveConversations_decorators;
    var _searchMessages_decorators;
    var _markAsRead_decorators;
    var _getStats_decorators;
    var _health_decorators;
    var MessagingHistoryController = _classThis = /** @class */ (function () {
        function MessagingHistoryController_1(firestoreMessaging) {
            this.firestoreMessaging = (__runInitializers(this, _instanceExtraInitializers), firestoreMessaging);
        }
        MessagingHistoryController_1.prototype.getConversationMessages = function (conversationId, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var messages;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.firestoreMessaging.getConversationMessages(conversationId, limit ? parseInt(limit.toString()) : 100)];
                        case 1:
                            messages = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    conversationId: conversationId,
                                    count: messages.length,
                                    messages: messages,
                                }];
                    }
                });
            });
        };
        MessagingHistoryController_1.prototype.getConversation = function (conversationId) {
            return __awaiter(this, void 0, void 0, function () {
                var conversation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.firestoreMessaging.getConversation(conversationId)];
                        case 1:
                            conversation = _a.sent();
                            return [2 /*return*/, {
                                    success: !!conversation,
                                    conversation: conversation,
                                }];
                    }
                });
            });
        };
        MessagingHistoryController_1.prototype.listActiveConversations = function (limit) {
            return __awaiter(this, void 0, void 0, function () {
                var conversations;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.firestoreMessaging.listActiveConversations(limit ? parseInt(limit.toString()) : 50)];
                        case 1:
                            conversations = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    count: conversations.length,
                                    conversations: conversations,
                                }];
                    }
                });
            });
        };
        MessagingHistoryController_1.prototype.searchMessages = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var messages;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.firestoreMessaging.searchMessages(filters)];
                        case 1:
                            messages = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    count: messages.length,
                                    messages: messages,
                                    filters: filters,
                                }];
                    }
                });
            });
        };
        MessagingHistoryController_1.prototype.markAsRead = function (conversationId) {
            return __awaiter(this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.firestoreMessaging.markMessagesAsRead(conversationId)];
                        case 1:
                            count = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    conversationId: conversationId,
                                    markedCount: count,
                                }];
                    }
                });
            });
        };
        MessagingHistoryController_1.prototype.getStats = function (startDate, endDate, channel) {
            return __awaiter(this, void 0, void 0, function () {
                var stats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.firestoreMessaging.getMessagingStats({
                                startDate: startDate ? new Date(startDate) : undefined,
                                endDate: endDate ? new Date(endDate) : undefined,
                                channel: channel,
                            })];
                        case 1:
                            stats = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    stats: stats,
                                }];
                    }
                });
            });
        };
        MessagingHistoryController_1.prototype.health = function () {
            return {
                status: 'ok',
                service: 'Messaging History',
                storage: 'Firestore',
                timestamp: new Date().toISOString(),
            };
        };
        return MessagingHistoryController_1;
    }());
    __setFunctionName(_classThis, "MessagingHistoryController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getConversationMessages_decorators = [(0, common_1.Get)('conversation/:conversationId/messages'), (0, swagger_1.ApiOperation)({ summary: 'Obtener mensajes de una conversación' })];
        _getConversation_decorators = [(0, common_1.Get)('conversation/:conversationId'), (0, swagger_1.ApiOperation)({ summary: 'Obtener información de conversación' })];
        _listActiveConversations_decorators = [(0, common_1.Get)('conversations/active'), (0, swagger_1.ApiOperation)({ summary: 'Listar conversaciones activas' })];
        _searchMessages_decorators = [(0, common_1.Post)('messages/search'), (0, swagger_1.ApiOperation)({ summary: 'Buscar mensajes con filtros' })];
        _markAsRead_decorators = [(0, common_1.Post)('conversation/:conversationId/mark-read'), (0, swagger_1.ApiOperation)({ summary: 'Marcar mensajes como leídos' })];
        _getStats_decorators = [(0, common_1.Get)('stats'), (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas de mensajería' })];
        _health_decorators = [(0, common_1.Get)('health'), (0, swagger_1.ApiOperation)({ summary: 'Health check del sistema de mensajería' })];
        __esDecorate(_classThis, null, _getConversationMessages_decorators, { kind: "method", name: "getConversationMessages", static: false, private: false, access: { has: function (obj) { return "getConversationMessages" in obj; }, get: function (obj) { return obj.getConversationMessages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getConversation_decorators, { kind: "method", name: "getConversation", static: false, private: false, access: { has: function (obj) { return "getConversation" in obj; }, get: function (obj) { return obj.getConversation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listActiveConversations_decorators, { kind: "method", name: "listActiveConversations", static: false, private: false, access: { has: function (obj) { return "listActiveConversations" in obj; }, get: function (obj) { return obj.listActiveConversations; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _searchMessages_decorators, { kind: "method", name: "searchMessages", static: false, private: false, access: { has: function (obj) { return "searchMessages" in obj; }, get: function (obj) { return obj.searchMessages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _markAsRead_decorators, { kind: "method", name: "markAsRead", static: false, private: false, access: { has: function (obj) { return "markAsRead" in obj; }, get: function (obj) { return obj.markAsRead; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStats_decorators, { kind: "method", name: "getStats", static: false, private: false, access: { has: function (obj) { return "getStats" in obj; }, get: function (obj) { return obj.getStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _health_decorators, { kind: "method", name: "health", static: false, private: false, access: { has: function (obj) { return "health" in obj; }, get: function (obj) { return obj.health; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MessagingHistoryController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MessagingHistoryController = _classThis;
}();
exports.MessagingHistoryController = MessagingHistoryController;
