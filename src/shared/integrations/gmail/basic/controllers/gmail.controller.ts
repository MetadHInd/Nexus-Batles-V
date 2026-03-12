// gmail.controller.ts
import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  HttpStatus,
  HttpException,
  Logger
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { GmailService } from '../services';
import {
  GmailSearchDto,
  GmailAuthDto,
  GmailMessageParamsDto,
  GmailAttachmentParamsDto
} from '../dtos';
import {
  GmailCredentials,
  GmailSearchResult,
  GmailMessage,
  GmailLabel,
  ParsedEmailContent,
  GmailAttachment,
  GmailThread
} from '../interfaces';

@ApiTags('14 - Gmail Integration')
@Controller('gmail')
export class GmailController {
  private readonly logger = new Logger(GmailController.name);

  constructor(private readonly gmailService: GmailService) {}

  @Get('auth-url')
  @ApiOperation({ summary: 'Get Gmail OAuth authorization URL' })
  @ApiResponse({ status: 200, description: 'Authorization URL generated successfully' })
  getAuthUrl(@Query() authDto: GmailAuthDto): { authUrl: string } {
    try {
      const credentials: GmailCredentials = {
        clientId: authDto.clientId || process.env.GMAIL_CLIENT_ID || '',
        clientSecret: authDto.clientSecret || process.env.GMAIL_CLIENT_SECRET || '',
        redirectUri: authDto.redirectUri || process.env.GMAIL_REDIRECT_URI || ''
      };

      if (!credentials.clientId || !credentials.clientSecret || !credentials.redirectUri) {
        throw new HttpException(
          'Gmail credentials not configured properly',
          HttpStatus.BAD_REQUEST
        );
      }

      const authUrl = this.gmailService.getAuthUrl(credentials);
      return { authUrl };
    } catch (error) {
      this.logger.error('Failed to generate auth URL:', error);
      throw new HttpException(
        'Failed to generate authorization URL',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('exchange-code')
  @ApiOperation({ summary: 'Exchange authorization code for tokens' })
  @ApiResponse({ status: 200, description: 'Tokens exchanged successfully' })
  async exchangeCode(
    @Body() body: { authorizationCode: string; credentials?: GmailAuthDto }
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const credentials: GmailCredentials = {
        clientId: body.credentials?.clientId || process.env.GMAIL_CLIENT_ID || '',
        clientSecret: body.credentials?.clientSecret || process.env.GMAIL_CLIENT_SECRET || '',
        redirectUri: body.credentials?.redirectUri || process.env.GMAIL_REDIRECT_URI || ''
      };

      if (!credentials.clientId || !credentials.clientSecret || !credentials.redirectUri) {
        throw new HttpException(
          'Gmail credentials not configured properly',
          HttpStatus.BAD_REQUEST
        );
      }

      return await this.gmailService.exchangeCodeForTokens(
        credentials,
        body.authorizationCode
      );
    } catch (error) {
      this.logger.error('Failed to exchange code:', error);
      throw error;
    }
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh Gmail access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  async refreshToken(
    @Body() body: { refreshToken: string; credentials?: GmailAuthDto }
  ): Promise<{ accessToken: string }> {
    try {
      const credentials: GmailCredentials = {
        clientId: body.credentials?.clientId || process.env.GMAIL_CLIENT_ID || '',
        clientSecret: body.credentials?.clientSecret || process.env.GMAIL_CLIENT_SECRET || '',
        redirectUri: body.credentials?.redirectUri || process.env.GMAIL_REDIRECT_URI || '',
        refreshToken: body.refreshToken
      };

      if (!credentials.clientId || !credentials.clientSecret || !credentials.refreshToken) {
        throw new HttpException(
          'Gmail credentials not configured properly',
          HttpStatus.BAD_REQUEST
        );
      }

      const accessToken = await this.gmailService.refreshAccessToken(credentials);
      return { accessToken };
    } catch (error) {
      this.logger.error('Failed to refresh token:', error);
      throw error;
    }
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get Gmail user profile' })
  @ApiQuery({ name: 'accessToken', description: 'Gmail access token' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@Query('accessToken') accessToken: string): Promise<any> {
    if (!accessToken) {
      throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.gmailService.getProfile(accessToken);
    } catch (error) {
      this.logger.error('Failed to get profile:', error);
      throw error;
    }
  }

  @Get('messages/search')
  @ApiOperation({ summary: 'Search Gmail messages' })
  @ApiQuery({ name: 'accessToken', description: 'Gmail access token' })
  @ApiResponse({ status: 200, description: 'Messages searched successfully' })
  async searchMessages(
    @Query('accessToken') accessToken: string,
    @Query() searchDto: GmailSearchDto
  ): Promise<GmailSearchResult> {
    if (!accessToken) {
      throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.gmailService.searchMessages(accessToken, searchDto);
    } catch (error) {
      this.logger.error('Failed to search messages:', error);
      throw error;
    }
  }

  @Get('messages/:messageId')
  @ApiOperation({ summary: 'Get a specific Gmail message' })
  @ApiParam({ name: 'messageId', description: 'Gmail message ID' })
  @ApiQuery({ name: 'accessToken', description: 'Gmail access token' })
  @ApiQuery({ name: 'format', enum: ['full', 'metadata', 'minimal', 'raw'], required: false })
  @ApiResponse({ status: 200, description: 'Message retrieved successfully' })
  async getMessage(
    @Param('messageId') messageId: string,
    @Query('accessToken') accessToken: string,
    @Query('format') format?: 'full' | 'metadata' | 'minimal' | 'raw'
  ): Promise<GmailMessage> {
    if (!accessToken) {
      throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.gmailService.getMessage(accessToken, messageId, format);
    } catch (error) {
      this.logger.error(`Failed to get message ${messageId}:`, error);
      throw error;
    }
  }

  @Get('messages/:messageId/parsed')
  @ApiOperation({ summary: 'Get parsed Gmail message content' })
  @ApiParam({ name: 'messageId', description: 'Gmail message ID' })
  @ApiQuery({ name: 'accessToken', description: 'Gmail access token' })
  @ApiResponse({ status: 200, description: 'Message parsed successfully' })
  async getParsedMessage(
    @Param('messageId') messageId: string,
    @Query('accessToken') accessToken: string
  ): Promise<ParsedEmailContent> {
    if (!accessToken) {
      throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const message = await this.gmailService.getMessage(accessToken, messageId);
      return this.gmailService.parseEmailContent(message);
    } catch (error) {
      this.logger.error(`Failed to parse message ${messageId}:`, error);
      throw error;
    }
  }

  @Get('messages/:messageId/attachments/:attachmentId')
  @ApiOperation({ summary: 'Get Gmail message attachment' })
  @ApiParam({ name: 'messageId', description: 'Gmail message ID' })
  @ApiParam({ name: 'attachmentId', description: 'Gmail attachment ID' })
  @ApiQuery({ name: 'accessToken', description: 'Gmail access token' })
  @ApiResponse({ status: 200, description: 'Attachment retrieved successfully' })
  async getAttachment(
    @Param('messageId') messageId: string,
    @Param('attachmentId') attachmentId: string,
    @Query('accessToken') accessToken: string
  ): Promise<GmailAttachment> {
    if (!accessToken) {
      throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.gmailService.getAttachment(accessToken, messageId, attachmentId);
    } catch (error) {
      this.logger.error(`Failed to get attachment ${attachmentId}:`, error);
      throw error;
    }
  }

  @Get('labels')
  @ApiOperation({ summary: 'Get all Gmail labels' })
  @ApiQuery({ name: 'accessToken', description: 'Gmail access token' })
  @ApiResponse({ status: 200, description: 'Labels retrieved successfully' })
  async getLabels(@Query('accessToken') accessToken: string): Promise<GmailLabel[]> {
    if (!accessToken) {
      throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.gmailService.getLabels(accessToken);
    } catch (error) {
      this.logger.error('Failed to get labels:', error);
      throw error;
    }
  }

  @Get('threads/:threadId')
  @ApiOperation({ summary: 'Get Gmail thread' })
  @ApiParam({ name: 'threadId', description: 'Gmail thread ID' })
  @ApiQuery({ name: 'accessToken', description: 'Gmail access token' })
  @ApiResponse({ status: 200, description: 'Thread retrieved successfully' })
  async getThread(
    @Param('threadId') threadId: string,
    @Query('accessToken') accessToken: string
  ): Promise<GmailThread> {
    if (!accessToken) {
      throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.gmailService.getThread(accessToken, threadId);
    } catch (error) {
      this.logger.error(`Failed to get thread ${threadId}:`, error);
      throw error;
    }
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread messages count' })
  @ApiQuery({ name: 'accessToken', description: 'Gmail access token' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved successfully' })
  async getUnreadCount(@Query('accessToken') accessToken: string): Promise<{ count: number }> {
    if (!accessToken) {
      throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const count = await this.gmailService.getUnreadCount(accessToken);
      return { count };
    } catch (error) {
      this.logger.error('Failed to get unread count:', error);
      throw error;
    }
  }

  @Post('messages/:messageId/mark-read')
  @ApiOperation({ summary: 'Mark message as read' })
  @ApiParam({ name: 'messageId', description: 'Gmail message ID' })
  @ApiResponse({ status: 200, description: 'Message marked as read successfully' })
  async markAsRead(
    @Param('messageId') messageId: string,
    @Body() body: { accessToken: string }
  ): Promise<{ success: boolean }> {
    if (!body.accessToken) {
      throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.gmailService.markAsRead(body.accessToken, messageId);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to mark message ${messageId} as read:`, error);
      throw error;
    }
  }

  @Post('messages/:messageId/mark-unread')
  @ApiOperation({ summary: 'Mark message as unread' })
  @ApiParam({ name: 'messageId', description: 'Gmail message ID' })
  @ApiResponse({ status: 200, description: 'Message marked as unread successfully' })
  async markAsUnread(
    @Param('messageId') messageId: string,
    @Body() body: { accessToken: string }
  ): Promise<{ success: boolean }> {
    if (!body.accessToken) {
      throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.gmailService.markAsUnread(body.accessToken, messageId);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to mark message ${messageId} as unread:`, error);
      throw error;
    }
  }
}