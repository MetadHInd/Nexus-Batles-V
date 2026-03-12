"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var zod_1 = require("zod");
var validateMiddleware_1 = require("../middlewares/validateMiddleware");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var hmacMiddleware_1 = require("../middlewares/hmacMiddleware");
var paymentMiddlewares_1 = require("../middlewares/paymentMiddlewares");
var PaymentController_1 = require("../../controllers/PaymentController");
var router = (0, express_1.Router)();
var createOrderSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid(),
    currency: zod_1.z.string().length(3),
    countryCode: zod_1.z.string().length(2),
    idempotencyKey: zod_1.z.string().min(16).max(128),
    promoCode: zod_1.z.string().max(32).optional(),
    buyerInfo: zod_1.z.object({
        email: zod_1.z.string().email(),
        name: zod_1.z.string().min(2).max(100),
    }),
});
var processPaymentSchema = zod_1.z.object({
    gateway: zod_1.z.enum(['mercadopago', 'stripe', 'mock']).optional(),
    buyerInfo: zod_1.z.object({
        email: zod_1.z.string().email(),
        name: zod_1.z.string().min(2).max(100),
    }),
});
var refundSchema = zod_1.z.object({
    amount: zod_1.z.number().int().positive().optional(),
    reason: zod_1.z.string().max(255),
    gateway: zod_1.z.enum(['mercadopago', 'stripe', 'mock']).optional(),
});
// Webhook — verificación por firma HMAC, sin JWT
router.post('/webhook', hmacMiddleware_1.hmacMiddleware, paymentMiddlewares_1.antiFraud, PaymentController_1.paymentController.webhook.bind(PaymentController_1.paymentController));
// Rutas protegidas
router.use(authMiddleware_1.authMiddleware);
router.use((0, paymentMiddlewares_1.paymentRateLimiter)());
router.use(paymentMiddlewares_1.antiFraud);
router.post('/orders', paymentMiddlewares_1.idempotencyRequired, (0, validateMiddleware_1.validate)(createOrderSchema), PaymentController_1.paymentController.createOrder.bind(PaymentController_1.paymentController));
router.post('/orders/:orderId/pay', (0, validateMiddleware_1.validate)(processPaymentSchema), PaymentController_1.paymentController.processPayment.bind(PaymentController_1.paymentController));
router.get('/orders/:orderId', PaymentController_1.paymentController.getOrderStatus.bind(PaymentController_1.paymentController));
router.post('/orders/:orderId/refund', (0, validateMiddleware_1.validate)(refundSchema), PaymentController_1.paymentController.refundPayment.bind(PaymentController_1.paymentController));
exports.default = router;
