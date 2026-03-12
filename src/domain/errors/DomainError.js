"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.AuthorizationError = exports.NotFoundError = exports.ValidationError = exports.DomainError = void 0;
var DomainError = /** @class */ (function (_super) {
    __extends(DomainError, _super);
    function DomainError(message, code) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.name = 'DomainError';
        return _this;
    }
    return DomainError;
}(Error));
exports.DomainError = DomainError;
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(message) {
        return _super.call(this, message, 'VALIDATION_ERROR') || this;
    }
    return ValidationError;
}(DomainError));
exports.ValidationError = ValidationError;
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(resource) {
        return _super.call(this, "".concat(resource, " no encontrado"), 'NOT_FOUND') || this;
    }
    return NotFoundError;
}(DomainError));
exports.NotFoundError = NotFoundError;
var AuthorizationError = /** @class */ (function (_super) {
    __extends(AuthorizationError, _super);
    function AuthorizationError(message) {
        if (message === void 0) { message = 'No autorizado para esta accion'; }
        return _super.call(this, message, 'FORBIDDEN') || this;
    }
    return AuthorizationError;
}(DomainError));
exports.AuthorizationError = AuthorizationError;
var ConflictError = /** @class */ (function (_super) {
    __extends(ConflictError, _super);
    function ConflictError(message) {
        return _super.call(this, message, 'CONFLICT') || this;
    }
    return ConflictError;
}(DomainError));
exports.ConflictError = ConflictError;
