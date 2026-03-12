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
