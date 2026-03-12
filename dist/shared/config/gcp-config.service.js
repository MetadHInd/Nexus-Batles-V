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
var GcpConfigService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GcpConfigService = void 0;
const common_1 = require("@nestjs/common");
const secret_manager_1 = require("@google-cloud/secret-manager");
let GcpConfigService = GcpConfigService_1 = class GcpConfigService {
    logger = new common_1.Logger(GcpConfigService_1.name);
    client;
    projectId;
    secretsCache = new Map();
    constructor() {
        this.projectId =
            process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || '';
        this.client = new secret_manager_1.SecretManagerServiceClient();
    }
    async loadAllSecrets() {
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
            }
            catch (error) {
                this.logger.warn(`⚠️  Failed to load secret ${secretName}: ${error.message}`);
            }
        });
        await Promise.all(promises);
        this.logger.log(`Loaded ${this.secretsCache.size} secrets from GCP Secret Manager`);
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
            throw new Error(`Failed to get secret ${secretName}: ${error.message}`);
        }
    }
    getSecretFromCache(secretName) {
        return this.secretsCache.get(secretName);
    }
    async refreshSecret(secretName) {
        try {
            const value = await this.getSecret(secretName);
            this.secretsCache.set(secretName, value);
            process.env[secretName] = value;
            this.logger.log(`Refreshed secret: ${secretName}`);
        }
        catch (error) {
            this.logger.error(`Failed to refresh secret ${secretName}:`, error);
            throw error;
        }
    }
};
exports.GcpConfigService = GcpConfigService;
exports.GcpConfigService = GcpConfigService = GcpConfigService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GcpConfigService);
//# sourceMappingURL=gcp-config.service.js.map