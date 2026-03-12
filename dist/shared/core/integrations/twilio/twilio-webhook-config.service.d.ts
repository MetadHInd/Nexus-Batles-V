export declare class TwilioWebhookConfigService {
    private readonly logger;
    private readonly client;
    private readonly baseUrl;
    constructor();
    getWebhookUrls(): {
        baseUrl: string;
        statusCallback: string;
        incomingSms: string;
        conversationsWebhook: string;
        healthCheck: string;
    };
    configurePhoneNumberWebhooks(phoneNumber?: string): Promise<any>;
    configureMessagingServiceWebhooks(messagingServiceSid?: string): Promise<any>;
    configureConversationsWebhooks(conversationServiceSid?: string): Promise<any>;
    configureAllWebhooks(): Promise<any>;
    verifyWebhooks(): Promise<any>;
}
