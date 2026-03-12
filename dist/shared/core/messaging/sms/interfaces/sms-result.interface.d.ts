export interface SmsResult {
    success: boolean;
    messageId?: string;
    error?: string;
    provider?: string;
    timestamp?: string;
}
