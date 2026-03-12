"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SecretManagerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretManagerService = void 0;
const common_1 = require("@nestjs/common");
const secret_manager_1 = require("@google-cloud/secret-manager");
let SecretManagerService = SecretManagerService_1 = class SecretManagerService {
    logger = new common_1.Logger(SecretManagerService_1.name);
    client;
    projectId;
    constructor() {
        this.projectId =
            process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || '';
        this.client = new secret_manager_1.SecretManagerServiceClient();
    }
    async getSecret(secretName) {
        try {
            const name = `projects/${this.projectId}/secrets/${secretName}/versions/latest`;
            const [version] = await this.client.accessSecretVersion({ name });
            const payload = version.payload?.data?.toString();
            if (!payload) {
                throw new Error(`Secret ${secretName} is empty`);
            }
            return payload;
        }
        catch (error) {
            this.logger.error(`Failed to get secret ${secretName}:`, error);
            throw error;
        }
    }
    async createSecret(secretName, secretValue) {
        try {
            const parent = `projects/${this.projectId}`;
            await this.client.createSecret({
                parent,
                secretId: secretName,
                secret: {
                    replication: {
                        automatic: {},
                    },
                },
            });
            await this.client.addSecretVersion({
                parent: `${parent}/secrets/${secretName}`,
                payload: {
                    data: Buffer.from(secretValue, 'utf8'),
                },
            });
            this.logger.log(`Secret ${secretName} created successfully`);
        }
        catch (error) {
            this.logger.error(`Failed to create secret ${secretName}:`, error);
            throw error;
        }
    }
    async updateSecret(secretName, secretValue) {
        try {
            const parent = `projects/${this.projectId}/secrets/${secretName}`;
            await this.client.addSecretVersion({
                parent,
                payload: {
                    data: Buffer.from(secretValue, 'utf8'),
                },
            });
            this.logger.log(`Secret ${secretName} updated successfully`);
        }
        catch (error) {
            this.logger.error(`Failed to update secret ${secretName}:`, error);
            throw error;
        }
    }
    async listSecrets() {
        try {
            const parent = `projects/${this.projectId}`;
            const [secrets] = await this.client.listSecrets({ parent });
            return secrets
                .map((secret) => {
                const name = secret.name || '';
                return name.split('/').pop() || '';
            })
                .filter((name) => name !== '');
        }
        catch (error) {
            this.logger.error('Failed to list secrets:', error);
            throw error;
        }
    }
    async deleteSecret(secretName) {
        try {
            const name = `projects/${this.projectId}/secrets/${secretName}`;
            await this.client.deleteSecret({ name });
            this.logger.log(`Secret ${secretName} deleted successfully`);
        }
        catch (error) {
            this.logger.error(`Failed to delete secret ${secretName}:`, error);
            throw error;
        }
    }
};
exports.SecretManagerService = SecretManagerService;
exports.SecretManagerService = SecretManagerService = SecretManagerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SecretManagerService);
//# sourceMappingURL=secret-manager.service.js.map