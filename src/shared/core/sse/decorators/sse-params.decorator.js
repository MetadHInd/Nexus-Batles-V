"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMetadata = exports.SSEUser = exports.SessionId = exports.TenantId = exports.ManagerId = void 0;
var common_1 = require("@nestjs/common");
/**
 * Extrae el managerId del request
 * Busca en: query params > body > user (JWT payload)
 *
 * @example
 * ```typescript
 * @Sse('stream')
 * streamEvents(
 *   @ManagerId() managerId: string
 * ) { ... }
 * ```
 */
exports.ManagerId = (0, common_1.createParamDecorator)(function (data, ctx) {
    var _a;
    var request = ctx.switchToHttp().getRequest();
    // 1. Query param
    if (request.query.managerId && typeof request.query.managerId === 'string') {
        return request.query.managerId;
    }
    // 2. Body (para POST requests)
    if ((_a = request.body) === null || _a === void 0 ? void 0 : _a.managerId) {
        return request.body.managerId;
    }
    // 3. User payload del JWT
    var user = request.user;
    if (user === null || user === void 0 ? void 0 : user.managerId) {
        return user.managerId;
    }
    // 4. Inferir del userId si existe convención
    if ((user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user.sub)) {
        return user.id || user.sub;
    }
    return undefined;
});
/**
 * Extrae el tenantId del request
 * Busca en: query params > user (JWT payload) > headers
 *
 * @example
 * ```typescript
 * @Sse('stream')
 * streamEvents(
 *   @TenantId() tenantId: string
 * ) { ... }
 * ```
 */
exports.TenantId = (0, common_1.createParamDecorator)(function (data, ctx) {
    var request = ctx.switchToHttp().getRequest();
    // 1. Query param
    if (request.query.tenantId && typeof request.query.tenantId === 'string') {
        return request.query.tenantId;
    }
    // 2. User payload del JWT
    var user = request.user;
    if (user === null || user === void 0 ? void 0 : user.tenantId) {
        return user.tenantId;
    }
    // 3. Header personalizado
    var tenantHeader = request.headers['x-tenant-id'];
    if (tenantHeader && typeof tenantHeader === 'string') {
        return tenantHeader;
    }
    return undefined;
});
/**
 * Extrae el clientId/sessionId del request
 *
 * @example
 * ```typescript
 * @Sse('stream')
 * streamEvents(
 *   @SessionId() sessionId: string
 * ) { ... }
 * ```
 */
exports.SessionId = (0, common_1.createParamDecorator)(function (data, ctx) {
    var _a;
    var request = ctx.switchToHttp().getRequest();
    // 1. Query param
    if (request.query.sessionId && typeof request.query.sessionId === 'string') {
        return request.query.sessionId;
    }
    // 2. Body
    if ((_a = request.body) === null || _a === void 0 ? void 0 : _a.sessionId) {
        return request.body.sessionId;
    }
    // 3. Header
    var sessionHeader = request.headers['x-session-id'];
    if (sessionHeader && typeof sessionHeader === 'string') {
        return sessionHeader;
    }
    return undefined;
});
/**
 * Extrae el usuario completo del JWT payload
 *
 * @example
 * ```typescript
 * @Sse('stream')
 * streamEvents(
 *   @SSEUser() user: any
 * ) { ... }
 * ```
 */
exports.SSEUser = (0, common_1.createParamDecorator)(function (data, ctx) {
    var request = ctx.switchToHttp().getRequest();
    var user = request.user;
    return data ? user === null || user === void 0 ? void 0 : user[data] : user;
});
/**
 * Extrae metadata del cliente desde query params
 *
 * @example
 * ```typescript
 * @Sse('stream')
 * streamEvents(
 *   @ClientMetadata() metadata: Record<string, any>
 * ) { ... }
 * ```
 */
exports.ClientMetadata = (0, common_1.createParamDecorator)(function (data, ctx) {
    var request = ctx.switchToHttp().getRequest();
    // Construir metadata desde query params y headers
    return __assign({ userAgent: request.headers['user-agent'], ip: request.ip || request.socket.remoteAddress, referer: request.headers.referer, origin: request.headers.origin }, request.query);
});
