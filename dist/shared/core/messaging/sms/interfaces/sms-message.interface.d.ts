export interface SmsMessage {
    to: string | string[];
    body: string;
    from?: string;
    providerId?: number;
    metadata?: Record<string, any>;
}
export interface SmsResult {
    success: boolean;
    messageId?: string;
    error?: string;
    details?: any;
}
