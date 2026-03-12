"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSESecure = SSESecure;
exports.SSEAuth = SSEAuth;
exports.SSERateLimit = SSERateLimit;
const common_1 = require("@nestjs/common");
const sse_auth_guard_1 = require("../guards/sse-auth.guard");
const sse_rate_limit_guard_1 = require("../guards/sse-rate-limit.guard");
function SSESecure() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(sse_rate_limit_guard_1.SSERateLimitGuard, sse_auth_guard_1.SSEAuthGuard));
}
function SSEAuth() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(sse_auth_guard_1.SSEAuthGuard));
}
function SSERateLimit() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(sse_rate_limit_guard_1.SSERateLimitGuard));
}
//# sourceMappingURL=sse-security.decorator.js.map