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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponseModel = void 0;
const swagger_1 = require("@nestjs/swagger");
class LoginResponseModel {
    token;
    user;
    tenants;
    defaultTenant;
    constructor(token, user, tenants, defaultTenant) {
        this.token = token;
        this.user = user;
        if (tenants && tenants.length > 0) {
            this.tenants = tenants;
        }
        if (defaultTenant) {
            this.defaultTenant = defaultTenant;
        }
    }
}
exports.LoginResponseModel = LoginResponseModel;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'JWT token de autenticación',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }),
    __metadata("design:type", String)
], LoginResponseModel.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Información del usuario autenticado',
        example: {
            uuid: '550e8400-e29b-41d4-a716-446655440000',
            email: 'user@example.com',
            userName: 'John',
            userLastName: 'Doe'
        }
    }),
    __metadata("design:type", Object)
], LoginResponseModel.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de tenants disponibles para el usuario (multitenancy deshabilitado)',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                tenant_sub: { type: 'string' },
                slug: { type: 'string' },
                name: { type: 'string' },
                is_default: { type: 'boolean' }
            }
        },
        required: false
    }),
    __metadata("design:type", Array)
], LoginResponseModel.prototype, "tenants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant predeterminado del usuario (multitenancy deshabilitado)',
        example: '550e8400-e29b-41d4-a716-446655440000',
        required: false
    }),
    __metadata("design:type", String)
], LoginResponseModel.prototype, "defaultTenant", void 0);
//# sourceMappingURL=login-response.model.js.map