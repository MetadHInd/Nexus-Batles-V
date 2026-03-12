"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessPaymentWebhookUseCase = void 0;
const DomainError_1 = require("../../../domain/errors/DomainError");
class ProcessPaymentWebhookUseCase {
    paymentRepository;
    inventoryRepository;
    paymentGateway;
    constructor(paymentRepository, inventoryRepository, paymentGateway) {
        this.paymentRepository = paymentRepository;
        this.inventoryRepository = inventoryRepository;
        this.paymentGateway = paymentGateway;
    }
    async execute(payload, signature, event) {
        const isValid = this.paymentGateway?.validateWebhookSignature?.(payload, signature);
        if (!isValid)
            throw new DomainError_1.ConflictError('Firma HMAC invalida');
        const externalId = event['id'];
        const existing = await this.paymentRepository.findByExternalId(externalId);
        if (existing?.status === 'COMPLETED')
            return existing;
        if (existing) {
            await this.paymentRepository.updateStatus(existing.id, 'COMPLETED');
        }
        return { processed: true, externalId };
    }
}
exports.ProcessPaymentWebhookUseCase = ProcessPaymentWebhookUseCase;
//# sourceMappingURL=ProcessWebhookUseCase.js.map