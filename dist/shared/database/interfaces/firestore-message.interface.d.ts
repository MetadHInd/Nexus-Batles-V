export declare enum MessageDirection {
    INBOUND = "inbound",
    OUTBOUND = "outbound"
}
export declare enum MessageChannel {
    SMS = "sms",
    WHATSAPP = "whatsapp",
    EMAIL = "email",
    PUSH = "push",
    WEB = "web",
    VOICE = "voice"
}
export declare enum MessageStatus {
    PENDING = "pending",
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read",
    FAILED = "failed"
}
export interface FirestoreMessage {
    id?: string;
    conversationId: string;
    sessionId?: string;
    direction: MessageDirection;
    channel: MessageChannel;
    status: MessageStatus;
    from: string;
    to: string;
    body: string;
    mediaUrls?: string[];
    metadata?: Record<string, any>;
    provider?: string;
    providerMessageId?: string;
    userId?: string;
    userName?: string;
    serviceId?: string;
    createdAt: Date;
    updatedAt: Date;
    sentAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    error?: string;
    errorCode?: string;
}
export interface FirestoreConversation {
    id?: string;
    channel: MessageChannel;
    participants: {
        userId?: string;
        phoneNumber?: string;
        email?: string;
        name?: string;
    }[];
    isActive: boolean;
    lastMessageAt: Date;
    lastMessagePreview?: string;
    messageCount: number;
    unreadCount: number;
    serviceId?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface MessageQueryFilters {
    conversationId?: string;
    sessionId?: string;
    userId?: string;
    channel?: MessageChannel;
    direction?: MessageDirection;
    status?: MessageStatus;
    from?: string;
    to?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
}
