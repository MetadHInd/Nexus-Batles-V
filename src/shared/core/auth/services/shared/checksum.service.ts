// src/modules/auth/services/shared/checksum.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { JwtSecretProvider } from './jwt-secret.provider';

interface AuthSignData {
  originName: string;
  signSecret: string;
  checkSumSecret?: string; // Opcional para coincidir con AuthSignResponse
  expiresAt?: string; // Opcional para coincidir con AuthSignResponse
}

@Injectable()
export class ChecksumService implements OnModuleInit {
  private readonly logger = new Logger(ChecksumService.name);
  private authData: AuthSignData | null = null;
  private maxRetries = 3;

  constructor(
    private readonly signatureService: SignatureService,
    private readonly jwtSecretProvider: JwtSecretProvider,
  ) {}

  async onModuleInit() {
    try {
      // Inicializar el checksum_secret al arrancar la aplicación
      await this.initializeAuthData();
    } catch (error) {
      this.logger.error(
        'Error initializing auth data, will continue without it:',
        error,
      );
      // El servicio continuará funcionando sin la firma autorizada
    }
  }

  private async initializeAuthData(): Promise<void> {
    // Obtener valores de las variables de entorno
    const token = process.env.AUTH_UUID_TOKEN;
    const uuid = process.env.AUTH_UUID_ORIGIN;

    if (!token || !uuid) {
      this.logger.warn(
        'AUTH_TOKEN or AUTH_UUID_ORIGIN not defined in environment variables',
      );
      return;
    }

    let retries = 0;
    let success = false;

    while (!success && retries < this.maxRetries) {
      try {
        const response = await this.signatureService.getAuthorizedSign(
          token,
          uuid,
        );

        // Validar que tenemos los datos necesarios
        if (!response.payload.signSecret) {
          throw new Error('SignSecret no recibido en la respuesta');
        }

        this.authData = response.payload;
        process.env.JWT_SECRET = this.authData.signSecret;
        this.jwtSecretProvider.setSecret(this.authData.signSecret);

        console.log(process.env.JWT_SECRET);
        // Solo asignar checkSumSecret si existe
        if (this.authData.checkSumSecret) {
          process.env.CHECKSUM_SECRET = this.authData.checkSumSecret;
        }

        this.logger.log(
          `Auth data initialized successfully for origin: ${this.authData.originName}`,
        );
        this.logger.log(
          `SignSecret length: ${this.authData.signSecret?.length}`,
        );
        this.logger.log(
          `CheckSumSecret length: ${this.authData.checkSumSecret?.length || 'undefined'}`,
        );

        if (this.authData.expiresAt) {
          this.logger.log(
            `Checksum secret expires at: ${this.authData.expiresAt}`,
          );
        }

        success = true;
      } catch (error) {
        retries++;
        this.logger.error(
          `Failed to initialize auth data (attempt ${retries}/${this.maxRetries}):`,
          error,
        );

        if (retries < this.maxRetries) {
          // Esperar antes de reintentar (backoff exponencial)
          const waitTime = Math.pow(2, retries) * 1000;
          this.logger.log(`Retrying in ${waitTime}ms...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        } else {
          throw error;
        }
      }
    }
  }

  // Métodos públicos para obtener los datos de autenticación
  getCheckSumSecret(): string | null {
    return this.authData?.checkSumSecret || null;
  }

  getSignSecret(): string | null {
    return this.authData?.signSecret || null;
  }

  getOriginName(): string | null {
    return this.authData?.originName || null;
  }

  getExpiresAt(): Date | null {
    return this.authData?.expiresAt ? new Date(this.authData.expiresAt) : null;
  }

  // Verificar si los datos están por vencer
  isExpiringSoon(thresholdMinutes: number = 60): boolean {
    if (!this.authData?.expiresAt) {
      this.logger.warn('No expiration date available, considering as expiring');
      return true;
    }

    try {
      const expiresAt = new Date(this.authData.expiresAt);
      const now = new Date();
      const thresholdMs = thresholdMinutes * 60 * 1000;

      const isExpiring = expiresAt.getTime() - now.getTime() < thresholdMs;

      if (isExpiring) {
        this.logger.warn(
          `Auth data expiring soon. Expires at: ${this.authData.expiresAt}`,
        );
      }

      return isExpiring;
    } catch (error) {
      this.logger.error('Error checking expiration date:', error);
      return true; // Considerar como expirado si hay error
    }
  }

  // Método para actualizar los datos manualmente si es necesario
  async refreshAuthData(): Promise<void> {
    await this.initializeAuthData();
  }

  // Método para obtener todos los datos de autenticación
  getAllAuthData(): AuthSignData | null {
    return this.authData;
  }
}
