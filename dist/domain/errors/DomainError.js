"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.AuthorizationError = exports.NotFoundError = exports.ValidationError = exports.DomainError = void 0;
class DomainError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = 'DomainError';
    }
}
exports.DomainError = DomainError;
class ValidationError extends DomainError {
    constructor(message) { super(message, 'VALIDATION_ERROR'); }
}
exports.ValidationError = ValidationError;
class NotFoundError extends DomainError {
    constructor(resource) { super(`${resource} no encontrado`, 'NOT_FOUND'); }
}
exports.NotFoundError = NotFoundError;
class AuthorizationError extends DomainError {
    constructor(message = 'No autorizado para esta accion') { super(message, 'FORBIDDEN'); }
}
exports.AuthorizationError = AuthorizationError;
class ConflictError extends DomainError {
    constructor(message) { super(message, 'CONFLICT'); }
}
exports.ConflictError = ConflictError;
//# sourceMappingURL=DomainError.js.map