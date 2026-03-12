// src/modules/auth/services/shared/signature.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { HttpClientBase } from 'src/shared/core/http/http-client.base';

interface AuthSignResponse {
  originName: string;
  signSecret: string;
  checkSumSecret?: string; // Opcional porque puede ser undefined
  expiresAt?: string; // Opcional porque puede ser undefined
}

@Injectable()
export class SignatureService extends HttpClientBase {
  private readonly logger = new Logger(SignatureService.name);

  constructor() {
    // Usamos la base URL correcta (sin incluir la parte final de la ruta)
    super(process.env.AUTH_URL || 'https://dev.auth.voyagr.site');
  }

  async getAuthorizedSign(
    token: string,
    uuid: string,
  ): Promise<{ success: boolean; payload: AuthSignResponse; message: string }> {
    try {
      // Pattern: return the result of this.post directly, as in auth.service.ts
      const headers = {
        accept: 'application/json',
        'x-auth-token': token,
        'x-auth-uuid': uuid,
      };

      this.logger.debug('Making request to get authorized sign...');
      const result = await this.post<{
        success: boolean;
        payload: AuthSignResponse;
        message: string;
      }>('/authorized-origins/get-sign', {}, headers);

      this.logger.debug('Result from post method:', JSON.stringify(result));
      return result;
    } catch (error) {
      this.logger.error('Error in getAuthorizedSign:', error);
      throw error;
    }
  }
}
