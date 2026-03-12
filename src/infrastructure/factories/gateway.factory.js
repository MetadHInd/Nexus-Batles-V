"use strict";
/**
 * gateway.factory.ts — Infrastructure / Factory
 * Crea la instancia correcta de pasarela de pago según el nombre.
 * Centraliza la configuración y elimina dependencia directa en controladores.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGateway = createGateway;
var payments_constants_1 = require("../../payments/constants/payments.constants");
var MercadoPagoGateway_1 = require("../gateways/MercadoPagoGateway");
var MockPaymentGateway_1 = require("../gateways/MockPaymentGateway");
var env_1 = require("../../config/env");
function createGateway(name) {
    var _a;
    var gatewayName = ((_a = name !== null && name !== void 0 ? name : env_1.env.DEFAULT_PAYMENT_GATEWAY) !== null && _a !== void 0 ? _a : payments_constants_1.GATEWAY_NAMES.MOCK);
    switch (gatewayName) {
        case payments_constants_1.GATEWAY_NAMES.MERCADOPAGO:
            return new MercadoPagoGateway_1.MercadoPagoGateway({
                accessToken: env_1.env.PAYMENT_API_KEY,
                webhookSecret: env_1.env.PAYMENT_WEBHOOK_SECRET,
            });
        case payments_constants_1.GATEWAY_NAMES.MOCK:
            return new MockPaymentGateway_1.MockPaymentGateway();
        default:
            throw new Error("GatewayFactory: unsupported gateway \"".concat(gatewayName, "\""));
    }
}
