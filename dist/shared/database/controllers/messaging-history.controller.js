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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingHistoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const firestore_messaging_service_1 = require("../firestore-messaging.service");
const firestore_message_interface_1 = require("../interfaces/firestore-message.interface");
let MessagingHistoryController = class MessagingHistoryController {
    firestoreMessaging;
    constructor(firestoreMessaging) {
        this.firestoreMessaging = firestoreMessaging;
    }
    async getConversationMessages(conversationId, limit) {
        const messages = await this.firestoreMessaging.getConversationMessages(conversationId, limit ? parseInt(limit.toString()) : 100);
        return {
            success: true,
            conversationId,
            count: messages.length,
            messages,
        };
    }
    async getConversation(conversationId) {
        const conversation = await this.firestoreMessaging.getConversation(conversationId);
        return {
            success: !!conversation,
            conversation,
        };
    }
    async listActiveConversations(limit) {
        const conversations = await this.firestoreMessaging.listActiveConversations(limit ? parseInt(limit.toString()) : 50);
        return {
            success: true,
            count: conversations.length,
            conversations,
        };
    }
    async searchMessages(filters) {
        const messages = await this.firestoreMessaging.searchMessages(filters);
        return {
            success: true,
            count: messages.length,
            messages,
            filters,
        };
    }
    async markAsRead(conversationId) {
        const count = await this.firestoreMessaging.markMessagesAsRead(conversationId);
        return {
            success: true,
            conversationId,
            markedCount: count,
        };
    }
    async getStats(startDate, endDate, channel) {
        const stats = await this.firestoreMessaging.getMessagingStats({
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            channel,
        });
        return {
            success: true,
            stats,
        };
    }
    health() {
        return {
            status: 'ok',
            service: 'Messaging History',
            storage: 'Firestore',
            timestamp: new Date().toISOString(),
        };
    }
};
exports.MessagingHistoryController = MessagingHistoryController;
__decorate([
    (0, common_1.Get)('conversation/:conversationId/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener mensajes de una conversación' }),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], MessagingHistoryController.prototype, "getConversationMessages", null);
__decorate([
    (0, common_1.Get)('conversation/:conversationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener información de conversación' }),
    __param(0, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessagingHistoryController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Get)('conversations/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar conversaciones activas' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MessagingHistoryController.prototype, "listActiveConversations", null);
__decorate([
    (0, common_1.Post)('messages/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar mensajes con filtros' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagingHistoryController.prototype, "searchMessages", null);
__decorate([
    (0, common_1.Post)('conversation/:conversationId/mark-read'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar mensajes como leídos' }),
    __param(0, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessagingHistoryController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas de mensajería' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('channel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MessagingHistoryController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check del sistema de mensajería' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MessagingHistoryController.prototype, "health", null);
exports.MessagingHistoryController = MessagingHistoryController = __decorate([
    (0, swagger_1.ApiTags)('Messaging History'),
    (0, common_1.Controller)('messaging-history'),
    __metadata("design:paramtypes", [firestore_messaging_service_1.FirestoreMessagingService])
], MessagingHistoryController);
//# sourceMappingURL=messaging-history.controller.js.map