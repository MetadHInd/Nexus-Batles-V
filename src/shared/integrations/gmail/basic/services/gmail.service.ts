// gmail.service.ts
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  GmailCredentials,
  GmailMessage,
  GmailSearchOptions,
  GmailSearchResult,
  GmailLabel,
  ParsedEmailContent,
  EmailAttachment,
  GmailAttachment,
  GmailThread
} from '../interfaces';

@Injectable()
export class GmailService {
  private readonly logger = new Logger(GmailService.name);
  private readonly GMAIL_API_BASE_URL = 'https://gmail.googleapis.com/gmail/v1';
  private readonly OAUTH_URL = 'https://oauth2.googleapis.com/token';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Get OAuth authorization URL
   */
  getAuthUrl(credentials: GmailCredentials, scopes: string[] = ['https://www.googleapis.com/auth/gmail.readonly']): string {
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

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(
    credentials: GmailCredentials,
    authorizationCode: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const tokenData = {
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        code: authorizationCode,
        grant_type: 'authorization_code',
        redirect_uri: credentials.redirectUri
      };

      const response = await firstValueFrom(
        this.httpService.post(this.OAUTH_URL, tokenData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token
      };
    } catch (error) {
      this.logger.error('Failed to exchange code for tokens:', error);
      throw new HttpException(
        'Failed to authenticate with Gmail',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(credentials: GmailCredentials): Promise<string> {
    try {
      const tokenData = {
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        refresh_token: credentials.refreshToken,
        grant_type: 'refresh_token'
      };

      const response = await firstValueFrom(
        this.httpService.post(this.OAUTH_URL, tokenData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
      );

      return response.data.access_token;
    } catch (error) {
      this.logger.error('Failed to refresh access token:', error);
      throw new HttpException(
        'Failed to refresh Gmail authentication',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  /**
   * Get user's Gmail profile
   */
  async getProfile(accessToken: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.GMAIL_API_BASE_URL}/users/me/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      );

      return response.data;
    } catch (error) {
      this.logger.error('Failed to get Gmail profile:', error);
      throw new HttpException(
        'Failed to get Gmail profile',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Search for messages
   */
  async searchMessages(
    accessToken: string,
    options: GmailSearchOptions = {}
  ): Promise<GmailSearchResult> {
    try {
      const params = new URLSearchParams();
      
      if (options.query) params.append('q', options.query);
      if (options.maxResults) params.append('maxResults', options.maxResults.toString());
      if (options.pageToken) params.append('pageToken', options.pageToken);
      if (options.includeSpamTrash) params.append('includeSpamTrash', 'true');
      if (options.labelIds?.length) {
        options.labelIds.forEach(labelId => params.append('labelIds', labelId));
      }

      const response = await firstValueFrom(
        this.httpService.get(`${this.GMAIL_API_BASE_URL}/users/me/messages?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      );

      // Get detailed message data for each message
      const messages = await Promise.all(
        (response.data.messages || []).map((msg: any) =>
          this.getMessage(accessToken, msg.id)
        )
      );

      return {
        messages,
        nextPageToken: response.data.nextPageToken,
        resultSizeEstimate: response.data.resultSizeEstimate || 0
      };
    } catch (error) {
      this.logger.error('Failed to search messages:', error);
      throw new HttpException(
        'Failed to search Gmail messages',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Get a specific message by ID
   */
  async getMessage(
    accessToken: string,
    messageId: string,
    format: 'full' | 'metadata' | 'minimal' | 'raw' = 'full'
  ): Promise<GmailMessage> {
    try {
      const params = new URLSearchParams();
      params.append('format', format);

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.GMAIL_API_BASE_URL}/users/me/messages/${messageId}?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        )
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get message ${messageId}:`, error);
      throw new HttpException(
        'Failed to get Gmail message',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Get message attachment
   */
  async getAttachment(
    accessToken: string,
    messageId: string,
    attachmentId: string
  ): Promise<GmailAttachment> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.GMAIL_API_BASE_URL}/users/me/messages/${messageId}/attachments/${attachmentId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        )
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get attachment ${attachmentId}:`, error);
      throw new HttpException(
        'Failed to get Gmail attachment',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Get all labels
   */
  async getLabels(accessToken: string): Promise<GmailLabel[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.GMAIL_API_BASE_URL}/users/me/labels`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      );

      return response.data.labels || [];
    } catch (error) {
      this.logger.error('Failed to get labels:', error);
      throw new HttpException(
        'Failed to get Gmail labels',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Get thread by ID
   */
  async getThread(accessToken: string, threadId: string): Promise<GmailThread> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.GMAIL_API_BASE_URL}/users/me/threads/${threadId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        )
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get thread ${threadId}:`, error);
      throw new HttpException(
        'Failed to get Gmail thread',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Parse email content from Gmail message
   */
  parseEmailContent(message: GmailMessage): ParsedEmailContent {
    const headers = message.payload.headers;
    const getHeader = (name: string) => 
      headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

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

  /**
   * Extract content and attachments from message payload
   */
  private extractContent(payload: any): {
    textContent?: string;
    htmlContent?: string;
    attachments: EmailAttachment[];
  } {
    let textContent: string | undefined;
    let htmlContent: string | undefined;
    const attachments: EmailAttachment[] = [];

    const processPayload = (part: any) => {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        textContent = this.decodeBase64Url(part.body.data);
      } else if (part.mimeType === 'text/html' && part.body?.data) {
        htmlContent = this.decodeBase64Url(part.body.data);
      } else if (part.filename && part.body?.attachmentId) {
        attachments.push({
          filename: part.filename,
          mimeType: part.mimeType,
          size: part.body.size,
          attachmentId: part.body.attachmentId
        });
      }

      // Process nested parts
      if (part.parts) {
        part.parts.forEach(processPayload);
      }
    };

    processPayload(payload);

    return { textContent, htmlContent, attachments };
  }

  /**
   * Decode base64url encoded data
   */
  private decodeBase64Url(data: string): string {
    try {
      // Convert base64url to base64
      const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if necessary
      const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
      return Buffer.from(padded, 'base64').toString('utf-8');
    } catch (error) {
      this.logger.warn('Failed to decode base64url data:', error);
      return '';
    }
  }

  /**
   * Get unread messages count
   */
  async getUnreadCount(accessToken: string): Promise<number> {
    try {
      const result = await this.searchMessages(accessToken, {
        query: 'is:unread',
        maxResults: 1
      });
      return result.resultSizeEstimate;
    } catch (error) {
      this.logger.error('Failed to get unread count:', error);
      return 0;
    }
  }

  /**
   * Mark message as read
   */
  async markAsRead(accessToken: string, messageId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.GMAIL_API_BASE_URL}/users/me/messages/${messageId}/modify`,
          {
            removeLabelIds: ['UNREAD']
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        )
      );
    } catch (error) {
      this.logger.error(`Failed to mark message ${messageId} as read:`, error);
      throw new HttpException(
        'Failed to mark message as read',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Mark message as unread
   */
  async markAsUnread(accessToken: string, messageId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.GMAIL_API_BASE_URL}/users/me/messages/${messageId}/modify`,
          {
            addLabelIds: ['UNREAD']
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        )
      );
    } catch (error) {
      this.logger.error(`Failed to mark message ${messageId} as unread:`, error);
      throw new HttpException(
        'Failed to mark message as unread',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}