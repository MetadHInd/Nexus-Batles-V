/**
 * MockPaymentGateway.ts — Infrastructure / Gateway
 * Pasarela simulada para desarrollo y testing.
 * Siempre aprueba pagos sin llamadas externas.
 */
import type { IPaymentGateway, CreatePaymentInput } from '../../application/ports/IPaymentGateway';
import type { GatewayPaymentResult, GatewayRefundResult, GatewayStatusResult } from '../../payments/domain/entities/PaymentEntities';
import type { GatewayName } from '../../payments/constants/payments.constants';
export declare class MockPaymentGateway implements IPaymentGateway {
    getGatewayName(): GatewayName;
    createPayment(input: CreatePaymentInput): Promise<GatewayPaymentResult>;
    verifyWebhook(_rawBody: Buffer | string, _signature: string): Promise<{
        valid: boolean;
        event: Record<string, unknown>;
    }>;
    getPaymentStatus(gatewayTransactionId: string): Promise<GatewayStatusResult>;
    refund(gatewayTransactionId: string, amount?: number): Promise<GatewayRefundResult>;
}
//# sourceMappingURL=MockPaymentGateway.d.ts.map