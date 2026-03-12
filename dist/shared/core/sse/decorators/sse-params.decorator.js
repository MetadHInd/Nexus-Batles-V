"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMetadata = exports.SSEUser = exports.SessionId = exports.TenantId = exports.ManagerId = void 0;
const common_1 = require("@nestjs/common");
exports.ManagerId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.query.managerId && typeof request.query.managerId === 'string') {
        return request.query.managerId;
    }
    if (request.body?.managerId) {
        return request.body.managerId;
    }
    const user = request.user;
    if (user?.managerId) {
        return user.managerId;
    }
    if (user?.id || user?.sub) {
        return user.id || user.sub;
    }
    return undefined;
});
exports.TenantId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.query.tenantId && typeof request.query.tenantId === 'string') {
        return request.query.tenantId;
    }
    const user = request.user;
    if (user?.tenantId) {
        return user.tenantId;
    }
    const tenantHeader = request.headers['x-tenant-id'];
    if (tenantHeader && typeof tenantHeader === 'string') {
        return tenantHeader;
    }
    return undefined;
});
exports.SessionId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.query.sessionId && typeof request.query.sessionId === 'string') {
        return request.query.sessionId;
    }
    if (request.body?.sessionId) {
        return request.body.sessionId;
    }
    const sessionHeader = request.headers['x-session-id'];
    if (sessionHeader && typeof sessionHeader === 'string') {
        return sessionHeader;
    }
    return undefined;
});
exports.SSEUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
});
exports.ClientMetadata = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return {
        userAgent: request.headers['user-agent'],
        ip: request.ip || request.socket.remoteAddress,
        referer: request.headers.referer,
        origin: request.headers.origin,
        ...request.query,
    };
});
//# sourceMappingURL=sse-params.decorator.js.map