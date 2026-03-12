// src/shared/core/messaging/dtos/messaging-dtos.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: 'Canal de envío del mensaje',
    enum: ['email', 'push', 'sms'],
    example: 'email',
  })
  @IsEnum(['email', 'push', 'sms'])
  channel: 'email' | 'push' | 'sms';

  @ApiPropertyOptional({
    description: 'Nombre del proveedor específico a utilizar',
    example: 'onesignal, twilio, smtp',
  })
  @IsString()
  @IsOptional()
  providerName?: string;

  @ApiProperty({
    description:
      'Destinatario(s) del mensaje. Para email/sms puede ser un string o array, para push debe seguir el formato específico',
    example: 'recipient@example.com o {type: "player_id", value: "xxxx"}',
  })
  @IsNotEmpty()
  recipient: any;

  @ApiProperty({
    description: 'Contenido del mensaje (varía según el canal)',
    example: {
      subject: 'Asunto (para email)',
      html: '<p>Contenido HTML</p> (para email)',
      title: 'Título de notificación (para push)',
      body: 'Cuerpo del mensaje (para push/sms)',
      text: 'Texto del SMS (para sms)',
    },
  })
  @IsObject()
  content: any;

  @ApiPropertyOptional({
    description: 'Opciones adicionales según el canal',
    example: {
      scheduleFor: '2025-05-01T12:00:00Z',
      ttl: 86400,
      priority: 'high',
      silent: false,
      from: '+12025550142',
      attachments: [{ filename: 'doc.pdf', content: 'base64data' }],
    },
  })
  @IsObject()
  @IsOptional()
  options?: Record<string, any>;
}
