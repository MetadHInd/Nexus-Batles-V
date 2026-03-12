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
exports.FirestoreMessagingService = void 0;
var common_1 = require("@nestjs/common");
var firestore_message_interface_1 = require("./interfaces/firestore-message.interface");
/**
 * Servicio para gestionar mensajes en Firestore
 * Almacena todos los mensajes de usuario-sistema en ambas direcciones
 */
var FirestoreMessagingService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var FirestoreMessagingService = _classThis = /** @class */ (function () {
        function FirestoreMessagingService_1(firestore) {
            this.firestore = firestore;
            this.logger = new common_1.Logger(FirestoreMessagingService.name);
            this.messagesCollection = 'messages';
            this.conversationsCollection = 'conversations';
        }
        /**
         * Guardar mensaje en Firestore
         */
        FirestoreMessagingService_1.prototype.saveMessage = function (message) {
            return __awaiter(this, void 0, void 0, function () {
                var now, messageData, docRef, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            now = new Date();
                            messageData = __assign(__assign({}, message), { createdAt: now, updatedAt: now });
                            return [4 /*yield*/, this.firestore.collection(this.messagesCollection).add(messageData)];
                        case 1:
                            docRef = _a.sent();
                            this.logger.log("Message saved: ".concat(docRef.id, " (").concat(message.direction, " - ").concat(message.channel, ")"));
                            // Actualizar conversación
                            return [4 /*yield*/, this.updateConversation(message.conversationId, message)];
                        case 2:
                            // Actualizar conversación
                            _a.sent();
                            return [2 /*return*/, docRef.id];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.error("Error saving message: ".concat(error_1.message), error_1.stack);
                            throw error_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Guardar mensaje de entrada (usuario -> sistema)
         */
        FirestoreMessagingService_1.prototype.saveInboundMessage = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.saveMessage(__assign(__assign({}, data), { direction: firestore_message_interface_1.MessageDirection.INBOUND, status: firestore_message_interface_1.MessageStatus.DELIVERED }))];
                });
            });
        };
        /**
         * Guardar mensaje de salida (sistema -> usuario)
         */
        FirestoreMessagingService_1.prototype.saveOutboundMessage = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.saveMessage(__assign(__assign({}, data), { direction: firestore_message_interface_1.MessageDirection.OUTBOUND, status: firestore_message_interface_1.MessageStatus.SENT }))];
                });
            });
        };
        /**
         * Actualizar estado de mensaje
         */
        FirestoreMessagingService_1.prototype.updateMessageStatus = function (messageId, status, additionalData) {
            return __awaiter(this, void 0, void 0, function () {
                var updateData, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            updateData = {
                                status: status,
                                updatedAt: new Date(),
                            };
                            if (status === firestore_message_interface_1.MessageStatus.SENT && !(additionalData === null || additionalData === void 0 ? void 0 : additionalData.sentAt)) {
                                updateData.sentAt = new Date();
                            }
                            if (status === firestore_message_interface_1.MessageStatus.DELIVERED && !(additionalData === null || additionalData === void 0 ? void 0 : additionalData.deliveredAt)) {
                                updateData.deliveredAt = new Date();
                            }
                            if (status === firestore_message_interface_1.MessageStatus.READ && !(additionalData === null || additionalData === void 0 ? void 0 : additionalData.readAt)) {
                                updateData.readAt = new Date();
                            }
                            if (additionalData) {
                                Object.assign(updateData, additionalData);
                            }
                            return [4 /*yield*/, this.firestore
                                    .collection(this.messagesCollection)
                                    .doc(messageId)
                                    .update(updateData)];
                        case 1:
                            _a.sent();
                            this.logger.log("Message ".concat(messageId, " status updated to ").concat(status));
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            this.logger.error("Error updating message status: ".concat(error_2.message));
                            throw error_2;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Obtener mensajes de una conversación
         */
        FirestoreMessagingService_1.prototype.getConversationMessages = function (conversationId_1) {
            return __awaiter(this, arguments, void 0, function (conversationId, limit) {
                var snapshot, messages_1, error_3;
                if (limit === void 0) { limit = 100; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.firestore
                                    .collection(this.messagesCollection)
                                    .where('conversationId', '==', conversationId)
                                    .orderBy('createdAt', 'desc')
                                    .limit(limit)
                                    .get()];
                        case 1:
                            snapshot = _a.sent();
                            messages_1 = [];
                            snapshot.forEach(function (doc) {
                                var data = doc.data();
                                messages_1.push(__assign({ id: doc.id }, data));
                            });
                            return [2 /*return*/, messages_1.reverse()]; // Orden cronológico
                        case 2:
                            error_3 = _a.sent();
                            this.logger.error("Error getting conversation messages: ".concat(error_3.message));
                            throw error_3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Buscar mensajes con filtros
         */
        FirestoreMessagingService_1.prototype.searchMessages = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var query, snapshot, messages_2, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            query = this.firestore.collection(this.messagesCollection);
                            if (filters.conversationId) {
                                query = query.where('conversationId', '==', filters.conversationId);
                            }
                            if (filters.sessionId) {
                                query = query.where('sessionId', '==', filters.sessionId);
                            }
                            if (filters.userId) {
                                query = query.where('userId', '==', filters.userId);
                            }
                            if (filters.channel) {
                                query = query.where('channel', '==', filters.channel);
                            }
                            if (filters.direction) {
                                query = query.where('direction', '==', filters.direction);
                            }
                            if (filters.status) {
                                query = query.where('status', '==', filters.status);
                            }
                            if (filters.from) {
                                query = query.where('from', '==', filters.from);
                            }
                            if (filters.to) {
                                query = query.where('to', '==', filters.to);
                            }
                            if (filters.startDate) {
                                query = query.where('createdAt', '>=', filters.startDate);
                            }
                            if (filters.endDate) {
                                query = query.where('createdAt', '<=', filters.endDate);
                            }
                            query = query.orderBy('createdAt', 'desc');
                            if (filters.limit) {
                                query = query.limit(filters.limit);
                            }
                            return [4 /*yield*/, query.get()];
                        case 1:
                            snapshot = _a.sent();
                            messages_2 = [];
                            snapshot.forEach(function (doc) {
                                var data = doc.data();
                                messages_2.push(__assign({ id: doc.id }, data));
                            });
                            return [2 /*return*/, messages_2];
                        case 2:
                            error_4 = _a.sent();
                            this.logger.error("Error searching messages: ".concat(error_4.message));
                            throw error_4;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Crear o actualizar conversación
         */
        FirestoreMessagingService_1.prototype.updateConversation = function (conversationId, lastMessage) {
            return __awaiter(this, void 0, void 0, function () {
                var conversationRef, conversationDoc, now, newConversation, conversationData, updateData, error_5;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 6, , 7]);
                            conversationRef = this.firestore
                                .collection(this.conversationsCollection)
                                .doc(conversationId);
                            return [4 /*yield*/, conversationRef.get()];
                        case 1:
                            conversationDoc = _c.sent();
                            now = new Date();
                            if (!!conversationDoc.exists) return [3 /*break*/, 3];
                            newConversation = {
                                channel: lastMessage.channel,
                                participants: [
                                    {
                                        phoneNumber: lastMessage.from,
                                        userId: lastMessage.userId,
                                        name: lastMessage.userName,
                                    },
                                ],
                                isActive: true,
                                lastMessageAt: now,
                                lastMessagePreview: (_a = lastMessage.body) === null || _a === void 0 ? void 0 : _a.substring(0, 100),
                                messageCount: 1,
                                unreadCount: lastMessage.direction === firestore_message_interface_1.MessageDirection.INBOUND ? 1 : 0,
                                serviceId: lastMessage.serviceId,
                                metadata: lastMessage.metadata,
                                createdAt: now,
                                updatedAt: now,
                            };
                            return [4 /*yield*/, conversationRef.set(newConversation)];
                        case 2:
                            _c.sent();
                            this.logger.log("Conversation created: ".concat(conversationId));
                            return [3 /*break*/, 5];
                        case 3:
                            conversationData = conversationDoc.data();
                            updateData = {
                                lastMessageAt: now,
                                lastMessagePreview: (_b = lastMessage.body) === null || _b === void 0 ? void 0 : _b.substring(0, 100),
                                messageCount: ((conversationData === null || conversationData === void 0 ? void 0 : conversationData.messageCount) || 0) + 1,
                                updatedAt: now,
                            };
                            if (lastMessage.direction === firestore_message_interface_1.MessageDirection.INBOUND) {
                                updateData.unreadCount = ((conversationData === null || conversationData === void 0 ? void 0 : conversationData.unreadCount) || 0) + 1;
                            }
                            return [4 /*yield*/, conversationRef.update(updateData)];
                        case 4:
                            _c.sent();
                            _c.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            error_5 = _c.sent();
                            this.logger.error("Error updating conversation: ".concat(error_5.message));
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Obtener conversación por ID
         */
        FirestoreMessagingService_1.prototype.getConversation = function (conversationId) {
            return __awaiter(this, void 0, void 0, function () {
                var doc, data, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.firestore
                                    .collection(this.conversationsCollection)
                                    .doc(conversationId)
                                    .get()];
                        case 1:
                            doc = _a.sent();
                            if (!doc.exists) {
                                return [2 /*return*/, null];
                            }
                            data = doc.data();
                            return [2 /*return*/, __assign({ id: doc.id }, data)];
                        case 2:
                            error_6 = _a.sent();
                            this.logger.error("Error getting conversation: ".concat(error_6.message));
                            return [2 /*return*/, null];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Listar conversaciones activas
         */
        FirestoreMessagingService_1.prototype.listActiveConversations = function () {
            return __awaiter(this, arguments, void 0, function (limit) {
                var snapshot, conversations_1, error_7;
                if (limit === void 0) { limit = 50; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.firestore
                                    .collection(this.conversationsCollection)
                                    .where('isActive', '==', true)
                                    .orderBy('lastMessageAt', 'desc')
                                    .limit(limit)
                                    .get()];
                        case 1:
                            snapshot = _a.sent();
                            conversations_1 = [];
                            snapshot.forEach(function (doc) {
                                var data = doc.data();
                                conversations_1.push(__assign({ id: doc.id }, data));
                            });
                            return [2 /*return*/, conversations_1];
                        case 2:
                            error_7 = _a.sent();
                            this.logger.error("Error listing conversations: ".concat(error_7.message));
                            throw error_7;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Marcar mensajes como leídos
         */
        FirestoreMessagingService_1.prototype.markMessagesAsRead = function (conversationId) {
            return __awaiter(this, void 0, void 0, function () {
                var messages, count_1, batch_1, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.firestore
                                    .collection(this.messagesCollection)
                                    .where('conversationId', '==', conversationId)
                                    .where('direction', '==', firestore_message_interface_1.MessageDirection.INBOUND)
                                    .where('status', '!=', firestore_message_interface_1.MessageStatus.READ)
                                    .get()];
                        case 1:
                            messages = _a.sent();
                            count_1 = 0;
                            batch_1 = this.firestore.collection(this.messagesCollection).firestore.batch();
                            messages.forEach(function (doc) {
                                batch_1.update(doc.ref, {
                                    status: firestore_message_interface_1.MessageStatus.READ,
                                    readAt: new Date(),
                                    updatedAt: new Date(),
                                });
                                count_1++;
                            });
                            if (!(count_1 > 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, batch_1.commit()];
                        case 2:
                            _a.sent();
                            // Actualizar contador de no leídos
                            return [4 /*yield*/, this.firestore
                                    .collection(this.conversationsCollection)
                                    .doc(conversationId)
                                    .update({ unreadCount: 0 })];
                        case 3:
                            // Actualizar contador de no leídos
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, count_1];
                        case 5:
                            error_8 = _a.sent();
                            this.logger.error("Error marking messages as read: ".concat(error_8.message));
                            throw error_8;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Obtener estadísticas de mensajería
         */
        FirestoreMessagingService_1.prototype.getMessagingStats = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var query, snapshot, stats_1, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            query = this.firestore.collection(this.messagesCollection);
                            if (filters === null || filters === void 0 ? void 0 : filters.startDate) {
                                query = query.where('createdAt', '>=', filters.startDate);
                            }
                            if (filters === null || filters === void 0 ? void 0 : filters.endDate) {
                                query = query.where('createdAt', '<=', filters.endDate);
                            }
                            if (filters === null || filters === void 0 ? void 0 : filters.channel) {
                                query = query.where('channel', '==', filters.channel);
                            }
                            return [4 /*yield*/, query.get()];
                        case 1:
                            snapshot = _a.sent();
                            stats_1 = {
                                totalMessages: 0,
                                inbound: 0,
                                outbound: 0,
                                byChannel: {},
                                byStatus: {},
                            };
                            snapshot.forEach(function (doc) {
                                var message = doc.data();
                                stats_1.totalMessages++;
                                if (message.direction === firestore_message_interface_1.MessageDirection.INBOUND) {
                                    stats_1.inbound++;
                                }
                                else {
                                    stats_1.outbound++;
                                }
                                stats_1.byChannel[message.channel] = (stats_1.byChannel[message.channel] || 0) + 1;
                                stats_1.byStatus[message.status] = (stats_1.byStatus[message.status] || 0) + 1;
                            });
                            return [2 /*return*/, stats_1];
                        case 2:
                            error_9 = _a.sent();
                            this.logger.error("Error getting messaging stats: ".concat(error_9.message));
                            throw error_9;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return FirestoreMessagingService_1;
    }());
    __setFunctionName(_classThis, "FirestoreMessagingService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FirestoreMessagingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FirestoreMessagingService = _classThis;
}();
exports.FirestoreMessagingService = FirestoreMessagingService;
