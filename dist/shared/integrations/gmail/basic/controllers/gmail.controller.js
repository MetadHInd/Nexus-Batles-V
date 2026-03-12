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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GmailController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const services_1 = require("../services");
const dtos_1 = require("../dtos");
let GmailController = GmailController_1 = class GmailController {
    gmailService;
    logger = new common_1.Logger(GmailController_1.name);
    constructor(gmailService) {
        this.gmailService = gmailService;
    }
    getAuthUrl(authDto) {
        try {
            const credentials = {
                clientId: authDto.clientId || process.env.GMAIL_CLIENT_ID || '',
                clientSecret: authDto.clientSecret || process.env.GMAIL_CLIENT_SECRET || '',
                redirectUri: authDto.redirectUri || process.env.GMAIL_REDIRECT_URI || ''
            };
            if (!credentials.clientId || !credentials.clientSecret || !credentials.redirectUri) {
                throw new common_1.HttpException('Gmail credentials not configured properly', common_1.HttpStatus.BAD_REQUEST);
            }
            const authUrl = this.gmailService.getAuthUrl(credentials);
            return { authUrl };
        }
        catch (error) {
            this.logger.error('Failed to generate auth URL:', error);
            throw new common_1.HttpException('Failed to generate authorization URL', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async exchangeCode(body) {
        try {
            const credentials = {
                clientId: body.credentials?.clientId || process.env.GMAIL_CLIENT_ID || '',
                clientSecret: body.credentials?.clientSecret || process.env.GMAIL_CLIENT_SECRET || '',
                redirectUri: body.credentials?.redirectUri || process.env.GMAIL_REDIRECT_URI || ''
            };
            if (!credentials.clientId || !credentials.clientSecret || !credentials.redirectUri) {
                throw new common_1.HttpException('Gmail credentials not configured properly', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.gmailService.exchangeCodeForTokens(credentials, body.authorizationCode);
        }
        catch (error) {
            this.logger.error('Failed to exchange code:', error);
            throw error;
        }
    }
    async refreshToken(body) {
        try {
            const credentials = {
                clientId: body.credentials?.clientId || process.env.GMAIL_CLIENT_ID || '',
                clientSecret: body.credentials?.clientSecret || process.env.GMAIL_CLIENT_SECRET || '',
                redirectUri: body.credentials?.redirectUri || process.env.GMAIL_REDIRECT_URI || '',
                refreshToken: body.refreshToken
            };
            if (!credentials.clientId || !credentials.clientSecret || !credentials.refreshToken) {
                throw new common_1.HttpException('Gmail credentials not configured properly', common_1.HttpStatus.BAD_REQUEST);
            }
            const accessToken = await this.gmailService.refreshAccessToken(credentials);
            return { accessToken };
        }
        catch (error) {
            this.logger.error('Failed to refresh token:', error);
            throw error;
        }
    }
    async getProfile(accessToken) {
        if (!accessToken) {
            throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.gmailService.getProfile(accessToken);
        }
        catch (error) {
            this.logger.error('Failed to get profile:', error);
            throw error;
        }
    }
    async searchMessages(accessToken, searchDto) {
        if (!accessToken) {
            throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.gmailService.searchMessages(accessToken, searchDto);
        }
        catch (error) {
            this.logger.error('Failed to search messages:', error);
            throw error;
        }
    }
    async getMessage(messageId, accessToken, format) {
        if (!accessToken) {
            throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.gmailService.getMessage(accessToken, messageId, format);
        }
        catch (error) {
            this.logger.error(`Failed to get message ${messageId}:`, error);
            throw error;
        }
    }
    async getParsedMessage(messageId, accessToken) {
        if (!accessToken) {
            throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const message = await this.gmailService.getMessage(accessToken, messageId);
            return this.gmailService.parseEmailContent(message);
        }
        catch (error) {
            this.logger.error(`Failed to parse message ${messageId}:`, error);
            throw error;
        }
    }
    async getAttachment(messageId, attachmentId, accessToken) {
        if (!accessToken) {
            throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.gmailService.getAttachment(accessToken, messageId, attachmentId);
        }
        catch (error) {
            this.logger.error(`Failed to get attachment ${attachmentId}:`, error);
            throw error;
        }
    }
    async getLabels(accessToken) {
        if (!accessToken) {
            throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.gmailService.getLabels(accessToken);
        }
        catch (error) {
            this.logger.error('Failed to get labels:', error);
            throw error;
        }
    }
    async getThread(threadId, accessToken) {
        if (!accessToken) {
            throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.gmailService.getThread(accessToken, threadId);
        }
        catch (error) {
            this.logger.error(`Failed to get thread ${threadId}:`, error);
            throw error;
        }
    }
    async getUnreadCount(accessToken) {
        if (!accessToken) {
            throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const count = await this.gmailService.getUnreadCount(accessToken);
            return { count };
        }
        catch (error) {
            this.logger.error('Failed to get unread count:', error);
            throw error;
        }
    }
    async markAsRead(messageId, body) {
        if (!body.accessToken) {
            throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            await this.gmailService.markAsRead(body.accessToken, messageId);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to mark message ${messageId} as read:`, error);
            throw error;
        }
    }
    async markAsUnread(messageId, body) {
        if (!body.accessToken) {
            throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            await this.gmailService.markAsUnread(body.accessToken, messageId);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to mark message ${messageId} as unread:`, error);
            throw error;
        }
    }
};
exports.GmailController = GmailController;
__decorate([
    (0, common_1.Get)('auth-url'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Gmail OAuth authorization URL' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Authorization URL generated successfully' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.GmailAuthDto]),
    __metadata("design:returntype", Object)
], GmailController.prototype, "getAuthUrl", null);
__decorate([
    (0, common_1.Post)('exchange-code'),
    (0, swagger_1.ApiOperation)({ summary: 'Exchange authorization code for tokens' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tokens exchanged successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GmailController.prototype, "exchangeCode", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh Gmail access token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token refreshed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GmailController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Gmail user profile' }),
    (0, swagger_1.ApiQuery)({ name: 'accessToken', description: 'Gmail access token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile retrieved successfully' }),
    __param(0, (0, common_1.Query)('accessToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GmailController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('messages/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search Gmail messages' }),
    (0, swagger_1.ApiQuery)({ name: 'accessToken', description: 'Gmail access token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages searched successfully' }),
    __param(0, (0, common_1.Query)('accessToken')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.GmailSearchDto]),
    __metadata("design:returntype", Promise)
], GmailController.prototype, "searchMessages", null);
__decorate([
    (0, common_1.Get)('messages/:messageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific Gmail message' }),
    (0, swagger_1.ApiParam)({ name: 'messageId', description: 'Gmail message ID' }),
    (0, swagger_1.ApiQuery)({ name: 'accessToken', description: 'Gmail access token' }),
    (0, swagger_1.ApiQuery)({ name: 'format', enum: ['full', 'metadata', 'minimal', 'raw'], required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message retrieved successfully' }),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Query)('accessToken')),
    __param(2, (0, common_1.Query)('format')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GmailController.prototype, "getMessage", null);
__decorate([
    (0, common_1.Get)('messages/:messageId/parsed'),
    (0, swagger_1.ApiOperation)({ summary: 'Get parsed Gmail message content' }),
    (0, swagger_1.ApiParam)({ name: 'messageId', description: 'Gmail message ID' }),
    (0, swagger_1.ApiQuery)({ name: 'accessToken', description: 'Gmail access token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message parsed successfully' }),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Query)('accessToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GmailController.prototype, "getParsedMessage", null);
__decorate([
    (0, common_1.Get)('messages/:messageId/attachments/:attachmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Gmail message attachment' }),
    (0, swagger_1.ApiParam)({ name: 'messageId', description: 'Gmail message ID' }),
    (0, swagger_1.ApiParam)({ name: 'attachmentId', description: 'Gmail attachment ID' }),
    (0, swagger_1.ApiQuery)({ name: 'accessToken', description: 'Gmail access token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attachment retrieved successfully' }),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Param)('attachmentId')),
    __param(2, (0, common_1.Query)('accessToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GmailController.prototype, "getAttachment", null);
__decorate([
    (0, common_1.Get)('labels'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all Gmail labels' }),
    (0, swagger_1.ApiQuery)({ name: 'accessToken', description: 'Gmail access token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Labels retrieved successfully' }),
    __param(0, (0, common_1.Query)('accessToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GmailController.prototype, "getLabels", null);
__decorate([
    (0, common_1.Get)('threads/:threadId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Gmail thread' }),
    (0, swagger_1.ApiParam)({ name: 'threadId', description: 'Gmail thread ID' }),
    (0, swagger_1.ApiQuery)({ name: 'accessToken', description: 'Gmail access token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Thread retrieved successfully' }),
    __param(0, (0, common_1.Param)('threadId')),
    __param(1, (0, common_1.Query)('accessToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GmailController.prototype, "getThread", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread messages count' }),
    (0, swagger_1.ApiQuery)({ name: 'accessToken', description: 'Gmail access token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unread count retrieved successfully' }),
    __param(0, (0, common_1.Query)('accessToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GmailController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Post)('messages/:messageId/mark-read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark message as read' }),
    (0, swagger_1.ApiParam)({ name: 'messageId', description: 'Gmail message ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message marked as read successfully' }),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GmailController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('messages/:messageId/mark-unread'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark message as unread' }),
    (0, swagger_1.ApiParam)({ name: 'messageId', description: 'Gmail message ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message marked as unread successfully' }),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GmailController.prototype, "markAsUnread", null);
exports.GmailController = GmailController = GmailController_1 = __decorate([
    (0, swagger_1.ApiTags)('14 - Gmail Integration'),
    (0, common_1.Controller)('gmail'),
    __metadata("design:paramtypes", [services_1.GmailService])
], GmailController);
//# sourceMappingURL=gmail.controller.js.map