import { HttpService } from '@nestjs/axios';
import { GmailCredentials, GmailMessage, GmailSearchOptions, GmailSearchResult, GmailLabel, ParsedEmailContent, GmailAttachment, GmailThread } from '../interfaces';
export declare class GmailService {
    private readonly httpService;
    private readonly logger;
    private readonly GMAIL_API_BASE_URL;
    private readonly OAUTH_URL;
    constructor(httpService: HttpService);
    getAuthUrl(credentials: GmailCredentials, scopes?: string[]): string;
    exchangeCodeForTokens(credentials: GmailCredentials, authorizationCode: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshAccessToken(credentials: GmailCredentials): Promise<string>;
    getProfile(accessToken: string): Promise<any>;
    searchMessages(accessToken: string, options?: GmailSearchOptions): Promise<GmailSearchResult>;
    getMessage(accessToken: string, messageId: string, format?: 'full' | 'metadata' | 'minimal' | 'raw'): Promise<GmailMessage>;
    getAttachment(accessToken: string, messageId: string, attachmentId: string): Promise<GmailAttachment>;
    getLabels(accessToken: string): Promise<GmailLabel[]>;
    getThread(accessToken: string, threadId: string): Promise<GmailThread>;
    parseEmailContent(message: GmailMessage): ParsedEmailContent;
    private extractContent;
    private decodeBase64Url;
    getUnreadCount(accessToken: string): Promise<number>;
    markAsRead(accessToken: string, messageId: string): Promise<void>;
    markAsUnread(accessToken: string, messageId: string): Promise<void>;
}
