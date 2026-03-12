import { GmailService } from '../services';
import { GmailSearchDto, GmailAuthDto } from '../dtos';
import { GmailSearchResult, GmailMessage, GmailLabel, ParsedEmailContent, GmailAttachment, GmailThread } from '../interfaces';
export declare class GmailController {
    private readonly gmailService;
    private readonly logger;
    constructor(gmailService: GmailService);
    getAuthUrl(authDto: GmailAuthDto): {
        authUrl: string;
    };
    exchangeCode(body: {
        authorizationCode: string;
        credentials?: GmailAuthDto;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(body: {
        refreshToken: string;
        credentials?: GmailAuthDto;
    }): Promise<{
        accessToken: string;
    }>;
    getProfile(accessToken: string): Promise<any>;
    searchMessages(accessToken: string, searchDto: GmailSearchDto): Promise<GmailSearchResult>;
    getMessage(messageId: string, accessToken: string, format?: 'full' | 'metadata' | 'minimal' | 'raw'): Promise<GmailMessage>;
    getParsedMessage(messageId: string, accessToken: string): Promise<ParsedEmailContent>;
    getAttachment(messageId: string, attachmentId: string, accessToken: string): Promise<GmailAttachment>;
    getLabels(accessToken: string): Promise<GmailLabel[]>;
    getThread(threadId: string, accessToken: string): Promise<GmailThread>;
    getUnreadCount(accessToken: string): Promise<{
        count: number;
    }>;
    markAsRead(messageId: string, body: {
        accessToken: string;
    }): Promise<{
        success: boolean;
    }>;
    markAsUnread(messageId: string, body: {
        accessToken: string;
    }): Promise<{
        success: boolean;
    }>;
}
