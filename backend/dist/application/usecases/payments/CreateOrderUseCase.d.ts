/**
 * CreateOrderUseCase.ts — Application / Use Cases / Payments
 * Crea una orden de pago con idempotencia, límites diarios,
 * reserva de stock, impuestos y descuentos.
 * Migrado desde Imperial Guard (JS) → TypeScript para Nexus Battles.
 */
import type { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
export interface CreateOrderInput {
    userId: number;
    productId: string;
    currency: string;
    countryCode: string;
    idempotencyKey: string;
    buyerInfo: {
        email: string;
        name: string;
    };
    promoCode?: string;
}
export interface CreateOrderResult {
    orderId: string;
    idempotent: boolean;
    amounts: {
        base: number;
        tax: number;
        discount: number;
        total: number;
        currency: string;
    };
}
export declare class CreateOrderUseCase {
    private readonly repository;
    constructor(repository: IPaymentRepository);
    execute(input: CreateOrderInput): Promise<CreateOrderResult>;
    private _error;
}
//# sourceMappingURL=CreateOrderUseCase.d.ts.map