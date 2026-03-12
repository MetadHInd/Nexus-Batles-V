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
var FirestoreMessagingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreMessagingService = void 0;
const common_1 = require("@nestjs/common");
const firestore_service_1 = require("./firestore.service");
const firestore_message_interface_1 = require("./interfaces/firestore-message.interface");
let FirestoreMessagingService = FirestoreMessagingService_1 = class FirestoreMessagingService {
    firestore;
    logger = new common_1.Logger(FirestoreMessagingService_1.name);
    messagesCollection = 'messages';
    conversationsCollection = 'conversations';
    constructor(firestore) {
        this.firestore = firestore;
    }
    async saveMessage(message) {
        try {
            const now = new Date();
            const messageData = {
                ...message,
                createdAt: now,
                updatedAt: now,
            };
            const docRef = await this.firestore.collection(this.messagesCollection).add(messageData);
            this.logger.log(`Message saved: ${docRef.id} (${message.direction} - ${message.channel})`);
            await this.updateConversation(message.conversationId, message);
            return docRef.id;
        }
        catch (error) {
            this.logger.error(`Error saving message: ${error.message}`, error.stack);
            throw error;
        }
    }
    async saveInboundMessage(data) {
        return this.saveMessage({
            ...data,
            direction: firestore_message_interface_1.MessageDirection.INBOUND,
            status: firestore_message_interface_1.MessageStatus.DELIVERED,
        });
    }
    async saveOutboundMessage(data) {
        return this.saveMessage({
            ...data,
            direction: firestore_message_interface_1.MessageDirection.OUTBOUND,
            status: firestore_message_interface_1.MessageStatus.SENT,
        });
    }
    async updateMessageStatus(messageId, status, additionalData) {
        try {
            const updateData = {
                status,
                updatedAt: new Date(),
            };
            if (status === firestore_message_interface_1.MessageStatus.SENT && !additionalData?.sentAt) {
                updateData.sentAt = new Date();
            }
            if (status === firestore_message_interface_1.MessageStatus.DELIVERED && !additionalData?.deliveredAt) {
                updateData.deliveredAt = new Date();
            }
            if (status === firestore_message_interface_1.MessageStatus.READ && !additionalData?.readAt) {
                updateData.readAt = new Date();
            }
            if (additionalData) {
                Object.assign(updateData, additionalData);
            }
            await this.firestore
                .collection(this.messagesCollection)
                .doc(messageId)
                .update(updateData);
            this.logger.log(`Message ${messageId} status updated to ${status}`);
        }
        catch (error) {
            this.logger.error(`Error updating message status: ${error.message}`);
            throw error;
        }
    }
    async getConversationMessages(conversationId, limit = 100) {
        try {
            const snapshot = await this.firestore
                .collection(this.messagesCollection)
                .where('conversationId', '==', conversationId)
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();
            const messages = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                messages.push({
                    id: doc.id,
                    ...data,
                });
            });
            return messages.reverse();
        }
        catch (error) {
            this.logger.error(`Error getting conversation messages: ${error.message}`);
            throw error;
        }
    }
    async searchMessages(filters) {
        try {
            let query = this.firestore.collection(this.messagesCollection);
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
            const snapshot = await query.get();
            const messages = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                messages.push({
                    id: doc.id,
                    ...data,
                });
            });
            return messages;
        }
        catch (error) {
            this.logger.error(`Error searching messages: ${error.message}`);
            throw error;
        }
    }
    async updateConversation(conversationId, lastMessage) {
        try {
            const conversationRef = this.firestore
                .collection(this.conversationsCollection)
                .doc(conversationId);
            const conversationDoc = await conversationRef.get();
            const now = new Date();
            if (!conversationDoc.exists) {
                const newConversation = {
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
                    lastMessagePreview: lastMessage.body?.substring(0, 100),
                    messageCount: 1,
                    unreadCount: lastMessage.direction === firestore_message_interface_1.MessageDirection.INBOUND ? 1 : 0,
                    serviceId: lastMessage.serviceId,
                    metadata: lastMessage.metadata,
                    createdAt: now,
                    updatedAt: now,
                };
                await conversationRef.set(newConversation);
                this.logger.log(`Conversation created: ${conversationId}`);
            }
            else {
                const conversationData = conversationDoc.data();
                const updateData = {
                    lastMessageAt: now,
                    lastMessagePreview: lastMessage.body?.substring(0, 100),
                    messageCount: (conversationData?.messageCount || 0) + 1,
                    updatedAt: now,
                };
                if (lastMessage.direction === firestore_message_interface_1.MessageDirection.INBOUND) {
                    updateData.unreadCount = (conversationData?.unreadCount || 0) + 1;
                }
                await conversationRef.update(updateData);
            }
        }
        catch (error) {
            this.logger.error(`Error updating conversation: ${error.message}`);
        }
    }
    async getConversation(conversationId) {
        try {
            const doc = await this.firestore
                .collection(this.conversationsCollection)
                .doc(conversationId)
                .get();
            if (!doc.exists) {
                return null;
            }
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
            };
        }
        catch (error) {
            this.logger.error(`Error getting conversation: ${error.message}`);
            return null;
        }
    }
    async listActiveConversations(limit = 50) {
        try {
            const snapshot = await this.firestore
                .collection(this.conversationsCollection)
                .where('isActive', '==', true)
                .orderBy('lastMessageAt', 'desc')
                .limit(limit)
                .get();
            const conversations = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                conversations.push({
                    id: doc.id,
                    ...data,
                });
            });
            return conversations;
        }
        catch (error) {
            this.logger.error(`Error listing conversations: ${error.message}`);
            throw error;
        }
    }
    async markMessagesAsRead(conversationId) {
        try {
            const messages = await this.firestore
                .collection(this.messagesCollection)
                .where('conversationId', '==', conversationId)
                .where('direction', '==', firestore_message_interface_1.MessageDirection.INBOUND)
                .where('status', '!=', firestore_message_interface_1.MessageStatus.READ)
                .get();
            let count = 0;
            const batch = this.firestore.collection(this.messagesCollection).firestore.batch();
            messages.forEach((doc) => {
                batch.update(doc.ref, {
                    status: firestore_message_interface_1.MessageStatus.READ,
                    readAt: new Date(),
                    updatedAt: new Date(),
                });
                count++;
            });
            if (count > 0) {
                await batch.commit();
                await this.firestore
                    .collection(this.conversationsCollection)
                    .doc(conversationId)
                    .update({ unreadCount: 0 });
            }
            return count;
        }
        catch (error) {
            this.logger.error(`Error marking messages as read: ${error.message}`);
            throw error;
        }
    }
    async getMessagingStats(filters) {
        try {
            let query = this.firestore.collection(this.messagesCollection);
            if (filters?.startDate) {
                query = query.where('createdAt', '>=', filters.startDate);
            }
            if (filters?.endDate) {
                query = query.where('createdAt', '<=', filters.endDate);
            }
            if (filters?.channel) {
                query = query.where('channel', '==', filters.channel);
            }
            const snapshot = await query.get();
            const stats = {
                totalMessages: 0,
                inbound: 0,
                outbound: 0,
                byChannel: {},
                byStatus: {},
            };
            snapshot.forEach((doc) => {
                const message = doc.data();
                stats.totalMessages++;
                if (message.direction === firestore_message_interface_1.MessageDirection.INBOUND) {
                    stats.inbound++;
                }
                else {
                    stats.outbound++;
                }
                stats.byChannel[message.channel] = (stats.byChannel[message.channel] || 0) + 1;
                stats.byStatus[message.status] = (stats.byStatus[message.status] || 0) + 1;
            });
            return stats;
        }
        catch (error) {
            this.logger.error(`Error getting messaging stats: ${error.message}`);
            throw error;
        }
    }
};
exports.FirestoreMessagingService = FirestoreMessagingService;
exports.FirestoreMessagingService = FirestoreMessagingService = FirestoreMessagingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firestore_service_1.FirestoreService])
], FirestoreMessagingService);
//# sourceMappingURL=firestore-messaging.service.js.map