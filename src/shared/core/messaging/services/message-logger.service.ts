// src/shared/core/messaging/services/message-logger.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ServiceCache } from '../../services/service-cache/service-cache';

/**
 * Información del mensaje para registro
 */
export interface MessageLogEntry {
  // Información general
  messageId: string;
  channel: 'email' | 'push' | 'sms';
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  timestamp: Date;

  // Información específica del mensaje
  recipient: string | string[];
  subject?: string;
  provider?: string;

  // Detalles del resultado
  success: boolean;
  error?: string;
  providerMessageId?: string;
  retryCount?: number;

  // Metadatos adicionales
  userId?: string;
  tenantId?: string;
  templateName?: string;
  metadata?: Record<string, any>;
}

/**
 * Servicio para registrar mensajes enviados
 */
@Injectable()
export class MessageLoggerService {
  private readonly logger = new Logger(MessageLoggerService.name);

  /**
   * Registra un mensaje enviado
   * @param entry Información del mensaje para registrar
   */
  async logMessage(entry: MessageLogEntry): Promise<void> {
    try {

      // Registrar en consola siempre
      this.logToConsole(entry);
    } catch (error) {
      this.logger.error(`Error logging message: ${error.message}`, error.stack);
    }
  }

  /**
   * Registra el mensaje en la consola
   * @param entry Información del mensaje
   */
  private logToConsole(entry: MessageLogEntry): void {
    const recipients = Array.isArray(entry.recipient)
      ? entry.recipient.join(', ')
      : entry.recipient;

    const message = `[${entry.channel.toUpperCase()}] ${
      entry.success ? '✅' : '❌'
    } ${entry.subject || 'Message'} to ${recipients} - ${entry.status}`;

    if (entry.success) {
      this.logger.log(message);
    } else {
      this.logger.error(`${message}: ${entry.error}`);
    }
  }
}
