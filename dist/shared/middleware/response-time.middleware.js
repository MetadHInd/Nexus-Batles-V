"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseTimeMiddleware = void 0;
class ResponseTimeMiddleware {
    use(_req, res, next) {
        res.ms = Date.now();
        next();
    }
}
exports.ResponseTimeMiddleware = ResponseTimeMiddleware;
//# sourceMappingURL=response-time.middleware.js.map