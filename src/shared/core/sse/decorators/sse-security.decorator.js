"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSESecure = SSESecure;
exports.SSEAuth = SSEAuth;
exports.SSERateLimit = SSERateLimit;
var common_1 = require("@nestjs/common");
var sse_auth_guard_1 = require("../guards/sse-auth.guard");
var sse_rate_limit_guard_1 = require("../guards/sse-rate-limit.guard");
/**
 * Decorator para aplicar seguridad completa a endpoints SSE
 *
 * Aplica:
 * - SSEAuthGuard (validación de JWT)
 * - SSERateLimitGuard (rate limiting)
 *
 * @example
 * ```typescript
 * @SSESecure()
 * @Sse('stream')
 * streamEvents() { ... }
 * ```
 */
function SSESecure() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(sse_rate_limit_guard_1.SSERateLimitGuard, sse_auth_guard_1.SSEAuthGuard));
}
/**
 * Decorator solo para autenticación SSE
 *
 * @example
 * ```typescript
 * @SSEAuth()
 * @Sse('stream')
 * streamEvents() { ... }
 * ```
 */
function SSEAuth() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(sse_auth_guard_1.SSEAuthGuard));
}
/**
 * Decorator solo para rate limiting SSE
 *
 * @example
 * ```typescript
 * @SSERateLimit()
 * @Sse('stream')
 * streamEvents() { ... }
 * ```
 */
function SSERateLimit() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(sse_rate_limit_guard_1.SSERateLimitGuard));
}
