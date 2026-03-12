import { WhatsAppMessage, WhatsAppInteractiveListMessage } from '../interfaces/whatsapp-message.interface';
import { WhatsAppResult } from '../interfaces/whatsapp-result.interface';
export declare class WhatsAppService {
    private readonly logger;
    send(message: WhatsAppMessage): Promise<WhatsAppResult>;
    sendInteractive(message: WhatsAppInteractiveListMessage): Promise<WhatsAppResult>;
}
