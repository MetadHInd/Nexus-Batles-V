"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let GmailService = GmailService_1 = class GmailService {
    httpService;
    logger = new common_1.Logger(GmailService_1.name);
    GMAIL_API_BASE_URL = 'https://gmail.googleapis.com/gmail/v1';
    OAUTH_URL = 'https://oauth2.googleapis.com/token';
    constructor(httpService) {
        this.httpService = httpService;
    }
    getAuthUrl(credentials, scopes = ['https://www.googleapis.com/auth/gmail.readonly']) {
        const params = new URLSearchParams({
            client_id: credentials.clientId,
            redirect_uri: credentials.redirectUri,
            scope: scopes.join(' '),
            response_type: 'code',
            access_type: 'offline',
            prompt: 'consent'
        });
        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }
    async exchangeCodeForTokens(credentials, authorizationCode) {
        try {
            const tokenData = {
                client_id: credentials.clientId,
                client_secret: credentials.clientSecret,
                code: authorizationCode,
                grant_type: 'authorization_code',
                redirect_uri: credentials.redirectUri
            };
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.OAUTH_URL, tokenData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }));
            return {
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token
            };
        }
        catch (error) {
            this.logger.error('Failed to exchange code for tokens:', error);
            throw new common_1.HttpException('Failed to authenticate with Gmail', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async refreshAccessToken(credentials) {
        try {
            const tokenData = {
                client_id: credentials.clientId,
                client_secret: credentials.clientSecret,
                refresh_token: credentials.refreshToken,
                grant_type: 'refresh_token'
            };
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.OAUTH_URL, tokenData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }));
            return response.data.access_token;
        }
        catch (error) {
            this.logger.error('Failed to refresh access token:', error);
            throw new common_1.HttpException('Failed to refresh Gmail authentication', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async getProfile(accessToken) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.GMAIL_API_BASE_URL}/users/me/profile`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }));
            return response.data;
        }
        catch (error) {
            this.logger.error('Failed to get Gmail profile:', error);
            throw new common_1.HttpException('Failed to get Gmail profile', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async searchMessages(accessToken, options = {}) {
        try {
            const params = new URLSearchParams();
            if (options.query)
                params.append('q', options.query);
            if (options.maxResults)
                params.append('maxResults', options.maxResults.toString());
            if (options.pageToken)
                params.append('pageToken', options.pageToken);
            if (options.includeSpamTrash)
                params.append('includeSpamTrash', 'true');
            if (options.labelIds?.length) {
                options.labelIds.forEach(labelId => params.append('labelIds', labelId));
            }
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.GMAIL_API_BASE_URL}/users/me/messages?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }));
            const messages = await Promise.all((response.data.messages || []).map((msg) => this.getMessage(accessToken, msg.id)));
            return {
                messages,
                nextPageToken: response.data.nextPageToken,
                resultSizeEstimate: response.data.resultSizeEstimate || 0
            };
        }
        catch (error) {
            this.logger.error('Failed to search messages:', error);
            throw new common_1.HttpException('Failed to search Gmail messages', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getMessage(accessToken, messageId, format = 'full') {
        try {
            const params = new URLSearchParams();
            params.append('format', format);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.GMAIL_API_BASE_URL}/users/me/messages/${messageId}?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }));
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to get message ${messageId}:`, error);
            throw new common_1.HttpException('Failed to get Gmail message', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAttachment(accessToken, messageId, attachmentId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.GMAIL_API_BASE_URL}/users/me/messages/${messageId}/attachments/${attachmentId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }));
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to get attachment ${attachmentId}:`, error);
            throw new common_1.HttpException('Failed to get Gmail attachment', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getLabels(accessToken) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.GMAIL_API_BASE_URL}/users/me/labels`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }));
            return response.data.labels || [];
        }
        catch (error) {
            this.logger.error('Failed to get labels:', error);
            throw new common_1.HttpException('Failed to get Gmail labels', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getThread(accessToken, threadId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.GMAIL_API_BASE_URL}/users/me/threads/${threadId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }));
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to get thread ${threadId}:`, error);
            throw new common_1.HttpException('Failed to get Gmail thread', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    parseEmailContent(message) {
        const headers = message.payload.headers;
        const getHeader = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';
        const subject = getHeader('Subject');
        const from = getHeader('From');
        const to = getHeader('To').split(',').map(email => email.trim()).filter(Boolean);
        const cc = getHeader('Cc').split(',').map(email => email.trim()).filter(Boolean);
        const bcc = getHeader('Bcc').split(',').map(email => email.trim()).filter(Boolean);
        const dateStr = getHeader('Date');
        const date = dateStr ? new Date(dateStr) : new Date(parseInt(message.internalDate));
        const { textContent, htmlContent, attachments } = this.extractContent(message.payload);
        return {
            subject,
            from,
            to,
            cc: cc.length > 0 ? cc : undefined,
            bcc: bcc.length > 0 ? bcc : undefined,
            date,
            textContent,
            htmlContent,
            attachments
        };
    }
    extractContent(payload) {
        let textContent;
        let htmlContent;
        const attachments = [];
        const processPayload = (part) => {
            if (part.mimeType === 'text/plain' && part.body?.data) {
                textContent = this.decodeBase64Url(part.body.data);
            }
            else if (part.mimeType === 'text/html' && part.body?.data) {
                htmlContent = this.decodeBase64Url(part.body.data);
            }
            else if (part.filename && part.body?.attachmentId) {
                attachments.push({
                    filename: part.filename,
                    mimeType: part.mimeType,
                    size: part.body.size,
                    attachmentId: part.body.attachmentId
                });
            }
            if (part.parts) {
                part.parts.forEach(processPayload);
            }
        };
        processPayload(payload);
        return { textContent, htmlContent, attachments };
    }
    decodeBase64Url(data) {
        try {
            const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
            const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
            return Buffer.from(padded, 'base64').toString('utf-8');
        }
        catch (error) {
            this.logger.warn('Failed to decode base64url data:', error);
            return '';
        }
    }
    async getUnreadCount(accessToken) {
        try {
            const result = await this.searchMessages(accessToken, {
                query: 'is:unread',
                maxResults: 1
            });
            return result.resultSizeEstimate;
        }
        catch (error) {
            this.logger.error('Failed to get unread count:', error);
            return 0;
        }
    }
    async markAsRead(accessToken, messageId) {
        try {
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.GMAIL_API_BASE_URL}/users/me/messages/${messageId}/modify`, {
                removeLabelIds: ['UNREAD']
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }));
        }
        catch (error) {
            this.logger.error(`Failed to mark message ${messageId} as read:`, error);
            throw new common_1.HttpException('Failed to mark message as read', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async markAsUnread(accessToken, messageId) {
        try {
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.GMAIL_API_BASE_URL}/users/me/messages/${messageId}/modify`, {
                addLabelIds: ['UNREAD']
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }));
        }
        catch (error) {
            this.logger.error(`Failed to mark message ${messageId} as unread:`, error);
            throw new common_1.HttpException('Failed to mark message as unread', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.GmailService = GmailService;
exports.GmailService = GmailService = GmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], GmailService);
//# sourceMappingURL=gmail.service.js.map