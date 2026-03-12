"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
var DomainError_1 = require("../../../domain/errors/DomainError");
var logger_1 = require("../../logging/logger");
var STATUS_MAP = {
    VALIDATION_ERROR: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
};
function errorHandler(err, req, res, _next) {
    var _a;
    if (err instanceof DomainError_1.DomainError) {
        var status_1 = (_a = STATUS_MAP[err.code]) !== null && _a !== void 0 ? _a : 400;
        res.status(status_1).json({ error: err.message, code: err.code });
        return;
    }
    logger_1.logger.error('Error inesperado', { message: err.message, stack: err.stack, path: req.path });
    res.status(500).json({ error: 'Error interno del servidor' });
}
