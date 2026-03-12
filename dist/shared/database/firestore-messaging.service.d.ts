import { FirestoreService } from './firestore.service';
import { FirestoreMessage, FirestoreConversation, MessageChannel, MessageStatus, MessageQueryFilters } from './interfaces/firestore-message.interface';
export declare class FirestoreMessagingService {
    private readonly firestore;
    private readonly logger;
    private readonly messagesCollection;
    private readonly conversationsCollection;
    constructor(firestore: FirestoreService);
    saveMessage(message: Omit<FirestoreMessage, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>;
    saveInboundMessage(data: {
        conversationId: string;
        sessionId?: string;
        channel: MessageChannel;
        from: string;
        to: string;
        body: string;
        userId?: string;
        userName?: string;
        provider?: string;
        providerMessageId?: string;
        metadata?: Record<string, any>;
    }): Promise<string>;
    saveOutboundMessage(data: {
        conversationId: string;
        sessionId?: string;
        channel: MessageChannel;
        from: string;
        to: string;
        body: string;
        serviceId?: string;
        provider?: string;
        providerMessageId?: string;
        metadata?: Record<string, any>;
    }): Promise<string>;
    updateMessageStatus(messageId: string, status: MessageStatus, additionalData?: Partial<FirestoreMessage>): Promise<void>;
    getConversationMessages(conversationId: string, limit?: number): Promise<FirestoreMessage[]>;
    searchMessages(filters: MessageQueryFilters): Promise<FirestoreMessage[]>;
    updateConversation(conversationId: string, lastMessage: Partial<FirestoreMessage>): Promise<void>;
    getConversation(conversationId: string): Promise<FirestoreConversation | null>;
    listActiveConversations(limit?: number): Promise<FirestoreConversation[]>;
    markMessagesAsRead(conversationId: string): Promise<number>;
    getMessagingStats(filters?: {
        startDate?: Date;
        endDate?: Date;
        channel?: MessageChannel;
    }): Promise<{
        totalMessages: number;
        inbound: number;
        outbound: number;
        byChannel: Record<string, number>;
        byStatus: Record<string, number>;
    }>;
}
