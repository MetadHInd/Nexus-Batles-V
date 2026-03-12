import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { IInventoryRepository } from '../../../domain/repositories/IInventoryRepository';
import { IPaymentGateway } from '../../ports/IPaymentGateway';
export declare class ProcessPaymentWebhookUseCase {
    private readonly paymentRepository;
    private readonly inventoryRepository;
    private readonly paymentGateway;
    constructor(paymentRepository: IPaymentRepository, inventoryRepository: IInventoryRepository, paymentGateway: IPaymentGateway);
    execute(payload: Buffer, signature: string, event: Record<string, unknown>): Promise<{
        id: string;
        status: string;
    } | {
        processed: boolean;
        externalId: string;
    }>;
}
