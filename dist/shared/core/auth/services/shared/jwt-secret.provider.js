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
exports.JwtSecretProvider = void 0;
const common_1 = require("@nestjs/common");
let JwtSecretProvider = class JwtSecretProvider {
    secret;
    constructor() {
        this.secret = process.env.JWT_SECRET || 'your-secret-key';
    }
    setSecret(secret) {
        this.secret = secret;
    }
    getSecret() {
        return this.secret;
    }
};
exports.JwtSecretProvider = JwtSecretProvider;
exports.JwtSecretProvider = JwtSecretProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtSecretProvider);
//# sourceMappingURL=jwt-secret.provider.js.map