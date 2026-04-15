/**
 * gateway.factory.ts — Infrastructure / Factory
 * Crea la instancia correcta de pasarela de pago según el nombre.
 * Centraliza la configuración y elimina dependencia directa en controladores.
 */
import type { IPaymentGateway } from '../../application/ports/IPaymentGateway';
export declare function createGateway(name?: string): IPaymentGateway;
//# sourceMappingURL=gateway.factory.d.ts.map