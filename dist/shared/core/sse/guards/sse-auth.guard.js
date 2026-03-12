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
var SSEAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let SSEAuthGuard = SSEAuthGuard_1 = class SSEAuthGuard {
    jwtService;
    logger = new common_1.Logger(SSEAuthGuard_1.name);
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);
        if (!token) {
            this.logger.warn(`SSE auth failed: No token provided (IP: ${request.ip})`);
            throw new common_1.UnauthorizedException('Token not provided');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            request.user = payload;
            this.logger.debug(`SSE auth successful: ${payload.sub || payload.userId} (IP: ${request.ip})`);
            return true;
        }
        catch (error) {
            this.logger.warn(`SSE auth failed: Invalid token (IP: ${request.ip})`, error instanceof Error ? error.message : '');
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    extractToken(request) {
        if (request.query.token && typeof request.query.token === 'string') {
            return request.query.token;
        }
        const authHeader = request.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        return undefined;
    }
};
exports.SSEAuthGuard = SSEAuthGuard;
exports.SSEAuthGuard = SSEAuthGuard = SSEAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], SSEAuthGuard);
//# sourceMappingURL=sse-auth.guard.js.map