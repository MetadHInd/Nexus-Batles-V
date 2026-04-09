"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sensitiveOperationsLimiter = exports.authLimiter = exports.generalLimiter = exports.inventoryLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("../../../config/env");
const isDevelopment = env_1.env.NODE_ENV === 'development';
exports.inventoryLimiter = isDevelopment
    ? (req, res, next) => next()
    : (0, express_rate_limit_1.default)({
        windowMs: 60 * 1000,
        max: 120,
        message: { error: 'Demasiadas solicitudes al inventario. Espera un momento.' },
        standardHeaders: true,
        legacyHeaders: false,
        skipFailedRequests: true,
    });
exports.generalLimiter = isDevelopment
    ? (req, res, next) => next()
    : (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Demasiadas peticiones, intenta de nuevo más tarde',
        standardHeaders: true,
        legacyHeaders: false,
    });
exports.authLimiter = isDevelopment
    ? (req, res, next) => next()
    : (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 50,
        message: 'Demasiados intentos de login',
        skipSuccessfulRequests: true,
    });
exports.sensitiveOperationsLimiter = isDevelopment
    ? (req, res, next) => next()
    : (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 30,
        message: 'Límite de operaciones sensibles alcanzado',
    });
//# sourceMappingURL=rateLimiter.middleware.js.map