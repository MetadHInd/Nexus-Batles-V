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
var ChecksumService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecksumService = void 0;
const common_1 = require("@nestjs/common");
const signature_service_1 = require("./signature.service");
const jwt_secret_provider_1 = require("./jwt-secret.provider");
let ChecksumService = ChecksumService_1 = class ChecksumService {
    signatureService;
    jwtSecretProvider;
    logger = new common_1.Logger(ChecksumService_1.name);
    authData = null;
    maxRetries = 3;
    constructor(signatureService, jwtSecretProvider) {
        this.signatureService = signatureService;
        this.jwtSecretProvider = jwtSecretProvider;
    }
    async onModuleInit() {
        try {
            await this.initializeAuthData();
        }
        catch (error) {
            this.logger.error('Error initializing auth data, will continue without it:', error);
        }
    }
    async initializeAuthData() {
        const token = process.env.AUTH_UUID_TOKEN;
        const uuid = process.env.AUTH_UUID_ORIGIN;
        if (!token || !uuid) {
            this.logger.warn('AUTH_TOKEN or AUTH_UUID_ORIGIN not defined in environment variables');
            return;
        }
        let retries = 0;
        let success = false;
        while (!success && retries < this.maxRetries) {
            try {
                const response = await this.signatureService.getAuthorizedSign(token, uuid);
                if (!response.payload.signSecret) {
                    throw new Error('SignSecret no recibido en la respuesta');
                }
                this.authData = response.payload;
                process.env.JWT_SECRET = this.authData.signSecret;
                this.jwtSecretProvider.setSecret(this.authData.signSecret);
                console.log(process.env.JWT_SECRET);
                if (this.authData.checkSumSecret) {
                    process.env.CHECKSUM_SECRET = this.authData.checkSumSecret;
                }
                this.logger.log(`Auth data initialized successfully for origin: ${this.authData.originName}`);
                this.logger.log(`SignSecret length: ${this.authData.signSecret?.length}`);
                this.logger.log(`CheckSumSecret length: ${this.authData.checkSumSecret?.length || 'undefined'}`);
                if (this.authData.expiresAt) {
                    this.logger.log(`Checksum secret expires at: ${this.authData.expiresAt}`);
                }
                success = true;
            }
            catch (error) {
                retries++;
                this.logger.error(`Failed to initialize auth data (attempt ${retries}/${this.maxRetries}):`, error);
                if (retries < this.maxRetries) {
                    const waitTime = Math.pow(2, retries) * 1000;
                    this.logger.log(`Retrying in ${waitTime}ms...`);
                    await new Promise((resolve) => setTimeout(resolve, waitTime));
                }
                else {
                    throw error;
                }
            }
        }
    }
    getCheckSumSecret() {
        return this.authData?.checkSumSecret || null;
    }
    getSignSecret() {
        return this.authData?.signSecret || null;
    }
    getOriginName() {
        return this.authData?.originName || null;
    }
    getExpiresAt() {
        return this.authData?.expiresAt ? new Date(this.authData.expiresAt) : null;
    }
    isExpiringSoon(thresholdMinutes = 60) {
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
                this.logger.warn(`Auth data expiring soon. Expires at: ${this.authData.expiresAt}`);
            }
            return isExpiring;
        }
        catch (error) {
            this.logger.error('Error checking expiration date:', error);
            return true;
        }
    }
    async refreshAuthData() {
        await this.initializeAuthData();
    }
    getAllAuthData() {
        return this.authData;
    }
};
exports.ChecksumService = ChecksumService;
exports.ChecksumService = ChecksumService = ChecksumService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [signature_service_1.SignatureService,
        jwt_secret_provider_1.JwtSecretProvider])
], ChecksumService);
//# sourceMappingURL=checksum.service.js.map