"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingProvider = void 0;
exports.WithMessaging = WithMessaging;
const messaging_provider_factory_1 = require("../../../../messaging/utils/messaging-provider.factory");
Object.defineProperty(exports, "MessagingProvider", { enumerable: true, get: function () { return messaging_provider_factory_1.MessagingProvider; } });
function WithMessaging(Base) {
    return class extends Base {
        messagingFactory;
        getAvailableProviders() {
            if (!this.messagingFactory) {
                return [];
            }
            return this.messagingFactory.getAvailableProviders();
        }
        async sendByProvider(provider, message) {
            if (!this.messagingFactory) {
                throw new Error('MessagingProviderFactory not initialized');
            }
            const service = this.messagingFactory.getProvider(provider);
            return await service.send(message);
        }
    };
}
//# sourceMappingURL=messaging.mixin.js.map