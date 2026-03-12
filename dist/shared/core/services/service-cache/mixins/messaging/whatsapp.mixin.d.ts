import { WhatsAppService } from '../../../../messaging/whatsapp/services/whatsapp.service';
import { WhatsAppMessage, WhatsAppInteractiveListMessage } from '../../../../messaging/whatsapp/interfaces/whatsapp-message.interface';
import { WhatsAppResult } from '../../../../messaging/whatsapp/interfaces/whatsapp-result.interface';
export interface WithWhatsApp {
    whatsAppService?: WhatsAppService;
    send(message: WhatsAppMessage): Promise<WhatsAppResult>;
    sendText(to: string, text: string): Promise<WhatsAppResult>;
    sendInteractive(message: WhatsAppInteractiveListMessage): Promise<WhatsAppResult>;
    validateConfig(): boolean;
}
export declare class WhatsAppMixin {
    whatsAppService?: WhatsAppService;
    send(message: WhatsAppMessage): Promise<WhatsAppResult>;
    sendText(to: string, text: string): Promise<WhatsAppResult>;
    sendInteractive(message: WhatsAppInteractiveListMessage): Promise<WhatsAppResult>;
    sendWithAttachment(to: string, text: string, attachmentUrl: string, type: 'image' | 'document' | 'audio'): Promise<WhatsAppResult>;
    validateConfig(): boolean;
}
export declare function WithWhatsApp<T extends new (...args: any[]) => {}>(Base: T): {
    new (...args: any[]): {
        whatsAppService?: WhatsAppService;
        send(message: WhatsAppMessage): Promise<WhatsAppResult>;
        sendText(to: string, text: string): Promise<WhatsAppResult>;
        sendInteractive(message: WhatsAppInteractiveListMessage): Promise<WhatsAppResult>;
        validateConfig(): boolean;
    };
} & T;
