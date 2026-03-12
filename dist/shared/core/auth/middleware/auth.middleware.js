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
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const token_service_1 = require("../services/shared/token.service");
const generic_error_messages_enum_1 = require("../../../constants/generic-error-messages.enum");
const error_codes_enum_1 = require("../../../errors/error-codes.enum");
let AuthMiddleware = class AuthMiddleware {
    tokenService;
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    async use(req, res, next) {
        try {
            let token = req.header('authorization');
            if (!token) {
                return next({
                    status: 401,
                    printMessage: generic_error_messages_enum_1.GenericErrorMessages.INVALID_JWT_TOKEN,
                });
            }
            if (token.startsWith('Bearer ')) {
                token = token.slice(7).trim();
            }
            const payload = (await this.tokenService.validateToken(token));
            req['user'] = payload;
            next();
        }
        catch {
            return next({
                status: error_codes_enum_1.ErrorCodesEnum.UNAUTHORIZED,
                printMessage: generic_error_messages_enum_1.GenericErrorMessages.INVALID_JWT_TOKEN,
            });
        }
    }
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [token_service_1.TokenService])
], AuthMiddleware);
//# sourceMappingURL=auth.middleware.js.map