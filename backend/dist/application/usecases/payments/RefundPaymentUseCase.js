"use strict";
/**
 * RefundPaymentUseCase.ts — Application / Use Cases / Payments
 * Procesa reembolsos totales o parciales con auditoría completa.
 * Migrado desde Imperial Guard (JS) → TypeScript para Nexus Battles.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundPaymentUseCase = void 0;
const payments_constants_1 = require("../../../payments/constants/payments.constants");
const logger_1 = require("../../../infrastructure/logging/logger");
class RefundPaymentUseCase {
    constructor(repository, gateway) {
        this.repository = repository;
        this.gateway = gateway;
    }
    async execute(input) {
        const { orderId, userId, amount, reason, requestedBy } = input;
        const conn = await this.repository.beginTransaction();
        try {
            // ── 1. Lock y validar orden ───────────────────────────────────────────────
            const order = await this.repository.lockOrder(orderId, conn);
            if (!order)
                throw this._error('ORDER_NOT_FOUND', 'Orden no encontrada', 404);
            if (order.user_id !== userId)
                throw this._error('FORBIDDEN', 'No autorizado', 403);
            if (order.status !== payments_constants_1.ORDER_STATUS.PAID)
                throw this._error('NOT_REFUNDABLE', `Orden en estado ${order.status} no es reembolsable`, 409);
            // ── 2. Obtener transacción aprobada ───────────────────────────────────────
            const tx = await this.repository.getTransactionByOrderId(orderId, conn);
            if (!tx || tx.status !== payments_constants_1.TRANSACTION_STATUS.APPROVED)
                throw this._error('TX_NOT_FOUND', 'Transacción aprobada no encontrada', 404);
            const refundAmount = amount ?? order.total_amount;
            // ── 3. Commit parcial antes de llamar pasarela ────────────────────────────
            await this.repository.commit(conn);
            // ── 4. Reembolso en pasarela ──────────────────────────────────────────────
            const refundResult = await this.gateway.refund(tx.gateway_order_id, refundAmount, reason);
            // ── 5. Registrar en BD (operación atómica separada) ──────────────────────
            const conn2 = await this.repository.beginTransaction();
            try {
                const { refundId } = await this.repository.createRefund({
                    transactionId: tx.transaction_id,
                    orderId,
                    amount: refundAmount,
                    reason,
                    gatewayRefundId: refundResult.refundId,
                    requestedBy: requestedBy ?? userId,
                }, conn2);
                await this.repository.updateOrderStatus(orderId, payments_constants_1.ORDER_STATUS.REFUNDED, conn2);
                await this.repository.updateTransactionStatus(tx.transaction_id, payments_constants_1.TRANSACTION_STATUS.REFUNDED, refundResult.rawResponse, conn2);
                await this.repository.createAuditLog({
                    entityType: 'ORDER',
                    entityId: orderId,
                    action: payments_constants_1.AUDIT_ACTIONS.REFUND_COMPLETED,
                    previousStatus: payments_constants_1.ORDER_STATUS.PAID,
                    newStatus: payments_constants_1.ORDER_STATUS.REFUNDED,
                    actorId: requestedBy ?? userId,
                    metadata: {
                        orderId, refundId,
                        amount: refundAmount,
                        reason,
                        gatewayRefundId: refundResult.refundId,
                    },
                }, conn2);
                await this.repository.commit(conn2);
                logger_1.logger.info('RefundPayment: refund completed', { orderId, refundId, refundAmount });
                return { refundId, orderId, amount: refundAmount, status: 'COMPLETED' };
            }
            catch (e) {
                await this.repository.rollback(conn2);
                throw e;
            }
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
exports.RefundPaymentUseCase = RefundPaymentUseCase;
//# sourceMappingURL=RefundPaymentUseCase.js.map