import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FirestoreMessagingService } from '../firestore-messaging.service';
import { MessageQueryFilters, MessageChannel } from '../interfaces/firestore-message.interface';

@ApiTags('Messaging History')
@Controller('messaging-history')
export class MessagingHistoryController {
  constructor(
    private readonly firestoreMessaging: FirestoreMessagingService,
  ) {}

  @Get('conversation/:conversationId/messages')
  @ApiOperation({ summary: 'Obtener mensajes de una conversación' })
  async getConversationMessages(
    @Param('conversationId') conversationId: string,
    @Query('limit') limit?: number,
  ) {
    const messages = await this.firestoreMessaging.getConversationMessages(
      conversationId,
      limit ? parseInt(limit.toString()) : 100,
    );

    return {
      success: true,
      conversationId,
      count: messages.length,
      messages,
    };
  }

  @Get('conversation/:conversationId')
  @ApiOperation({ summary: 'Obtener información de conversación' })
  async getConversation(@Param('conversationId') conversationId: string) {
    const conversation = await this.firestoreMessaging.getConversation(conversationId);

    return {
      success: !!conversation,
      conversation,
    };
  }

  @Get('conversations/active')
  @ApiOperation({ summary: 'Listar conversaciones activas' })
  async listActiveConversations(@Query('limit') limit?: number) {
    const conversations = await this.firestoreMessaging.listActiveConversations(
      limit ? parseInt(limit.toString()) : 50,
    );

    return {
      success: true,
      count: conversations.length,
      conversations,
    };
  }

  @Post('messages/search')
  @ApiOperation({ summary: 'Buscar mensajes con filtros' })
  async searchMessages(@Body() filters: MessageQueryFilters) {
    const messages = await this.firestoreMessaging.searchMessages(filters);

    return {
      success: true,
      count: messages.length,
      messages,
      filters,
    };
  }

  @Post('conversation/:conversationId/mark-read')
  @ApiOperation({ summary: 'Marcar mensajes como leídos' })
  async markAsRead(@Param('conversationId') conversationId: string) {
    const count = await this.firestoreMessaging.markMessagesAsRead(conversationId);

    return {
      success: true,
      conversationId,
      markedCount: count,
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de mensajería' })
  async getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('channel') channel?: MessageChannel,
  ) {
    const stats = await this.firestoreMessaging.getMessagingStats({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      channel,
    });

    return {
      success: true,
      stats,
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check del sistema de mensajería' })
  health() {
    return {
      status: 'ok',
      service: 'Messaging History',
      storage: 'Firestore',
      timestamp: new Date().toISOString(),
    };
  }
}
