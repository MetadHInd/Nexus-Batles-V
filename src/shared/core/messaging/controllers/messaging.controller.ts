// src/shared/core/messaging/controllers/messaging.controller.ts
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { RoleGuard } from 'src/shared/core/auth/guards/role.guard';
import { Role } from 'src/shared/core/auth/constants/roles.enum';
import { Roles } from 'src/shared/core/auth/decorators/roles.decorator';
import {
  MessagingProviderFactory,
  MessagingProvider,
} from '../utils/messaging-provider.factory';
import { SendMessageDto } from '../dtos/messaging-dtos';

@ApiTags('08 - Messaging - General')
@Controller('api/messaging')
@UseGuards(RoleGuard)
@ApiBearerAuth()
export class MessagingController {
  constructor(private readonly messagingFactory: MessagingProviderFactory) {}

  @Post('send')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Enviar un mensaje por cualquier canal' })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({ status: 200, description: 'Mensaje enviado correctamente' })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async send(@Body() dto: SendMessageDto): Promise<any> {
    // Determinar el tipo de proveedor
    let providerType: MessagingProvider;
    switch (dto.channel) {
      case 'email':
        providerType = MessagingProvider.EMAIL;
        break;
      case 'push':
        providerType = MessagingProvider.PUSH;
        break;
      case 'sms':
        providerType = MessagingProvider.SMS;
        break;
      default:
        throw new Error(`Canal no soportado: ${dto.channel}`);
    }

    // Obtener el servicio correspondiente
    const service = this.messagingFactory.getProvider(providerType);

    // Preparar el mensaje según el tipo de canal
    let message: any;

    switch (providerType) {
      case MessagingProvider.EMAIL:
        message = {
          to: dto.recipient,
          subject: dto.content.subject,
          html: dto.content.html,
          text: dto.content.text,
          attachments: dto.content.attachments,
        };
        break;

      case MessagingProvider.PUSH:
        message = {
          recipient: {
            type: dto.recipient.type || 'player_id',
            value: dto.recipient.value,
          },
          content: {
            title: dto.content.title,
            body: dto.content.body,
            imageUrl: dto.content.imageUrl,
            url: dto.content.url,
            data: dto.content.data,
            buttons: dto.content.buttons,
          },
          scheduleFor: dto.options?.scheduleFor
            ? new Date(dto.options.scheduleFor)
            : undefined,
          ttl: dto.options?.ttl,
          priority: dto.options?.priority,
          silent: dto.options?.silent,
          collapseId: dto.options?.collapseId,
          channelId: dto.options?.channelId,
        };
        break;

      case MessagingProvider.SMS:
        message = {
          to: dto.recipient,
          text: dto.content.text,
          from: dto.options?.from,
          name: dto.content.name,
          mediaUrls: dto.content.mediaUrls,
          includedSegments: dto.content.includedSegments,
          scheduleFor: dto.options?.scheduleFor
            ? new Date(dto.options.scheduleFor)
            : undefined,
          validityPeriod: dto.options?.validityPeriod,
          reference: dto.options?.reference,
        };
        break;
    }

    // Enviar el mensaje
    return await service.send(message);
  }
}
