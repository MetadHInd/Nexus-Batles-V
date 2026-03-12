// src/shared/core/messaging/push/services/push.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PushMessage } from '../interfaces/push-message.interface';
import { PushResult } from '../interfaces/push-result.interface';
import { IPushSender } from '../interfaces/push-sender.interface';
import { CircuitBreakerHandler } from '../../../../utils/circuit-breaker.handler';

@Injectable()
export class PushService implements IPushSender {
  private readonly logger = new Logger(PushService.name);
  private readonly circuitBreaker = new CircuitBreakerHandler();

  constructor(private readonly httpService: HttpService) {}

  async send(message: PushMessage): Promise<PushResult> {
    const sendFunction = async () => {
      try {
        // Obtener configuración desde variables de entorno
        const appId = process.env.ONESIGNAL_APP_ID;
        const apiKey = process.env.ONESIGNAL_API_KEY;
        const provider = process.env.PUSH_PROVIDER || 'onesignal';

        if (!appId || !apiKey) {
          throw new Error('Push notification credentials missing');
        }

        let response;

        // Implementar diferentes proveedores de Push
        switch (provider.toLowerCase()) {
          case 'onesignal':
            response = await this.sendOneSignalPush(appId, apiKey, message);
            break;
          case 'firebase':
            response = await this.sendFirebasePush(apiKey, message);
            break;
          default:
            throw new Error(`Unsupported push provider: ${provider}`);
        }

        return {
          success: true,
          error: null,
          id: response.id || response.messageId || 'unknown',
          recipients: response.recipients || 1,
          details: response,
        };
      } catch (error) {
        this.logger.error(
          `Push notification error: ${error.message}`,
          error.stack,
        );
        return {
          success: false,
          error: error.message,
          code: error.code || 'unknown',
          id: null,
        };
      }
    };

    // Usar circuit breaker para manejar fallos
    const breaker = this.circuitBreaker.createBreaker(sendFunction);
    return (await breaker.fire()) as PushResult;
  }

  async sendBulk(messages: PushMessage[]): Promise<PushResult[]> {
    const results: PushResult[] = [];

    for (const message of messages) {
      results.push(await this.send(message));
    }

    return results;
  }

  // Implementación específica para OneSignal
  private async sendOneSignalPush(
    appId: string,
    apiKey: string,
    message: PushMessage,
  ): Promise<any> {
    const url = 'https://onesignal.com/api/v1/notifications';

    // Asegurarse de que los IDs de jugador están en formato de array
    const playerIds = Array.isArray(message.recipient.value)
      ? message.recipient.value
      : [message.recipient.value];

    // Construir payload de la manera exacta que funciona en el ejemplo
    const payload = {
      app_id: appId,
      name: message.content.title, // Usar título como nombre
      include_player_ids: playerIds,
      headings: {
        en: message.content.title,
      },
      contents: {
        en: message.content.body,
      },
      // Datos adicionales, si existen
      ...(message.content.data && {
        data: message.content.data,
      }),
      // URL para abrir al hacer clic
      ...(message.content.url && {
        url: message.content.url,
      }),
      // Botones, si existen
      ...(message.content.buttons && {
        buttons: message.content.buttons,
      }),
    };

    // IMPORTANTE: El formato exacto de autorización
    const headers = {
      Authorization: `Basic ${apiKey}`,
      'Content-Type': 'application/json',
    };

    this.logger.debug(
      `Sending OneSignal push notification with payload: ${JSON.stringify(payload)}`,
    );

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload, { headers }),
      );

      this.logger.log(
        `OneSignal push notification sent successfully: ${JSON.stringify(response.data)}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `OneSignal error details: ${JSON.stringify(error.response?.data || 'No details')}`,
      );
      throw error;
    }
  }

  // Implementación para Firebase Cloud Messaging
  private async sendFirebasePush(
    apiKey: string,
    message: PushMessage,
  ): Promise<any> {
    const url = 'https://fcm.googleapis.com/fcm/send';

    // Preparar destinatarios
    let to: string | undefined;
    let registration_ids: string[] | undefined;

    if (message.recipient.type === 'player_id') {
      if (Array.isArray(message.recipient.value)) {
        registration_ids = message.recipient.value;
      } else {
        to = message.recipient.value;
      }
    } else if (message.recipient.type === 'topic') {
      to = `/topics/${message.recipient.value}`;
    }

    const payload = {
      ...(to && { to }),
      ...(registration_ids && { registration_ids }),
      notification: {
        title: message.content.title,
        body: message.content.body,
        image: message.content.imageUrl,
        click_action: message.content.url,
      },
      data: message.content.data || {},
      ...(message.priority && { priority: message.priority }),
    };

    const headers = {
      Authorization: `key=${apiKey}`,
      'Content-Type': 'application/json',
    };

    this.logger.debug(
      `Sending Firebase push notification with payload: ${JSON.stringify(payload)}`,
    );

    const response = await firstValueFrom(
      this.httpService.post(url, payload, { headers }),
    );

    return {
      id: response.data.multicast_id || 'unknown',
      messageId: response.data.message_id,
      recipients: response.data.success || 0,
      ...response.data,
    };
  }
}
