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
exports.SwaggerAuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const service_cache_1 = require("../core/services/service-cache/service-cache");
const roles_enum_1 = require("../core/auth/constants/roles.enum");
let SwaggerAuthMiddleware = class SwaggerAuthMiddleware {
    constructor() { }
    async use(req, res, next) {
        if (req.path.includes('/swagger-ui') ||
            req.path.includes('.css') ||
            req.path.includes('.js')) {
            return next();
        }
        if (req.path === '/api-docs' || req.path === '/api-docs/') {
            const token = this.extractTokenFromRequest(req);
            console.log(`🔍 Swagger Auth: Verificando token `, token);
            if (!token) {
                console.log(`🔒 Swagger Auth: Acceso denegado a ${req.path} - Token no encontrado`);
                return this.redirectToLogin(res);
            }
            try {
                const payload = await service_cache_1.ServiceCache.Authorization.TokenService.validateToken(token);
                console.log(`🔍 Swagger Auth: Token encontrado en ${req.path}:`, payload);
                const userId = payload.usersub || payload.sub;
                if (!payload ||
                    !userId ||
                    (payload.role !== roles_enum_1.Role.ADMIN &&
                        payload.role !== roles_enum_1.Role.ADMIN_AUTHORIZED_ORIGIN &&
                        payload.role !== roles_enum_1.Role.SUPER_ADMIN)) {
                    console.log(`🔒 Swagger Auth: Token inválido o sin permisos de administrador para ${req.path}`);
                    console.log(`🔒 Usuario: ${userId || 'N/A'}, Rol: ${payload?.role || 'N/A'}`);
                    return this.redirectToLogin(res);
                }
                console.log(`✅ Swagger Auth: Acceso autorizado a ${req.path} para admin ${payload} con rol ${payload.role}`);
                return next();
            }
            catch (error) {
                console.log(`🔒 Swagger Auth: Token expirado/inválido para ${req.path}:`, error.message);
                return this.redirectToLogin(res);
            }
        }
        next();
    }
    extractTokenFromRequest(req) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        const cookieToken = req.cookies?.['access_token'] ||
            req.cookies?.['token'] ||
            req.cookies?.['authToken'];
        if (cookieToken) {
            console.log('Cookie token:', cookieToken);
            return cookieToken;
        }
        const queryToken = req.query.token;
        if (queryToken) {
            return queryToken;
        }
        return null;
    }
    redirectToLogin(res) {
        console.log('🔄 Swagger Auth: Redirigiendo a Login.html');
        res.redirect(302, '/Login.html');
    }
};
exports.SwaggerAuthMiddleware = SwaggerAuthMiddleware;
exports.SwaggerAuthMiddleware = SwaggerAuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SwaggerAuthMiddleware);
//# sourceMappingURL=swagger-auth.middleware.js.map