export declare class TwilioWebhookConfigService {
    private readonly logger;
    private client;
    constructor();
    getBaseUrl(): string;
    getWebhookUrls(): {
        baseUrl: string;
        unified: string;
        statusCallback: string;
        incomingSms: string;
        conversationsWebhook: string;
        healthCheck: string;
    };
    configurePhoneNumberWebhooks(phoneNumber?: string): Promise<any>;
    configureMessagingServiceWebhooks(messagingServiceSid?: string): Promise<any>;
    configureConversationsWebhooks(conversationServiceSid?: string): Promise<any>;
    configureAllWebhooks(config?: {
        phoneNumber?: string;
        messagingServiceSid?: string;
        conversationServiceSid?: string;
    }): Promise<any>;
    verifyWebhooks(phoneNumber?: string): Promise<any>;
}
