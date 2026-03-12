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
var SignatureService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureService = void 0;
const common_1 = require("@nestjs/common");
const http_client_base_1 = require("../../../http/http-client.base");
let SignatureService = SignatureService_1 = class SignatureService extends http_client_base_1.HttpClientBase {
    logger = new common_1.Logger(SignatureService_1.name);
    constructor() {
        super(process.env.AUTH_URL || 'https://dev.auth.voyagr.site');
    }
    async getAuthorizedSign(token, uuid) {
        try {
            const headers = {
                accept: 'application/json',
                'x-auth-token': token,
                'x-auth-uuid': uuid,
            };
            this.logger.debug('Making request to get authorized sign...');
            const result = await this.post('/authorized-origins/get-sign', {}, headers);
            this.logger.debug('Result from post method:', JSON.stringify(result));
            return result;
        }
        catch (error) {
            this.logger.error('Error in getAuthorizedSign:', error);
            throw error;
        }
    }
};
exports.SignatureService = SignatureService;
exports.SignatureService = SignatureService = SignatureService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SignatureService);
//# sourceMappingURL=signature.service.js.map