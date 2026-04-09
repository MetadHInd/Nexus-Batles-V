"use strict";
/**
 * IPaymentGateway.ts — Application / Ports
 * Contrato que implementan MercadoPagoGateway y MockPaymentGateway.
 *
 * FIX: interfaz original tenía createPaymentIntent/confirmPayment/validateWebhookSignature
 *      que no coincidían con los métodos reales de las implementaciones.
 *      Corregida para reflejar: createPayment, verifyWebhook, getPaymentStatus, refund, getGatewayName.
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=IPaymentGateway.js.map