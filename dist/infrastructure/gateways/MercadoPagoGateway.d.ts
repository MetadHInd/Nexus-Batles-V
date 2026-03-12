import type { IPaymentGateway, CreatePaymentInput } from '../../application/ports/IPaymentGateway';
import type { GatewayPaymentResult, GatewayRefundResult, GatewayStatusResult } from '../../payments/domain/entities/PaymentEntities';
import type { GatewayName } from '../../payments/constants/payments.constants';
interface MercadoPagoConfig {
    accessToken: string;
    webhookSecret: string;
}
export declare class MercadoPagoGateway implements IPaymentGateway {
    private readonly accessToken;
    private readonly webhookSecret;
    constructor(config: MercadoPagoConfig);
    getGatewayName(): GatewayName;
    createPayment(input: CreatePaymentInput): Promise<GatewayPaymentResult>;
    verifyWebhook(rawBody: Buffer | string, signature: string): Promise<{
        valid: boolean;
        event: Record<string, unknown> | null;
    }>;
    getPaymentStatus(gatewayTransactionId: string): Promise<GatewayStatusResult>;
    refund(gatewayTransactionId: string, amount?: number, _reason?: string): Promise<GatewayRefundResult>;
    private _request;
}
export {};
