"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idempotencyRequired = idempotencyRequired;
exports.paymentRateLimiter = paymentRateLimiter;
exports.antiFraud = antiFraud;
const payments_constants_1 = require("../../../payments/constants/payments.constants");
function idempotencyRequired(req, res, next) {
    const key = req.headers['x-idempotency-key'] ??
        req.body?.idempotencyKey;
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
const rateStore = new Map();
function paymentRateLimiter(options = {}) {
    const windowMs = options.windowMs ?? payments_constants_1.PAYMENT_LIMITS.RATE_LIMIT_WINDOW_MS;
    const maxReq = options.max ?? payments_constants_1.PAYMENT_LIMITS.RATE_LIMIT_MAX_REQ;
    return (req, res, next) => {
        const key = `${req.ip}:${req.path}`;
        const now = Date.now();
        let record = rateStore.get(key);
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
const BLOCKED_IPS = new Set((process.env.FRAUD_BLOCKED_IPS ?? '').split(',').filter(Boolean));
const failureStore = new Map();
function antiFraud(req, res, next) {
    const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';
    if (BLOCKED_IPS.has(ip)) {
        res.status(403).json({
            success: false,
            error: 'FRAUD_BLOCKED',
            message: 'Acceso denegado',
        });
        return;
    }
    const now = Date.now();
    const window = 10 * 60 * 1000;
    let record = failureStore.get(ip);
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
    req.registerPaymentFailure = () => {
        record.count++;
        failureStore.set(ip, record);
    };
    req.clientIp = ip;
    next();
}
//# sourceMappingURL=paymentMiddlewares.js.map