import { MessagingProviderFactory, MessagingProvider } from '../../../../messaging/utils/messaging-provider.factory';
export { MessagingProvider };
export interface WithMessaging {
    messagingFactory: MessagingProviderFactory;
    getAvailableProviders(): string[];
    sendByProvider(provider: MessagingProvider, message: any): Promise<any>;
}
export declare function WithMessaging<T extends new (...args: any[]) => {}>(Base: T): {
    new (...args: any[]): {
        messagingFactory: MessagingProviderFactory;
        getAvailableProviders(): string[];
        sendByProvider(provider: MessagingProvider, message: any): Promise<any>;
    };
} & T;
