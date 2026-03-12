// src/shared/core/messaging/email/controllers/email.controller.ts
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { EmailService } from '../services/email.service';
import { EmailTemplateService } from '../services/email-template.service';
import { EmailMessage } from '../interfaces/email-message.interface';
import { EmailResult } from '../interfaces/email-result.interface';
import { RoleGuard } from 'src/shared/core/auth/guards/role.guard';
import { Role } from 'src/shared/core/auth/constants/roles.enum';
import { Roles } from 'src/shared/core/auth/decorators/roles.decorator';
import {
  SendEmailDto,
  SendBulkEmailDto,
  SendTemplateEmailDto,
} from '../dtos/email-dtos';

@ApiTags('05 - Email')
@Controller('api/messaging/email')
@UseGuards(RoleGuard)
@ApiBearerAuth()
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly templateService: EmailTemplateService,
  ) {}

  @Post('send')
  @ApiOperation({ summary: 'Enviar un email' })
  @ApiBody({ type: SendEmailDto })
  @ApiResponse({ status: 200, description: 'Email enviado correctamente' })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async send(@Body() dto: SendEmailDto): Promise<EmailResult> {
    const message: EmailMessage = dto;

    return await this.emailService.send(message);
  }

  @Post('send-bulk')
  @ApiOperation({ summary: 'Enviar múltiples emails' })
  @ApiBody({ type: SendBulkEmailDto })
  @ApiResponse({ status: 200, description: 'Emails enviados correctamente' })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async sendBulk(@Body() dto: SendBulkEmailDto): Promise<EmailResult[]> {
    const results: EmailResult[] = [];

    for (const message of dto.messages) {
      results.push(await this.emailService.send(message));
    }

    return results;
  }

  @Post('send-template')
  @ApiOperation({ summary: 'Enviar un email usando una plantilla' })
  @ApiBody({ type: SendTemplateEmailDto })
  @ApiResponse({
    status: 200,
    description: 'Email con plantilla enviado correctamente',
  })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async sendTemplate(@Body() dto: SendTemplateEmailDto): Promise<EmailResult> {
    // Renderizar la plantilla
    const html = await this.templateService.render(
      dto.templateName,
      dto.templateData,
    );

    // Crear mensaje con la plantilla renderizada
    const message: EmailMessage = {
      to: dto.to,
      subject: dto.subject,
      html,
      attachments: dto.attachments,
    };

    return await this.emailService.send(message);
  }
}
