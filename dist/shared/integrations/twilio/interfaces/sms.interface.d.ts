export interface ISmsService {
    sendSms(message: SmsMessage): Promise<SmsResult>;
    sendBulkSms(messages: SmsMessage[]): Promise<SmsResult[]>;
}
export interface SmsMessage {
    to: string | string[];
    body: string;
    from?: string;
    mediaUrl?: string[];
}
export interface SmsResult {
    success: boolean;
    messageSid?: string;
    to?: string;
    status?: string;
    error?: string;
}
