import type { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import type { IPaymentGateway } from '../../ports/IPaymentGateway';
export interface HandleWebhookInput {
    rawBody: Buffer | string;
    signature: string;
    ipAddress: string;
}
export interface HandleWebhookResult {
    processed: boolean;
    reason?: string;
    orderId?: string;
    newStatus?: string;
}
export declare class HandleWebhookUseCase {
    private readonly repository;
    private readonly gateway;
    constructor(repository: IPaymentRepository, gateway: IPaymentGateway);
    execute(input: HandleWebhookInput): Promise<HandleWebhookResult>;
    private _confirmPayment;
    private _failPayment;
    private _extractGatewayOrderId;
    private _error;
}
