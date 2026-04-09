"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessPaymentWebhookUseCase = void 0;
const DomainError_1 = require("../../../domain/errors/DomainError");
class ProcessPaymentWebhookUseCase {
    constructor(paymentRepository, inventoryRepository, paymentGateway) {
        this.paymentRepository = paymentRepository;
        this.inventoryRepository = inventoryRepository;
        this.paymentGateway = paymentGateway;
    }
    async execute(payload, signature) {
        // 1. Validar firma HMAC usando el nombre correcto del método y await
        // Nota: verifyWebhook devuelve { valid: boolean; event: Record<string, unknown> | null }
        const { valid, event } = await this.paymentGateway.verifyWebhook(payload, signature);
        if (!valid || !event) {
            throw new DomainError_1.ConflictError('Firma HMAC invalida o evento vacío');
        }
        // El externalId ahora lo sacamos del evento procesado por el Gateway
        const externalId = event.id;
        // 2. Idempotencia — no procesar dos veces el mismo evento
        const existing = await this.paymentRepository.findByExternalId(externalId);
        if (existing?.status === 'COMPLETED')
            return existing;
        // 3. Actualizar estado del pago
        if (existing) {
            await this.paymentRepository.updateStatus(existing.id, 'COMPLETED');
        }
        return { processed: true, externalId };
    }
}
exports.ProcessPaymentWebhookUseCase = ProcessPaymentWebhookUseCase;
//# sourceMappingURL=ProcessWebhookUseCase.js.map