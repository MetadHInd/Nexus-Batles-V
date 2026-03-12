"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGateway = createGateway;
const payments_constants_1 = require("../../payments/constants/payments.constants");
const MercadoPagoGateway_1 = require("../gateways/MercadoPagoGateway");
const MockPaymentGateway_1 = require("../gateways/MockPaymentGateway");
const env_1 = require("../../config/env");
function createGateway(name) {
    const gatewayName = (name ?? env_1.env.DEFAULT_PAYMENT_GATEWAY ?? payments_constants_1.GATEWAY_NAMES.MOCK);
    switch (gatewayName) {
        case payments_constants_1.GATEWAY_NAMES.MERCADOPAGO:
            return new MercadoPagoGateway_1.MercadoPagoGateway({
                accessToken: env_1.env.PAYMENT_API_KEY,
                webhookSecret: env_1.env.PAYMENT_WEBHOOK_SECRET,
            });
        case payments_constants_1.GATEWAY_NAMES.MOCK:
            return new MockPaymentGateway_1.MockPaymentGateway();
        default:
            throw new Error(`GatewayFactory: unsupported gateway "${gatewayName}"`);
    }
}
//# sourceMappingURL=gateway.factory.js.map