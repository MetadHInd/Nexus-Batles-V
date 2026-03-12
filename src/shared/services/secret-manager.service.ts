import { Injectable, Logger } from '@nestjs/common';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

@Injectable()
export class SecretManagerService {
  private readonly logger = new Logger(SecretManagerService.name);
  private client: SecretManagerServiceClient;
  private projectId: string;

  constructor() {
    this.projectId =
      process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || '';
    this.client = new SecretManagerServiceClient();
  }

  async getSecret(secretName: string): Promise<string> {
    try {
      const name = `projects/${this.projectId}/secrets/${secretName}/versions/latest`;
      const [version] = await this.client.accessSecretVersion({ name });

      const payload = version.payload?.data?.toString();
      if (!payload) {
        throw new Error(`Secret ${secretName} is empty`);
      }

      return payload;
    } catch (error) {
      this.logger.error(`Failed to get secret ${secretName}:`, error);
      throw error;
    }
  }

  async createSecret(secretName: string, secretValue: string): Promise<void> {
    try {
      const parent = `projects/${this.projectId}`;

      // Create the secret
      await this.client.createSecret({
        parent,
        secretId: secretName,
        secret: {
          replication: {
            automatic: {},
          },
        },
      });

      // Add the secret version
      await this.client.addSecretVersion({
        parent: `${parent}/secrets/${secretName}`,
        payload: {
          data: Buffer.from(secretValue, 'utf8'),
        },
      });

      this.logger.log(`Secret ${secretName} created successfully`);
    } catch (error) {
      this.logger.error(`Failed to create secret ${secretName}:`, error);
      throw error;
    }
  }

  async updateSecret(secretName: string, secretValue: string): Promise<void> {
    try {
      const parent = `projects/${this.projectId}/secrets/${secretName}`;

      await this.client.addSecretVersion({
        parent,
        payload: {
          data: Buffer.from(secretValue, 'utf8'),
        },
      });

      this.logger.log(`Secret ${secretName} updated successfully`);
    } catch (error) {
      this.logger.error(`Failed to update secret ${secretName}:`, error);
      throw error;
    }
  }

  async listSecrets(): Promise<string[]> {
    try {
      const parent = `projects/${this.projectId}`;
      const [secrets] = await this.client.listSecrets({ parent });

      return secrets
        .map((secret) => {
          const name = secret.name || '';
          return name.split('/').pop() || '';
        })
        .filter((name) => name !== '');
    } catch (error) {
      this.logger.error('Failed to list secrets:', error);
      throw error;
    }
  }

  async deleteSecret(secretName: string): Promise<void> {
    try {
      const name = `projects/${this.projectId}/secrets/${secretName}`;
      await this.client.deleteSecret({ name });
      this.logger.log(`Secret ${secretName} deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete secret ${secretName}:`, error);
      throw error;
    }
  }
}
