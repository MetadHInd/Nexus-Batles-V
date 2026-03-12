import type { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import type { IPaymentGateway } from '../../ports/IPaymentGateway';
export interface ProcessPaymentInput {
    orderId: string;
    userId: number;
    buyerInfo: {
        email: string;
        name: string;
    };
}
export interface ProcessPaymentResult {
    orderId: string;
    transactionId: string;
    gatewayOrderId: string;
    redirectUrl?: string;
    clientSecret?: string;
    gateway: string;
}
export declare class ProcessPaymentUseCase {
    private readonly repository;
    private readonly gateway;
    constructor(repository: IPaymentRepository, gateway: IPaymentGateway);
    execute(input: ProcessPaymentInput): Promise<ProcessPaymentResult>;
    private _handleGatewayError;
    private _error;
}
