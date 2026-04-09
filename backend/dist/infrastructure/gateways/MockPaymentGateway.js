"use strict";
/**
 * MockPaymentGateway.ts — Infrastructure / Gateway
 * Pasarela simulada para desarrollo y testing.
 * Siempre aprueba pagos sin llamadas externas.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockPaymentGateway = void 0;
const crypto_1 = require("crypto");
const payments_constants_1 = require("../../payments/constants/payments.constants");
class MockPaymentGateway {
    getGatewayName() { return 'mock'; }
    async createPayment(input) {
        const gatewayOrderId = `MOCK-${(0, crypto_1.randomUUID)()}`;
        return {
            gatewayOrderId,
            redirectUrl: `http://localhost:5173/payments/mock-checkout?order=${gatewayOrderId}`,
            rawResponse: { mock: true, orderId: input.orderId, gatewayOrderId },
        };
    }
    async verifyWebhook(_rawBody, _signature) {
        // En mock siempre válido
        return { valid: true, event: { mock: true, gatewayOrderId: `MOCK-${(0, crypto_1.randomUUID)()}` } };
    }
    async getPaymentStatus(gatewayTransactionId) {
        return {
            status: payments_constants_1.TRANSACTION_STATUS.APPROVED,
            rawResponse: { mock: true, gatewayTransactionId },
        };
    }
    async refund(gatewayTransactionId, amount) {
        return {
            refundId: `REFUND-MOCK-${(0, crypto_1.randomUUID)()}`,
            status: 'approved',
            rawResponse: { mock: true, gatewayTransactionId, amount },
        };
    }
}
exports.MockPaymentGateway = MockPaymentGateway;
//# sourceMappingURL=MockPaymentGateway.js.map