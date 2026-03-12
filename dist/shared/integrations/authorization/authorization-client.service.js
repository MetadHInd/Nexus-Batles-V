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
var AuthorizationClientService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationClientService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let AuthorizationClientService = AuthorizationClientService_1 = class AuthorizationClientService {
    logger = new common_1.Logger(AuthorizationClientService_1.name);
    client;
    baseUrl;
    constructor() {
        this.baseUrl = process.env.AUTH_URL || 'http://localhost:5000';
        this.client = axios_1.default.create({
            baseURL: this.baseUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        this.logger.log(`Authorization Client initialized with URL: ${this.baseUrl}`);
    }
    async createUser(data, authToken) {
        try {
            this.logger.log(`Creating user in Authorization: ${data.email}`);
            const response = await this.client.post('/users/create-from-core', data, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            this.logger.log(`User created in Authorization: ${response.data.uuid}`);
            return response.data;
        }
        catch (error) {
            this.handleError(error, 'createUser');
        }
    }
    async existsByEmail(email, authToken) {
        try {
            this.logger.log(`Checking if email exists in Authorization: ${email}`);
            const response = await this.client.get(`/users/exists/email/${encodeURIComponent(email)}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            this.logger.log(`existsByEmail response: ${JSON.stringify(response.data)}`);
            return response.data?.exists === true;
        }
        catch (error) {
            if (error.response?.status === 404) {
                this.logger.log(`existsByEmail: 404 response, returning false`);
                return false;
            }
            this.logger.error(`existsByEmail error: ${error.message}`);
            return false;
        }
    }
    async existsByUuid(uuid, authToken) {
        try {
            const response = await this.client.get(`/users/exists/uuid/${uuid}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            return response.data.exists;
        }
        catch (error) {
            if (error.response?.status === 404) {
                return false;
            }
            this.handleError(error, 'existsByUuid');
        }
    }
    async assignTenant(email, tenantId, roleInTenant = 'employee', authToken) {
        try {
            this.logger.log(`Assigning tenant ${tenantId} to user ${email}`);
            await this.client.post('/users/assign-tenant', {
                email,
                tenantId,
                role_in_tenant: roleInTenant,
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            this.logger.log(`Tenant ${tenantId} assigned to user ${email}`);
            return true;
        }
        catch (error) {
            if (error.response?.status === common_1.HttpStatus.CONFLICT) {
                this.logger.log(`User ${email} already has tenant ${tenantId} assigned`);
                return true;
            }
            this.handleError(error, 'assignTenant');
        }
    }
    handleError(error, method) {
        if (axios_1.default.isAxiosError(error)) {
            const axiosError = error;
            const status = axiosError.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            const message = axiosError.response?.data?.message || axiosError.message;
            this.logger.error(`Authorization Client Error [${method}]: ${status} - ${message}`, axiosError.stack);
            if (status === common_1.HttpStatus.CONFLICT) {
                throw new common_1.HttpException(`El usuario ya existe en Authorization: ${message}`, common_1.HttpStatus.CONFLICT);
            }
            if (status === common_1.HttpStatus.FORBIDDEN) {
                throw new common_1.HttpException(`No tienes permiso para crear usuarios: ${message}`, common_1.HttpStatus.FORBIDDEN);
            }
            if (status === common_1.HttpStatus.UNAUTHORIZED) {
                throw new common_1.HttpException(`Token inválido o expirado: ${message}`, common_1.HttpStatus.UNAUTHORIZED);
            }
            throw new common_1.HttpException(`Error comunicándose con Authorization: ${message}`, status);
        }
        this.logger.error(`Unexpected error in ${method}:`, error);
        throw new common_1.HttpException('Error interno al comunicarse con Authorization', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.AuthorizationClientService = AuthorizationClientService;
exports.AuthorizationClientService = AuthorizationClientService = AuthorizationClientService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AuthorizationClientService);
//# sourceMappingURL=authorization-client.service.js.map