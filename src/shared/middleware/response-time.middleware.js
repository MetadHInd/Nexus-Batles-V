"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseTimeMiddleware = void 0;
var ResponseTimeMiddleware = /** @class */ (function () {
    function ResponseTimeMiddleware() {
    }
    ResponseTimeMiddleware.prototype.use = function (_req, res, next) {
        res.ms = Date.now();
        next();
    };
    return ResponseTimeMiddleware;
}());
exports.ResponseTimeMiddleware = ResponseTimeMiddleware;
