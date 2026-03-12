// src/shared/core/messaging/push/controllers/push.controller.ts
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { PushService } from '../services/push.service';
import { PushMessage } from '../interfaces/push-message.interface';
import { PushResult } from '../interfaces/push-result.interface';
import { RoleGuard } from 'src/shared/core/auth/guards/role.guard';
import { Role } from 'src/shared/core/auth/constants/roles.enum';
import { Roles } from 'src/shared/core/auth/decorators/roles.decorator';
import { SendPushDto, SendBulkPushDto } from '../dtos/push-dtos';

@ApiTags('08 - Push Notifications')
@Controller('api/messaging/push')
@UseGuards(RoleGuard)
@ApiBearerAuth()
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('send')
  @ApiOperation({ summary: 'Enviar una notificación push' })
  @ApiBody({ type: SendPushDto })
  @ApiResponse({
    status: 200,
    description: 'Notificación push enviada correctamente',
  })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async send(@Body() dto: SendPushDto): Promise<PushResult> {
    try {
      // Convertir la fecha de programación si existe
      const message: PushMessage = {
        ...dto,
        scheduleFor: dto.scheduleFor ? new Date(dto.scheduleFor) : undefined,
      };

      // Validar que tenemos el valor del destinatario si es de tipo player_id
      if (message.recipient.type === 'player_id' && !message.recipient.value) {
        throw new Error(
          'Se requiere un ID de jugador para notificaciones de tipo player_id',
        );
      }

      return await this.pushService.send(message);
    } catch (error) {
      console.error('Error en el controlador de push:', error);
      throw error;
    }
  }

  @Post('send-bulk')
  @ApiOperation({ summary: 'Enviar múltiples notificaciones push' })
  @ApiBody({ type: SendBulkPushDto })
  @ApiResponse({
    status: 200,
    description: 'Notificaciones push enviadas correctamente',
  })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async sendBulk(@Body() dto: SendBulkPushDto): Promise<PushResult[]> {
    // Convertir las fechas de programación si existen
    const messages: PushMessage[] = dto.messages.map((msg) => ({
      ...msg,
      scheduleFor: msg.scheduleFor ? new Date(msg.scheduleFor) : undefined,
    }));

    return await this.pushService.sendBulk(messages);
  }
}
