"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentBranchId = exports.CurrentUserJWT = exports.CurrentUserId = exports.CurrentUserProfile = exports.CurrentUser = void 0;
var common_1 = require("@nestjs/common");
/**
 * Decorador para obtener el usuario actual autenticado con su token JWT
 *
 * @example
 * // Obtener usuario completo con token
 * async getProfile(@CurrentUser() user: IJWTUserResponse) {
 *   return user; // { userId, profile, token/jwt }
 * }
 */
exports.CurrentUser = (0, common_1.createParamDecorator)(function (data, ctx) {
    var request = ctx.switchToHttp().getRequest();
    var user = request.user;
    // Intentar extraer el JWT del header de autorización
    var authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        var token = authHeader.substring(7);
        // Añadir el token al objeto user si existe
        if (user) {
            user.token = token;
            user.jwt = token;
        }
    }
    return user;
});
/**
 * Decorador específico para obtener el perfil del usuario
 */
exports.CurrentUserProfile = (0, common_1.createParamDecorator)(function (data, ctx) {
    var _a;
    var request = ctx.switchToHttp().getRequest();
    return (_a = request.user) === null || _a === void 0 ? void 0 : _a.profile;
});
/**
 * Decorador para obtener el ID del usuario actual
 */
exports.CurrentUserId = (0, common_1.createParamDecorator)(function (data, ctx) {
    var _a;
    var request = ctx.switchToHttp().getRequest();
    return (_a = request.user) === null || _a === void 0 ? void 0 : _a.userId;
});
/**
 * Decorador para obtener solo el JWT del usuario autenticado
 */
exports.CurrentUserJWT = (0, common_1.createParamDecorator)(function (data, ctx) {
    var request = ctx.switchToHttp().getRequest();
    var authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return undefined;
});
/**
 * Decorador para obtener la branch actual (cuando se usa BranchAccessGuard)
 */
exports.CurrentBranchId = (0, common_1.createParamDecorator)(function (data, ctx) {
    var request = ctx.switchToHttp().getRequest();
    return request.currentBranchId;
});
