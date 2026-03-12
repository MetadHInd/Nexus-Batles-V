// src/shared/core/messaging/dtos/base-messaging.dto.ts
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO base para todas las peticiones de mensajería
 */
export class BaseMessagingDto {
  @ApiProperty({
    description: 'Identificador único para seguimiento del mensaje (opcional)',
    example: 'msg-12345',
  })
  @IsString()
  @IsOptional()
  messageId?: string;

  @ApiProperty({
    description: 'Identificador del tenant/cliente (permite multitenancy)',
    example: 'tenant-001',
  })
  @IsString()
  @IsOptional()
  tenantId?: string;

  @ApiPropertyOptional({
    description: 'Metadatos adicionales para propósitos de tracking',
    example: { campaign: 'welcome', source: 'web' },
  })
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO para opciones de configuración común
 */
export class MessagingConfigDto {
  @ApiPropertyOptional({
    description:
      'Si es true, se guarda un registro del envío en la base de datos',
    default: true,
  })
  @IsOptional()
  logDelivery?: boolean;

  @ApiPropertyOptional({
    description: 'Si es true, se reintenta el envío en caso de error',
    default: true,
  })
  @IsOptional()
  retryOnFailure?: boolean;

  @ApiPropertyOptional({
    description: 'Número máximo de reintentos',
    default: 3,
  })
  @IsOptional()
  maxRetries?: number;

  @ApiPropertyOptional({
    description: 'Tiempo a esperar para el reintento (en segundos)',
    default: 60,
  })
  @IsOptional()
  retryDelay?: number;
}

/**
 * DTO para peticiones de mensajería con configuración
 */
export class ConfigurableMessagingDto extends BaseMessagingDto {
  @ApiPropertyOptional({
    description: 'Configuración adicional del mensaje',
    type: () => MessagingConfigDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MessagingConfigDto)
  config?: MessagingConfigDto;
}
