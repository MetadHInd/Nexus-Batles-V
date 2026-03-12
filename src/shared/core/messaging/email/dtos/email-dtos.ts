// src/shared/core/messaging/email/dtos/email-dtos.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SendEmailDto {
  @ApiProperty({
    description: 'Destinatario(s) del correo',
    example:
      'destinatario@ejemplo.com o ["destinatario1@ejemplo.com", "destinatario2@ejemplo.com"]',
  })
  @Transform(({ value }) => {
    // Convertir string a array si es un solo email
    return typeof value === 'string' ? [value] : value;
  })
  @IsEmail({}, { each: true })
  to: string | string[];

  @ApiProperty({
    description: 'Asunto del correo',
    example: 'Bienvenido a nuestra plataforma',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Contenido HTML del correo',
    example: '<h1>Bienvenido</h1><p>Gracias por registrarte</p>',
  })
  @IsString()
  @IsNotEmpty()
  html: string;

  @ApiPropertyOptional({
    description:
      'Contenido de texto plano (alternativa para clientes sin HTML)',
    example: 'Bienvenido. Gracias por registrarte.',
  })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiPropertyOptional({
    description: 'Archivos adjuntos',
    example: [{ filename: 'manual.pdf', content: 'Base64...' }],
  })
  @IsOptional()
  attachments?: any[];
}

export class SendBulkEmailDto {
  @ApiProperty({
    description: 'Lista de correos a enviar',
    type: [SendEmailDto],
  })
  @IsArray()
  @IsNotEmpty()
  messages: SendEmailDto[];
}

export class SendTemplateEmailDto {
  @ApiProperty({
    description: 'Destinatario(s) del correo',
    example:
      'destinatario@ejemplo.com o ["destinatario1@ejemplo.com", "destinatario2@ejemplo.com"]',
  })
  @Transform(({ value }) => {
    return typeof value === 'string' ? [value] : value;
  })
  @IsEmail({}, { each: true })
  to: string | string[];

  @ApiProperty({
    description: 'Asunto del correo',
    example: 'Bienvenido a nuestra plataforma',
  })
  @IsString()
  @IsNotEmpty() // Cambiado a obligatorio nuevamente
  subject: string;

  @ApiProperty({
    description: 'Nombre de la plantilla HTML a usar',
    example: 'welcome',
  })
  @IsString()
  @IsNotEmpty() // Cambiado a obligatorio nuevamente
  templateName: string;

  @ApiProperty({
    description: 'Datos para reemplazar las variables en la plantilla',
    example: {
      userName: 'Juan Pérez',
      actionUrl: 'https://ejemplo.com/activar',
    },
  })
  @IsObject()
  @IsNotEmpty()
  templateData: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Archivos adjuntos',
    example: [{ filename: 'manual.pdf', content: 'Base64...' }],
  })
  @IsOptional()
  attachments?: any[];
}
