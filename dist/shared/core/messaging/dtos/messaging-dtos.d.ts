export declare class SendMessageDto {
    channel: 'email' | 'push' | 'sms';
    providerName?: string;
    recipient: any;
    content: any;
    options?: Record<string, any>;
}
