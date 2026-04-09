"use strict";
/**
 * PaymentController.ts — Infrastructure / Controllers
 * Orquesta los use cases de pagos.
 * Recibe HTTP, delega en use cases y responde.
 * Migrado desde Imperial Guard (JS) → TypeScript para Nexus Battles.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = exports.PaymentController = void 0;
const MySQLPaymentRepository_1 = require("../../repositories/MySQLPaymentRepository");
const gateway_factory_1 = require("../../factories/gateway.factory");
const CreateOrderUseCase_1 = require("../../../application/usecases/payments/CreateOrderUseCase");
const ProcessPaymentUseCase_1 = require("../../../application/usecases/payments/ProcessPaymentUseCase");
const RefundPaymentUseCase_1 = require("../../../application/usecases/payments/RefundPaymentUseCase");
const HandleWebhookUseCase_1 = require("../../../application/usecases/payments/HandleWebhookUseCase");
const logger_1 = require("../../logging/logger");
class PaymentController {
    // ── POST /api/v1/payments/orders ─────────────────────────────────────────────
    async createOrder(req, res, next) {
        try {
            const useCase = new CreateOrderUseCase_1.CreateOrderUseCase(MySQLPaymentRepository_1.paymentRepository);
            const result = await useCase.execute({
                userId: req.user.id,
                productId: req.body.productId,
                currency: req.body.currency,
                countryCode: req.body.countryCode,
                idempotencyKey: req.body.idempotencyKey,
                buyerInfo: req.body.buyerInfo,
                promoCode: req.body.promoCode,
            });
            res.status(result.idempotent ? 200 : 201).json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
    // ── POST /api/v1/payments/orders/:orderId/pay ─────────────────────────────────
    async processPayment(req, res, next) {
        try {
            const gatewayName = req.body.gateway ?? process.env.DEFAULT_PAYMENT_GATEWAY;
            const gateway = (0, gateway_factory_1.createGateway)(gatewayName);
            const useCase = new ProcessPaymentUseCase_1.ProcessPaymentUseCase(MySQLPaymentRepository_1.paymentRepository, gateway);
            const result = await useCase.execute({
                orderId: req.params.orderId,
                userId: req.user.id,
                buyerInfo: req.body.buyerInfo,
            });
            res.status(200).json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
    // ── GET /api/v1/payments/orders/:orderId ──────────────────────────────────────
    async getOrderStatus(req, res, next) {
        try {
            const order = await MySQLPaymentRepository_1.paymentRepository.getOrderById(req.params.orderId);
            if (!order) {
                res.status(404).json({ success: false, error: 'ORDER_NOT_FOUND' });
                return;
            }
            if (order.user_id !== req.user.id) {
                res.status(403).json({ success: false, error: 'FORBIDDEN' });
                return;
            }
            res.json({ success: true, data: order });
        }
        catch (err) {
            next(err);
        }
    }
    // ── POST /api/v1/payments/orders/:orderId/refund ──────────────────────────────
    async refundPayment(req, res, next) {
        try {
            const gateway = (0, gateway_factory_1.createGateway)(req.body.gateway ?? process.env.DEFAULT_PAYMENT_GATEWAY);
            const useCase = new RefundPaymentUseCase_1.RefundPaymentUseCase(MySQLPaymentRepository_1.paymentRepository, gateway);
            const result = await useCase.execute({
                orderId: req.params.orderId,
                userId: req.user.id,
                amount: req.body.amount,
                reason: req.body.reason,
                requestedBy: req.user.id,
            });
            res.status(200).json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
    // ── POST /api/v1/payments/webhook?gateway=<name> ──────────────────────────────
    async webhook(req, res, _next) {
        try {
            const gatewayName = req.query['gateway'];
            if (!gatewayName) {
                res.status(400).json({ error: 'gateway query param required' });
                return;
            }
            const gateway = (0, gateway_factory_1.createGateway)(gatewayName);
            const useCase = new HandleWebhookUseCase_1.HandleWebhookUseCase(MySQLPaymentRepository_1.paymentRepository, gateway);
            const signature = req.headers['x-signature'] ||
                req.headers['stripe-signature'] ||
                req.headers['x-hub-signature-256'] ||
                '';
            const result = await useCase.execute({
                rawBody: req.rawBody ?? '',
                signature,
                ipAddress: req.clientIp ?? req.ip ?? '',
            });
            // Siempre 200 rápido → evita reintentos infinitos de la pasarela
            res.status(200).json({ received: true, ...result });
        }
        catch (err) {
            if (err.code === 'INVALID_WEBHOOK_SIGNATURE') {
                res.status(401).json({ error: err.message });
                return;
            }
            logger_1.logger.error('WebhookController: unhandled error', { error: err.message });
            res.status(200).json({ received: true, processed: false });
        }
    }
}
exports.PaymentController = PaymentController;
exports.paymentController = new PaymentController();
//# sourceMappingURL=PaymentController.js.map