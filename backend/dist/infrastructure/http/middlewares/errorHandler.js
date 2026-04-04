"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const DomainError_1 = require("../../../domain/errors/DomainError");
const logger_1 = require("../../logging/logger");
const STATUS_MAP = {
    VALIDATION_ERROR: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
};
function errorHandler(err, req, res, _next) {
    if (err instanceof DomainError_1.DomainError) {
        const status = STATUS_MAP[err.code] ?? 400;
        res.status(status).json({ error: err.message, code: err.code });
        return;
    }
    logger_1.logger.error('Error inesperado', { message: err.message, stack: err.stack, path: req.path });
    res.status(500).json({ error: 'Error interno del servidor' });
}
//# sourceMappingURL=errorHandler.js.map