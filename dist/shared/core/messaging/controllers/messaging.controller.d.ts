import { MessagingProviderFactory } from '../utils/messaging-provider.factory';
import { SendMessageDto } from '../dtos/messaging-dtos';
export declare class MessagingController {
    private readonly messagingFactory;
    constructor(messagingFactory: MessagingProviderFactory);
    send(dto: SendMessageDto): Promise<any>;
}
