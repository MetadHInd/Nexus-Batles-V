"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentBranchId = exports.CurrentUserJWT = exports.CurrentUserId = exports.CurrentUserProfile = exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        if (user) {
            user.token = token;
            user.jwt = token;
        }
    }
    return user;
});
exports.CurrentUserProfile = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.profile;
});
exports.CurrentUserId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.userId;
});
exports.CurrentUserJWT = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return undefined;
});
exports.CurrentBranchId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentBranchId;
});
//# sourceMappingURL=current-user.decorator.js.map