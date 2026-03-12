import { MessagingProviderFactory, MessagingProvider } from '../../../../messaging/utils/messaging-provider.factory';

export { MessagingProvider };

export interface WithMessaging {
  messagingFactory: MessagingProviderFactory;
  getAvailableProviders(): string[];
  sendByProvider(provider: MessagingProvider, message: any): Promise<any>;
}

export function WithMessaging<T extends new (...args: any[]) => {}>(Base: T) {
  return class extends Base implements WithMessaging {
    messagingFactory: MessagingProviderFactory;

    getAvailableProviders(): string[] {
      if (!this.messagingFactory) {
        return [];
      }
      return this.messagingFactory.getAvailableProviders();
    }

    async sendByProvider(provider: MessagingProvider, message: any): Promise<any> {
      if (!this.messagingFactory) {
        throw new Error('MessagingProviderFactory not initialized');
      }
      const service = this.messagingFactory.getProvider(provider);
      return await service.send(message);
    }
  };
}
