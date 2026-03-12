// src/shared/core/messaging/push/dtos/push-dtos.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PushButtonDto {
  @ApiProperty({
    description: 'ID único del botón',
    example: 'btn_1',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Texto a mostrar en el botón',
    example: 'Ver detalles',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiPropertyOptional({
    description: 'URL a la que dirige el botón',
    example: 'https://ejemplo.com/detalles',
  })
  @IsString()
  @IsOptional()
  url?: string;
}

export class PushRecipientDto {
  @ApiProperty({
    description: 'Tipo de destinatario',
    enum: ['player_id', 'segment', 'all', 'topic'],
    example: 'player_id',
  })
  @IsEnum(['player_id', 'segment', 'all', 'topic'])
  type: 'player_id' | 'segment' | 'all' | 'topic';

  @ApiPropertyOptional({
    description: 'ID o IDs de destinatarios (depende del tipo)',
    example: 'e4e87830-b954-11e3-811d-f3b376925f15',
  })
  @IsOptional()
  value?: string | string[];
}

export class PushContentDto {
  @ApiProperty({
    description: 'Título de la notificación',
    example: 'Nueva actualización disponible',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Cuerpo del mensaje',
    example: 'Hemos lanzado nuevas funcionalidades. ¡Actualiza ahora!',
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional({
    description: 'URL de imagen para mostrar en la notificación',
    example: 'https://ejemplo.com/imagen.jpg',
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'URL para abrir al hacer clic en la notificación',
    example: 'https://ejemplo.com/nueva-version',
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({
    description: 'Datos adicionales para enviar con la notificación',
    example: { action: 'update', version: '2.0' },
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Botones de acción para la notificación',
    type: [PushButtonDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PushButtonDto)
  buttons?: PushButtonDto[];
}

export class SendPushDto {
  @ApiProperty({
    description: 'Información del destinatario',
    type: PushRecipientDto,
  })
  @ValidateNested()
  @Type(() => PushRecipientDto)
  recipient: PushRecipientDto;

  @ApiProperty({
    description: 'Contenido de la notificación',
    type: PushContentDto,
  })
  @ValidateNested()
  @Type(() => PushContentDto)
  content: PushContentDto;

  @ApiPropertyOptional({
    description: 'Fecha para programar el envío (formato ISO)',
    example: '2025-05-01T12:00:00Z',
  })
  @IsString()
  @IsOptional()
  scheduleFor?: string;

  @ApiPropertyOptional({
    description: 'Tiempo de vida en segundos',
    example: 86400,
  })
  @IsNumber()
  @IsOptional()
  ttl?: number;

  @ApiPropertyOptional({
    description: 'Prioridad de la notificación',
    enum: ['high', 'normal'],
    example: 'high',
  })
  @IsEnum(['high', 'normal'])
  @IsOptional()
  priority?: 'high' | 'normal';

  @ApiPropertyOptional({
    description: 'Si es true, no muestra la notificación visualmente',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  silent?: boolean;

  @ApiPropertyOptional({
    description: 'ID de colapso para agrupar notificaciones',
    example: 'update-notification',
  })
  @IsString()
  @IsOptional()
  collapseId?: string;

  @ApiPropertyOptional({
    description: 'ID del canal para Android',
    example: 'updates_channel',
  })
  @IsString()
  @IsOptional()
  channelId?: string;
}

export class SendBulkPushDto {
  @ApiProperty({
    description: 'Lista de notificaciones a enviar',
    type: [SendPushDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SendPushDto)
  messages: SendPushDto[];
}
