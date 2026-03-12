// src/shared/core/messaging/email/services/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailSMTPConfig } from '../interfaces/email-config.interface';
import { EmailMessage } from '../interfaces/email-message.interface';
import { EmailResult } from '../interfaces/email-result.interface';
import { IEmailSender } from '../interfaces/email-sender.interface';
import { CircuitBreakerHandler } from '../../../../utils/circuit-breaker.handler';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class EmailService implements IEmailSender {
  private readonly logger = new Logger(EmailService.name);
  private readonly circuitBreaker = new CircuitBreakerHandler();

  constructor(private readonly templateService: EmailTemplateService) {}

  async send(email: EmailMessage): Promise<EmailResult> {
    try {
      const smtp = {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        service: process.env.SMTP_SERVICE,
      };

      this.logger.debug(
        `Sending email to ${Array.isArray(email.to) ? email.to.join(', ') : email.to}`,
      );

      const transporter = nodemailer.createTransport({
        service: smtp.service,
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: {
          user: smtp.user,
          pass: smtp.pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const mailOptions = {
        from: email.from || `"GALATEA Notifications" <${smtp.user}>`,
        to: email.to,
        subject: email.subject,
        text: email.text || '',
        html: email.html,
        attachments: email.attachments || [],
      };

      const info = await transporter.sendMail(mailOptions);

      this.logger.debug(`Email sent successfully: ${info.messageId}`);

      return {
        success: true,
        error: null,
        info,
      };
    } catch (error: unknown) {
      this.logger.error(
        `Email error: ${error instanceof Error ? error.message : String(error)}`,
      );

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : 'Unknown error',
        info: null,
      };
    }
  }

  async sendBulk(
    config: EmailSMTPConfig,
    emails: EmailMessage[],
  ): Promise<EmailResult[]> {
    const results: EmailResult[] = [];

    for (const email of emails) {
      results.push(await this.send(email));
    }

    return results;
  }

  /**
   * Envía un email usando una plantilla HTML
   * @param templateName Nombre de la plantilla (sin extensión .html)
   * @param data Datos para reemplazar en la plantilla
   * @param to Destinatarios del email (string o array de strings)
   * @param subject Asunto del email
   * @param from Email del remitente (opcional)
   * @returns Resultado del envío
   */
  async sendWithTemplate(
    templateName: string,
    data: Record<string, any>,
    to: string | string[],
    subject: string,
    from?: string,
  ): Promise<EmailResult> {
    try {
      this.logger.debug(`Sending email with template: ${templateName}`);
      
      // Generar HTML desde la plantilla
      const html = await this.generateTemplate(templateName, data);
      
      // Crear el mensaje de email
      const message: EmailMessage = {
        to,
        subject,
        html,
        from,
      };

      // Enviar el email
      return await this.send(message);
    } catch (error) {
      this.logger.error(
        `Error sending email with template '${templateName}': ${error.message}`,
        error.stack,
      );

      return {
        success: false,
        error: error.message || 'Unknown error sending email with template',
        info: null,
      };
    }
  }

  /**
   * Genera HTML desde una plantilla
   * @param templateName Nombre de la plantilla (sin extensión .html)
   * @param data Datos para reemplazar en la plantilla
   * @returns HTML generado
   */
  async generateTemplate(
    templateName: string,
    data: Record<string, any>,
  ): Promise<string> {
    try {
      this.logger.debug(`Generating template: ${templateName}`);
      return await this.templateService.render(templateName, data);
    } catch (error) {
      this.logger.error(
        `Error generating template '${templateName}': ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
