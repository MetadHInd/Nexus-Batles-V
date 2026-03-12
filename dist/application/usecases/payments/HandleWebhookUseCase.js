"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleWebhookUseCase = void 0;
const payments_constants_1 = require("../../../payments/constants/payments.constants");
const logger_1 = require("../../../infrastructure/logging/logger");
class HandleWebhookUseCase {
    repository;
    gateway;
    constructor(repository, gateway) {
        this.repository = repository;
        this.gateway = gateway;
    }
    async execute(input) {
        const { rawBody, signature, ipAddress } = input;
        const { valid, event } = await this.gateway.verifyWebhook(rawBody, signature);
        if (!valid || !event) {
            logger_1.logger.warn('HandleWebhook: invalid signature', {
                gateway: this.gateway.getGatewayName(), ipAddress,
            });
            throw this._error('INVALID_WEBHOOK_SIGNATURE', 'Firma de webhook inválida', 401);
        }
        logger_1.logger.info('HandleWebhook: valid event received', {
            gateway: this.gateway.getGatewayName(),
            type: event['type'] ?? event['action'],
        });
        const gatewayOrderId = this._extractGatewayOrderId(event);
        if (!gatewayOrderId) {
            logger_1.logger.warn('HandleWebhook: no gatewayOrderId found', { event });
            return { processed: false, reason: 'NO_GATEWAY_ORDER_ID' };
        }
        const tx = await this.repository.findTransactionByGatewayOrderId(gatewayOrderId);
        if (!tx) {
            logger_1.logger.warn('HandleWebhook: transaction not found', { gatewayOrderId });
            return { processed: false, reason: 'TX_NOT_FOUND' };
        }
        const { status: gatewayStatus, rawResponse } = await this.gateway.getPaymentStatus(gatewayOrderId);
        const conn = await this.repository.beginTransaction();
        try {
            const order = await this.repository.lockOrder(tx.order_id, conn);
            if (!order) {
                await this.repository.rollback(conn);
                return { processed: false, reason: 'ORDER_NOT_FOUND' };
            }
            if ([payments_constants_1.ORDER_STATUS.PAID, payments_constants_1.ORDER_STATUS.REFUNDED].includes(order.status)) {
                await this.repository.rollback(conn);
                return { processed: true, reason: 'ALREADY_PROCESSED', orderId: order.order_id };
            }
            if (gatewayStatus === payments_constants_1.TRANSACTION_STATUS.APPROVED) {
                await this._confirmPayment(order, tx, rawResponse, conn);
            }
            else if (gatewayStatus === payments_constants_1.TRANSACTION_STATUS.REJECTED ||
                gatewayStatus === payments_constants_1.TRANSACTION_STATUS.ERROR) {
                await this._failPayment(order, tx, rawResponse, conn);
            }
            else {
                await this.repository.updateTransactionStatus(tx.transaction_id, gatewayStatus, rawResponse, conn);
            }
            await this.repository.createAuditLog({
                entityType: 'TRANSACTION', entityId: tx.transaction_id,
                action: payments_constants_1.AUDIT_ACTIONS.WEBHOOK_RECEIVED,
                previousStatus: tx.status,
                newStatus: gatewayStatus,
                actorId: 'WEBHOOK',
                metadata: {
                    gateway: this.gateway.getGatewayName(),
                    gatewayOrderId,
                    ipAddress,
                },
            }, conn);
            await this.repository.commit(conn);
            return { processed: true, orderId: order.order_id, newStatus: gatewayStatus };
        }
        catch (err) {
            await this.repository.rollback(conn);
            logger_1.logger.error('HandleWebhook: error processing', { error: err.message });
            throw err;
        }
    }
    async _confirmPayment(order, tx, rawResponse, conn) {
        await this.repository.updateTransactionStatus(tx.transaction_id, payments_constants_1.TRANSACTION_STATUS.APPROVED, rawResponse, conn);
        await this.repository.updateOrderStatus(order.order_id, payments_constants_1.ORDER_STATUS.PAID, conn);
        await this.repository.assignProductToUser(order.order_id, order.user_id, order.product_id, conn);
        await this.repository.createAuditLog({
            entityType: 'ORDER', entityId: order.order_id,
            action: payments_constants_1.AUDIT_ACTIONS.ORDER_STATUS_CHANGED,
            previousStatus: order.status,
            newStatus: payments_constants_1.ORDER_STATUS.PAID,
            actorId: 'WEBHOOK',
            metadata: { transactionId: tx.transaction_id },
        }, conn);
        await this.repository.createAuditLog({
            entityType: 'INVENTORY', entityId: order.order_id,
            action: payments_constants_1.AUDIT_ACTIONS.INVENTORY_ASSIGNED,
            previousStatus: null,
            newStatus: 'ACTIVE',
            actorId: 'WEBHOOK',
            metadata: { productId: order.product_id, userId: order.user_id },
        }, conn);
        logger_1.logger.info('HandleWebhook: payment confirmed', { orderId: order.order_id });
    }
    async _failPayment(order, tx, rawResponse, conn) {
        await this.repository.updateTransactionStatus(tx.transaction_id, payments_constants_1.TRANSACTION_STATUS.REJECTED, rawResponse, conn);
        await this.repository.updateOrderStatus(order.order_id, payments_constants_1.ORDER_STATUS.FAILED, conn);
        await this.repository.releaseProductReservation(order.product_id, order.user_id, conn);
        await this.repository.createAuditLog({
            entityType: 'ORDER', entityId: order.order_id,
            action: payments_constants_1.AUDIT_ACTIONS.ORDER_STATUS_CHANGED,
            previousStatus: order.status,
            newStatus: payments_constants_1.ORDER_STATUS.FAILED,
            actorId: 'WEBHOOK',
            metadata: { transactionId: tx.transaction_id },
        }, conn);
        logger_1.logger.warn('HandleWebhook: payment failed', { orderId: order.order_id });
    }
    _extractGatewayOrderId(event) {
        const mpId = event?.['data']?.['id'];
        if (mpId)
            return String(mpId);
        const stripeId = event?.['data']?.['object']?.['id'];
        if (stripeId)
            return stripeId;
        if (event?.['gatewayOrderId'])
            return event['gatewayOrderId'];
        return null;
    }
    _error(code, message, statusCode) {
        const err = new Error(message);
        err.code = code;
        err.statusCode = statusCode;
        return err;
    }
}
exports.HandleWebhookUseCase = HandleWebhookUseCase;
//# sourceMappingURL=HandleWebhookUseCase.js.map