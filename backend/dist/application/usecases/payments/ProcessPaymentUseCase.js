"use strict";
/**
 * ProcessPaymentUseCase.ts — Application / Use Cases / Payments
 * Inicia el proceso de pago con la pasarela elegida.
 * Patrón: commit antes de llamada externa + manejo de error de pasarela.
 * Migrado desde Imperial Guard (JS) → TypeScript para Nexus Battles.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessPaymentUseCase = void 0;
const payments_constants_1 = require("../../../payments/constants/payments.constants");
const logger_1 = require("../../../infrastructure/logging/logger");
class ProcessPaymentUseCase {
    constructor(repository, gateway) {
        this.repository = repository;
        this.gateway = gateway;
    }
    async execute(input) {
        const { orderId, userId, buyerInfo } = input;
        const conn = await this.repository.beginTransaction();
        try {
            // ── 1. Lock orden (evita race conditions) ────────────────────────────────
            const order = await this.repository.lockOrder(orderId, conn);
            if (!order)
                throw this._error('ORDER_NOT_FOUND', 'Orden no encontrada', 404);
            if (order.user_id !== userId)
                throw this._error('FORBIDDEN', 'No autorizado', 403);
            if (order.status !== payments_constants_1.ORDER_STATUS.PENDING)
                throw this._error('ORDER_NOT_PENDING', `La orden está en estado ${order.status}`, 409);
            // ── 2. Transición a PROCESSING ────────────────────────────────────────────
            await this.repository.updateOrderStatus(orderId, payments_constants_1.ORDER_STATUS.PROCESSING, conn);
            await this.repository.createAuditLog({
                entityType: 'ORDER', entityId: orderId,
                action: payments_constants_1.AUDIT_ACTIONS.ORDER_STATUS_CHANGED,
                previousStatus: payments_constants_1.ORDER_STATUS.PENDING,
                newStatus: payments_constants_1.ORDER_STATUS.PROCESSING,
                actorId: userId,
                metadata: { gateway: this.gateway.getGatewayName() },
            }, conn);
            // ── 3. Crear transacción en estado INITIATED ───────────────────────────
            const { transactionId } = await this.repository.createTransaction({
                orderId,
                gatewayName: this.gateway.getGatewayName(),
                gatewayOrderId: null,
                status: payments_constants_1.TRANSACTION_STATUS.INITIATED,
                amount: order.total_amount,
                currency: order.currency,
                gatewayRawResponse: {},
            }, conn);
            await this.repository.createAuditLog({
                entityType: 'TRANSACTION', entityId: transactionId,
                action: payments_constants_1.AUDIT_ACTIONS.TRANSACTION_CREATED,
                previousStatus: null,
                newStatus: payments_constants_1.TRANSACTION_STATUS.INITIATED,
                actorId: userId,
                metadata: { orderId, gateway: this.gateway.getGatewayName() },
            }, conn);
            // ── 4. Commit ANTES de llamar a la pasarela (no bloquear con TX abierta) ─
            await this.repository.commit(conn);
            // ── 5. Llamar pasarela (fuera de TX) ──────────────────────────────────────
            let gatewayResult;
            try {
                gatewayResult = await this.gateway.createPayment({
                    orderId,
                    totalAmount: order.total_amount,
                    currency: order.currency,
                    description: `Nexus Battles — Orden ${orderId}`,
                    idempotencyKey: order.idempotency_key,
                    buyer: buyerInfo,
                    items: [{
                            title: `Producto #${order.product_id}`,
                            quantity: 1,
                            unitPrice: order.total_amount,
                        }],
                });
            }
            catch (gatewayErr) {
                await this._handleGatewayError(transactionId, orderId, userId, gatewayErr);
                throw this._error('GATEWAY_ERROR', 'Error al procesar el pago en la pasarela', 502);
            }
            // ── 6. Actualizar transacción con datos de pasarela ───────────────────────
            const conn2 = await this.repository.beginTransaction();
            try {
                await this.repository.updateTransactionStatus(transactionId, payments_constants_1.TRANSACTION_STATUS.PENDING, gatewayResult.rawResponse, conn2);
                // Guardar gateway_order_id necesario para procesar el webhook
                await conn2.execute('UPDATE payment_transactions SET gateway_order_id = ? WHERE transaction_id = ?', [gatewayResult.gatewayOrderId, transactionId]);
                await this.repository.commit(conn2);
            }
            catch (e) {
                await this.repository.rollback(conn2);
                throw e;
            }
            logger_1.logger.info('ProcessPayment: payment initiated', {
                orderId, transactionId,
                gateway: this.gateway.getGatewayName(),
                gatewayOrderId: gatewayResult.gatewayOrderId,
            });
            return {
                orderId,
                transactionId,
                gatewayOrderId: gatewayResult.gatewayOrderId,
                redirectUrl: gatewayResult.redirectUrl,
                clientSecret: gatewayResult.clientSecret,
                gateway: this.gateway.getGatewayName(),
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
    async _handleGatewayError(transactionId, orderId, userId, gatewayErr) {
        const conn = await this.repository.beginTransaction();
        try {
            await this.repository.updateTransactionStatus(transactionId, payments_constants_1.TRANSACTION_STATUS.ERROR, { error: gatewayErr.message, gatewayError: gatewayErr.gatewayError }, conn);
            await this.repository.updateOrderStatus(orderId, payments_constants_1.ORDER_STATUS.FAILED, conn);
            await this.repository.createAuditLog({
                entityType: 'TRANSACTION', entityId: transactionId,
                action: payments_constants_1.AUDIT_ACTIONS.TX_STATUS_CHANGED,
                previousStatus: payments_constants_1.TRANSACTION_STATUS.INITIATED,
                newStatus: payments_constants_1.TRANSACTION_STATUS.ERROR,
                actorId: userId,
                metadata: { error: gatewayErr.message },
            }, conn);
            await this.repository.commit(conn);
        }
        catch (e) {
            await this.repository.rollback(conn);
            logger_1.logger.error('ProcessPayment: failed to record gateway error', { error: e.message });
        }
    }
    _error(code, message, statusCode) {
        const err = new Error(message);
        err.code = code;
        err.statusCode = statusCode;
        return err;
    }
}
exports.ProcessPaymentUseCase = ProcessPaymentUseCase;
//# sourceMappingURL=ProcessPaymentUseCase.js.map