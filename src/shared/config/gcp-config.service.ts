import { Injectable, Logger } from '@nestjs/common';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

@Injectable()
export class GcpConfigService {
  private readonly logger = new Logger(GcpConfigService.name);
  private client: SecretManagerServiceClient;
  private projectId: string;
  private secretsCache: Map<string, string> = new Map();

  constructor() {
    this.projectId =
      process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || '';
    this.client = new SecretManagerServiceClient();
  }

  async loadAllSecrets(): Promise<void> {
    this.logger.log('Loading secrets from GCP Secret Manager...');

    const secretNames = [
      'DATABASE_URL',
      'DATABASE_URL_DEV',
      'AUTH_URL',
      'AUTH_UUID_ORIGIN',
      'AUTH_UUID_TOKEN',
      'TEST_JWT_TOKEN',
      'JWT_SECRET',
      'SMTP_HOST',
      'SMTP_USER',
      'SMTP_PASS',
      'ONESIGNAL_APP_ID',
      'ONESIGNAL_API_KEY',
      'PINECONE_API_KEY',
      'GEMINI_API_KEY',
      'OPENAI_API_KEY',
      'GOOGLE_MAPS_API_KEY',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'ODIN_TOKEN',
      'WHATSAPP_VERIFY_TOKEN',
      'WHATSAPP_ACCESS_TOKEN',
    ];

    const promises = secretNames.map(async (secretName) => {
      try {
        const value = await this.getSecret(secretName);
        this.secretsCache.set(secretName, value);
        process.env[secretName] = value;
        this.logger.debug(`✅ Loaded secret: ${secretName}`);
      } catch (error) {
        this.logger.warn(
          `⚠️  Failed to load secret ${secretName}: ${error.message}`,
        );
        // Keep existing env var if secret fails to load
      }
    });

    await Promise.all(promises);
    this.logger.log(
      `Loaded ${this.secretsCache.size} secrets from GCP Secret Manager`,
    );
  }

  private async getSecret(secretName: string): Promise<string> {
    try {
      const name = `projects/${this.projectId}/secrets/${secretName}/versions/latest`;
      const [version] = await this.client.accessSecretVersion({ name });

      const payload = version.payload?.data?.toString();
      if (!payload) {
        throw new Error(`Secret ${secretName} is empty`);
      }

      return payload;
    } catch (error) {
      throw new Error(`Failed to get secret ${secretName}: ${error.message}`);
    }
  }

  getSecretFromCache(secretName: string): string | undefined {
    return this.secretsCache.get(secretName);
  }

  async refreshSecret(secretName: string): Promise<void> {
    try {
      const value = await this.getSecret(secretName);
      this.secretsCache.set(secretName, value);
      process.env[secretName] = value;
      this.logger.log(`Refreshed secret: ${secretName}`);
    } catch (error) {
      this.logger.error(`Failed to refresh secret ${secretName}:`, error);
      throw error;
    }
  }
}
