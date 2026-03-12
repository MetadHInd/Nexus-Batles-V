import { FirestoreMessagingService } from '../firestore-messaging.service';
import { MessageQueryFilters, MessageChannel } from '../interfaces/firestore-message.interface';
export declare class MessagingHistoryController {
    private readonly firestoreMessaging;
    constructor(firestoreMessaging: FirestoreMessagingService);
    getConversationMessages(conversationId: string, limit?: number): Promise<{
        success: boolean;
        conversationId: string;
        count: number;
        messages: import("../interfaces/firestore-message.interface").FirestoreMessage[];
    }>;
    getConversation(conversationId: string): Promise<{
        success: boolean;
        conversation: import("../interfaces/firestore-message.interface").FirestoreConversation | null;
    }>;
    listActiveConversations(limit?: number): Promise<{
        success: boolean;
        count: number;
        conversations: import("../interfaces/firestore-message.interface").FirestoreConversation[];
    }>;
    searchMessages(filters: MessageQueryFilters): Promise<{
        success: boolean;
        count: number;
        messages: import("../interfaces/firestore-message.interface").FirestoreMessage[];
        filters: MessageQueryFilters;
    }>;
    markAsRead(conversationId: string): Promise<{
        success: boolean;
        conversationId: string;
        markedCount: number;
    }>;
    getStats(startDate?: string, endDate?: string, channel?: MessageChannel): Promise<{
        success: boolean;
        stats: {
            totalMessages: number;
            inbound: number;
            outbound: number;
            byChannel: Record<string, number>;
            byStatus: Record<string, number>;
        };
    }>;
    health(): {
        status: string;
        service: string;
        storage: string;
        timestamp: string;
    };
}
