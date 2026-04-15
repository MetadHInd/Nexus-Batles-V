"use strict";
/**
 * CreateOrderUseCase.ts — Application / Use Cases / Payments
 * Crea una orden de pago con idempotencia, límites diarios,
 * reserva de stock, impuestos y descuentos.
 * Migrado desde Imperial Guard (JS) → TypeScript para Nexus Battles.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderUseCase = void 0;
const Money_1 = require("../../../payments/domain/value-objects/Money");
const PricingRules_1 = require("../../../payments/domain/rules/PricingRules");
const payments_constants_1 = require("../../../payments/constants/payments.constants");
const logger_1 = require("../../../infrastructure/logging/logger");
class CreateOrderUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        const { userId, productId, currency, countryCode, idempotencyKey, promoCode } = input;
        // ── 1. Idempotencia ───────────────────────────────────────────────────────
        const existing = await this.repository.findTransactionByIdempotencyKey(idempotencyKey);
        if (existing) {
            logger_1.logger.info('CreateOrder: idempotency hit', { idempotencyKey });
            const order = await this.repository.getOrderById(existing.order_id);
            if (!order)
                throw this._error('ORDER_NOT_FOUND', 'Orden idempotente no encontrada', 404);
            return {
                orderId: order.order_id,
                idempotent: true,
                amounts: {
                    base: order.base_amount / 100,
                    tax: order.tax_amount / 100,
                    discount: order.discount_amount / 100,
                    total: order.total_amount / 100,
                    currency: order.currency,
                },
            };
        }
        // ── 2. Límite diario ──────────────────────────────────────────────────────
        const dailyCount = await this.repository.countUserOrdersToday(userId);
        if (dailyCount >= payments_constants_1.PAYMENT_LIMITS.MAX_DAILY_ORDERS) {
            throw this._error('DAILY_LIMIT_EXCEEDED', 'Has alcanzado el límite de órdenes diarias', 429);
        }
        const conn = await this.repository.beginTransaction();
        try {
            // ── 3. Reservar producto (precio viene de BD, nunca del cliente) ────────
            const { product, available } = await this.repository.reserveProductForUser(productId, userId, conn);
            if (!available) {
                await this.repository.rollback(conn);
                if (product?.alreadyOwned)
                    throw this._error('PRODUCT_ALREADY_OWNED', 'Ya posees este producto', 409);
                throw this._error('PRODUCT_UNAVAILABLE', 'Producto no disponible o sin stock', 422);
            }
            const baseAmount = new Money_1.Money(product.price_cents, currency);
            // ── 4. Impuestos ──────────────────────────────────────────────────────────
            const taxRule = await this.repository.getTaxRule(productId, countryCode);
            const taxAmount = PricingRules_1.PricingRules.calculateTax(baseAmount, taxRule);
            // ── 5. Promoción ──────────────────────────────────────────────────────────
            let promotionId = null;
            let discountAmount = Money_1.Money.zero(currency);
            if (promoCode) {
                const promotion = await this.repository.getValidPromotion(promoCode, productId, userId);
                if (!promotion)
                    throw this._error('INVALID_PROMO', 'Código promocional inválido o expirado', 422);
                promotionId = promotion.promotion_id;
                discountAmount = PricingRules_1.PricingRules.calculateDiscount(baseAmount, {
                    type: promotion.discount_type,
                    value: promotion.discount_value,
                });
            }
            // ── 6. Total ──────────────────────────────────────────────────────────────
            const totalAmount = PricingRules_1.PricingRules.calculateTotal(baseAmount, taxAmount, discountAmount);
            if (totalAmount.amountInCents < payments_constants_1.PAYMENT_LIMITS.MIN_AMOUNT_CENTS)
                throw this._error('AMOUNT_TOO_LOW', `Monto mínimo: $${payments_constants_1.PAYMENT_LIMITS.MIN_AMOUNT_CENTS / 100}`, 422);
            if (totalAmount.amountInCents > payments_constants_1.PAYMENT_LIMITS.MAX_AMOUNT_CENTS)
                throw this._error('AMOUNT_TOO_HIGH', 'Monto supera el límite permitido', 422);
            // ── 7. Crear orden ────────────────────────────────────────────────────────
            const { orderId } = await this.repository.createOrder({
                userId, productId,
                baseAmount: baseAmount.amountInCents,
                taxAmount: taxAmount.amountInCents,
                discountAmount: discountAmount.amountInCents,
                totalAmount: totalAmount.amountInCents,
                currency, idempotencyKey,
                promotionId,
            }, conn);
            // ── 8. Auditoría ──────────────────────────────────────────────────────────
            await this.repository.createAuditLog({
                entityType: 'ORDER',
                entityId: orderId,
                action: payments_constants_1.AUDIT_ACTIONS.ORDER_CREATED,
                previousStatus: null,
                newStatus: payments_constants_1.ORDER_STATUS.PENDING,
                actorId: userId,
                metadata: { productId, totalAmount: totalAmount.amountInCents, currency, promoCode },
            }, conn);
            await this.repository.commit(conn);
            logger_1.logger.info('CreateOrder: order created', {
                orderId, userId, total: totalAmount.toString(),
            });
            return {
                orderId,
                idempotent: false,
                amounts: {
                    base: baseAmount.toDecimal(),
                    tax: taxAmount.toDecimal(),
                    discount: discountAmount.toDecimal(),
                    total: totalAmount.toDecimal(),
                    currency,
                },
            };
        }
        catch (err) {
            try {
                await this.repository.rollback(conn);
            }
            catch (_) { }
            throw err;
        }
    }
    _error(code, message, statusCode) {
        const err = new Error(message);
        err.code = code;
        err.statusCode = statusCode;
        return err;
    }
}
exports.CreateOrderUseCase = CreateOrderUseCase;
//# sourceMappingURL=CreateOrderUseCase.js.map