"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
// src/auth/services/token.service.ts
var common_1 = require("@nestjs/common");
var jwt = require("jsonwebtoken");
var config_constants_enum_1 = require("../../../../../../../../../../src/shared/constants/config.constants.enum");
var generic_error_messages_enum_1 = require("../../../../../../../../../../src/shared/constants/generic-error-messages.enum");
var error_codes_enum_1 = require("../../../../../../../../../../src/shared/errors/error-codes.enum");
var uuid_1 = require("uuid");
var TokenService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TokenService = _classThis = /** @class */ (function () {
        function TokenService_1() {
        }
        TokenService_1.prototype.validateToken = function (token) {
            return new Promise(function (resolve, reject) {
                if (!token)
                    return reject(new Error('Token is missing'));
                var secret = process.env.JWT_SECRET;
                if (!secret) {
                    throw new Error(generic_error_messages_enum_1.GenericErrorMessages.JWT_ENV_TOKEN_MISSING);
                }
                jwt.verify(token, secret, function (err, decoded) {
                    if (err) {
                        return reject(new Error(JSON.stringify({
                            status: error_codes_enum_1.ErrorCodesEnum.UNAUTHORIZED,
                            printMessage: generic_error_messages_enum_1.GenericErrorMessages.INVALID_JWT_TOKEN,
                        })));
                    }
                    resolve(decoded);
                });
            });
        };
        TokenService_1.prototype.generateToken = function (payload, expiresIn) {
            if (expiresIn === void 0) { expiresIn = config_constants_enum_1.ConfigConstants.JWT_DEFAULT_EXPIREtIME; }
            var secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error(generic_error_messages_enum_1.GenericErrorMessages.JWT_ENV_TOKEN_MISSING);
            }
            return jwt.sign(payload, secret, { expiresIn: expiresIn });
        };
        TokenService_1.prototype.generateUUID = function (amount, isHexa) {
            if (isHexa === void 0) { isHexa = true; }
            if (amount && Number.isInteger(amount) && amount > 0) {
                return Array.from({ length: amount }, function () {
                    return isHexa
                        ? Math.floor(Math.random() * 16).toString(16)
                        : Math.floor(Math.random() * 10).toString();
                }).join('');
            }
            return (0, uuid_1.v4)();
        };
        return TokenService_1;
    }());
    __setFunctionName(_classThis, "TokenService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TokenService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TokenService = _classThis;
}();
exports.TokenService = TokenService;
