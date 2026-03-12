"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const hmacMiddleware_1 = require("../middlewares/hmacMiddleware");
const paymentMiddlewares_1 = require("../middlewares/paymentMiddlewares");
const PaymentController_1 = require("../../controllers/PaymentController");
const router = (0, express_1.Router)();
const createOrderSchema = zod_1.z.object({
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
const processPaymentSchema = zod_1.z.object({
    gateway: zod_1.z.enum(['mercadopago', 'stripe', 'mock']).optional(),
    buyerInfo: zod_1.z.object({
        email: zod_1.z.string().email(),
        name: zod_1.z.string().min(2).max(100),
    }),
});
const refundSchema = zod_1.z.object({
    amount: zod_1.z.number().int().positive().optional(),
    reason: zod_1.z.string().max(255),
    gateway: zod_1.z.enum(['mercadopago', 'stripe', 'mock']).optional(),
});
router.post('/webhook', hmacMiddleware_1.hmacMiddleware, paymentMiddlewares_1.antiFraud, PaymentController_1.paymentController.webhook.bind(PaymentController_1.paymentController));
router.use(authMiddleware_1.authMiddleware);
router.use((0, paymentMiddlewares_1.paymentRateLimiter)());
router.use(paymentMiddlewares_1.antiFraud);
router.post('/orders', paymentMiddlewares_1.idempotencyRequired, (0, validateMiddleware_1.validate)(createOrderSchema), PaymentController_1.paymentController.createOrder.bind(PaymentController_1.paymentController));
router.post('/orders/:orderId/pay', (0, validateMiddleware_1.validate)(processPaymentSchema), PaymentController_1.paymentController.processPayment.bind(PaymentController_1.paymentController));
router.get('/orders/:orderId', PaymentController_1.paymentController.getOrderStatus.bind(PaymentController_1.paymentController));
router.post('/orders/:orderId/refund', (0, validateMiddleware_1.validate)(refundSchema), PaymentController_1.paymentController.refundPayment.bind(PaymentController_1.paymentController));
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map