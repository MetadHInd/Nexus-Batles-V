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
exports.ResendActivationDto = exports.ActivateAccountDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ActivateAccountDto {
    token;
}
exports.ActivateAccountDto = ActivateAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'abc123token', description: 'Token de activación' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActivateAccountDto.prototype, "token", void 0);
class ResendActivationDto {
    userEmail;
}
exports.ResendActivationDto = ResendActivationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john.doe@example.com', description: 'Email del usuario' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ResendActivationDto.prototype, "userEmail", void 0);
//# sourceMappingURL=activation.dto.js.map