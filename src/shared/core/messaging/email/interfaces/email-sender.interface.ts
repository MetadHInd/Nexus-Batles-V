import { EmailSMTPConfig } from './email-config.interface';
import { EmailMessage } from './email-message.interface';
import { EmailResult } from './email-result.interface';

export interface IEmailSender {
  /**
   * Envía un email con la configuración y mensaje proporcionados
   * @param message Mensaje a enviar
   * @returns Resultado del envío
   */
  send(message: EmailMessage): Promise<EmailResult>;

  /**
   * Envía múltiples emails con la misma configuración SMTP
   * @param config Configuración SMTP para el envío
   * @param messages Lista de mensajes a enviar
   * @returns Resultados de los envíos
   */
  sendBulk(
    config: EmailSMTPConfig,
    messages: EmailMessage[],
  ): Promise<EmailResult[]>;
}
