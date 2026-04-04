/**
 * RefundPaymentUseCase.ts — Application / Use Cases / Payments
 * Procesa reembolsos totales o parciales con auditoría completa.
 * Migrado desde Imperial Guard (JS) → TypeScript para Nexus Battles.
 */
import type { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import type { IPaymentGateway } from '../../ports/IPaymentGateway';
export interface RefundPaymentInput {
    orderId: string;
    userId: number;
    amount?: number;
    reason: string;
    requestedBy: number;
}
export interface RefundPaymentResult {
    refundId: string;
    orderId: string;
    amount: number;
    status: 'COMPLETED';
}
export declare class RefundPaymentUseCase {
    private readonly repository;
    private readonly gateway;
    constructor(repository: IPaymentRepository, gateway: IPaymentGateway);
    execute(input: RefundPaymentInput): Promise<RefundPaymentResult>;
    private _error;
}
//# sourceMappingURL=RefundPaymentUseCase.d.ts.map