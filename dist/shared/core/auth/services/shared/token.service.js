"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
const config_constants_enum_1 = require("../../../../constants/config.constants.enum");
const generic_error_messages_enum_1 = require("../../../../constants/generic-error-messages.enum");
const error_codes_enum_1 = require("../../../../errors/error-codes.enum");
const uuid_1 = require("uuid");
let TokenService = class TokenService {
    validateToken(token) {
        return new Promise((resolve, reject) => {
            if (!token)
                return reject(new Error('Token is missing'));
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error(generic_error_messages_enum_1.GenericErrorMessages.JWT_ENV_TOKEN_MISSING);
            }
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    return reject(new Error(JSON.stringify({
                        status: error_codes_enum_1.ErrorCodesEnum.UNAUTHORIZED,
                        printMessage: generic_error_messages_enum_1.GenericErrorMessages.INVALID_JWT_TOKEN,
                    })));
                }
                resolve(decoded);
            });
        });
    }
    generateToken(payload, expiresIn = config_constants_enum_1.ConfigConstants.JWT_DEFAULT_EXPIREtIME) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error(generic_error_messages_enum_1.GenericErrorMessages.JWT_ENV_TOKEN_MISSING);
        }
        return jwt.sign(payload, secret, { expiresIn });
    }
    generateUUID(amount, isHexa = true) {
        if (amount && Number.isInteger(amount) && amount > 0) {
            return Array.from({ length: amount }, () => isHexa
                ? Math.floor(Math.random() * 16).toString(16)
                : Math.floor(Math.random() * 10).toString()).join('');
        }
        return (0, uuid_1.v4)();
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)()
], TokenService);
//# sourceMappingURL=token.service.js.map