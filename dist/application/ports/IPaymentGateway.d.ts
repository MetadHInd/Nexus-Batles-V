import type { GatewayName } from '../../payments/constants/payments.constants';
import type { BuyerInfo, GatewayPaymentResult, GatewayRefundResult, GatewayStatusResult } from '../../payments/domain/entities/PaymentEntities';
export interface CreatePaymentInput {
    orderId: string;
    totalAmount: number;
    currency: string;
    description: string;
    idempotencyKey: string;
    buyer: BuyerInfo;
    items: Array<{
        title: string;
        quantity: number;
        unitPrice: number;
    }>;
}
export interface PaymentIntentInput {
    amount: number;
    currency: string;
    playerId: string;
    description: string;
    metadata?: Record<string, string>;
}
export interface PaymentIntent {
    intentId: string;
    clientSecret: string;
    amount: number;
    currency: string;
}
export interface PaymentResult {
    transactionId: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    amount: number;
}
export interface IPaymentGateway {
    getGatewayName(): GatewayName;
    createPayment(input: CreatePaymentInput): Promise<GatewayPaymentResult>;
    verifyWebhook(rawBody: Buffer | string, signature: string): Promise<{
        valid: boolean;
        event: Record<string, unknown> | null;
    }>;
    getPaymentStatus(gatewayTransactionId: string): Promise<GatewayStatusResult>;
    refund(gatewayTransactionId: string, amount?: number, reason?: string): Promise<GatewayRefundResult>;
    createPaymentIntent?(input: PaymentIntentInput): Promise<PaymentIntent>;
    confirmPayment?(intentId: string): Promise<PaymentResult>;
    validateWebhookSignature?(payload: Buffer, signature: string): boolean;
    getTransactionStatus?(transactionId: string): Promise<PaymentResult>;
}
