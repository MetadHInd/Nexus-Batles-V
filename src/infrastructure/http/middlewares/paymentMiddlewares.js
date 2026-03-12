"use strict";
/**
 * paymentMiddlewares.ts
 * Middlewares específicos del módulo de pagos:
 *   - idempotencyRequired
 *   - paymentRateLimiter
 *   - antiFraud
 * Migrados desde Imperial Guard (JS) → TypeScript para Nexus Battles.
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.idempotencyRequired = idempotencyRequired;
exports.paymentRateLimiter = paymentRateLimiter;
exports.antiFraud = antiFraud;
var payments_constants_1 = require("../../../payments/constants/payments.constants");
// ─── Idempotencia ─────────────────────────────────────────────────────────────
function idempotencyRequired(req, res, next) {
    var _a, _b;
    var key = (_a = req.headers['x-idempotency-key']) !== null && _a !== void 0 ? _a : (_b = req.body) === null || _b === void 0 ? void 0 : _b.idempotencyKey;
    if (!key || key.length < 16) {
        res.status(400).json({
            success: false,
            error: 'IDEMPOTENCY_KEY_REQUIRED',
            message: 'Se requiere el header X-Idempotency-Key (mín. 16 caracteres)',
        });
        return;
    }
    req.body.idempotencyKey = key;
    next();
}
var rateStore = new Map();
function paymentRateLimiter(options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    var windowMs = (_a = options.windowMs) !== null && _a !== void 0 ? _a : payments_constants_1.PAYMENT_LIMITS.RATE_LIMIT_WINDOW_MS;
    var maxReq = (_b = options.max) !== null && _b !== void 0 ? _b : payments_constants_1.PAYMENT_LIMITS.RATE_LIMIT_MAX_REQ;
    return function (req, res, next) {
        var key = "".concat(req.ip, ":").concat(req.path);
        var now = Date.now();
        var record = rateStore.get(key);
        if (!record || now - record.windowStart > windowMs) {
            record = { count: 1, windowStart: now };
        }
        else {
            record.count++;
        }
        rateStore.set(key, record);
        res.setHeader('X-RateLimit-Limit', maxReq);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, maxReq - record.count));
        if (record.count > maxReq) {
            res.status(429).json({
                success: false,
                error: 'RATE_LIMIT_EXCEEDED',
                message: 'Demasiadas solicitudes. Intenta más tarde.',
                retryAfter: Math.ceil(windowMs / 1000),
            });
            return;
        }
        next();
    };
}
// ─── Anti Fraude (velocity check + IP block) ─────────────────────────────────
var BLOCKED_IPS = new Set(((_a = process.env.FRAUD_BLOCKED_IPS) !== null && _a !== void 0 ? _a : '').split(',').filter(Boolean));
var failureStore = new Map();
function antiFraud(req, res, next) {
    var _a, _b;
    var ip = (_b = (_a = req.ip) !== null && _a !== void 0 ? _a : req.socket.remoteAddress) !== null && _b !== void 0 ? _b : 'unknown';
    // 1. IP bloqueada permanentemente
    if (BLOCKED_IPS.has(ip)) {
        res.status(403).json({
            success: false,
            error: 'FRAUD_BLOCKED',
            message: 'Acceso denegado',
        });
        return;
    }
    // 2. Velocity check: > 3 fallos en 10 min = probable fraude
    var now = Date.now();
    var window = 10 * 60 * 1000;
    var record = failureStore.get(ip);
    if (!record || now - record.start > window) {
        record = { count: 0, start: now };
    }
    if (record.count >= 3) {
        res.status(429).json({
            success: false,
            error: 'FRAUD_VELOCITY_EXCEEDED',
            message: 'Actividad sospechosa detectada. Contacta soporte.',
        });
        return;
    }
    // Exponer función para que el controller registre un fallo
    req.registerPaymentFailure = function () {
        record.count++;
        failureStore.set(ip, record);
    };
    req.clientIp = ip;
    next();
}
