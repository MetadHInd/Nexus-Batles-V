export interface MessageLogEntry {
    messageId: string;
    channel: 'email' | 'push' | 'sms';
    status: 'pending' | 'sent' | 'failed' | 'delivered';
    timestamp: Date;
    recipient: string | string[];
    subject?: string;
    provider?: string;
    success: boolean;
    error?: string;
    providerMessageId?: string;
    retryCount?: number;
    userId?: string;
    tenantId?: string;
    templateName?: string;
    metadata?: Record<string, any>;
}
export declare class MessageLoggerService {
    private readonly logger;
    logMessage(entry: MessageLogEntry): Promise<void>;
    private logToConsole;
}
