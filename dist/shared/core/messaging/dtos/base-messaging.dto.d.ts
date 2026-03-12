export declare class BaseMessagingDto {
    messageId?: string;
    tenantId?: string;
    metadata?: Record<string, any>;
}
export declare class MessagingConfigDto {
    logDelivery?: boolean;
    retryOnFailure?: boolean;
    maxRetries?: number;
    retryDelay?: number;
}
export declare class ConfigurableMessagingDto extends BaseMessagingDto {
    config?: MessagingConfigDto;
}
