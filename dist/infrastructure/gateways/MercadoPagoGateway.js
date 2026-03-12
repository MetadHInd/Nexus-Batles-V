"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MercadoPagoGateway = void 0;
const https_1 = require("https");
const crypto_1 = require("crypto");
const payments_constants_1 = require("../../payments/constants/payments.constants");
const env_1 = require("../../config/env");
class MercadoPagoGateway {
    accessToken;
    webhookSecret;
    constructor(config) {
        if (!config.accessToken)
            throw new Error('MercadoPagoGateway: accessToken is required');
        this.accessToken = config.accessToken;
        this.webhookSecret = config.webhookSecret;
    }
    getGatewayName() { return 'mercadopago'; }
    async createPayment(input) {
        const { orderId, currency, description, idempotencyKey, buyer, items } = input;
        const payload = {
            external_reference: orderId,
            reason: description,
            currency_id: currency,
            items: items.map((i) => ({
                title: i.title,
                quantity: i.quantity,
                unit_price: i.unitPrice / 100,
                currency_id: currency,
            })),
            payer: { email: buyer.email, name: buyer.name },
            back_urls: {
                success: `${env_1.env.CORS_ORIGIN}/payments/success`,
                failure: `${env_1.env.CORS_ORIGIN}/payments/failure`,
                pending: `${env_1.env.CORS_ORIGIN}/payments/pending`,
            },
            auto_return: 'approved',
            notification_url: `${env_1.env.CORS_ORIGIN}/api/v1/payments/webhook?gateway=mercadopago`,
            statement_descriptor: 'NEXUSBATTLES',
        };
        const raw = await this._request('POST', '/checkout/preferences', payload, idempotencyKey);
        return {
            gatewayOrderId: raw['id'],
            redirectUrl: env_1.env.NODE_ENV === 'production'
                ? raw['init_point']
                : raw['sandbox_init_point'],
            rawResponse: raw,
        };
    }
    async verifyWebhook(rawBody, signature) {
        try {
            const parts = (signature || '').split(',').reduce((acc, part) => {
                const [k, v] = part.split('=');
                if (k && v)
                    acc[k.trim()] = v.trim();
                return acc;
            }, {});
            const ts = parts['ts'];
            const v1 = parts['v1'];
            if (!ts || !v1)
                return { valid: false, event: null };
            const body = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf-8');
            const bodyParsed = JSON.parse(body);
            const requestId = '';
            const manifest = `id:${bodyParsed['id'] ?? ''};request-id:${requestId};ts:${ts};`;
            const expected = crypto_1.default
                .createHmac('sha256', this.webhookSecret)
                .update(manifest)
                .digest('hex');
            const valid = crypto_1.default.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(v1, 'hex'));
            return { valid, event: bodyParsed };
        }
        catch {
            return { valid: false, event: null };
        }
    }
    async getPaymentStatus(gatewayTransactionId) {
        const raw = await this._request('GET', `/v1/payments/${gatewayTransactionId}`);
        const statusMap = {
            approved: payments_constants_1.TRANSACTION_STATUS.APPROVED,
            rejected: payments_constants_1.TRANSACTION_STATUS.REJECTED,
            pending: payments_constants_1.TRANSACTION_STATUS.PENDING,
            in_process: payments_constants_1.TRANSACTION_STATUS.PENDING,
            refunded: payments_constants_1.TRANSACTION_STATUS.REFUNDED,
        };
        return {
            status: (statusMap[raw['status']] ?? payments_constants_1.TRANSACTION_STATUS.ERROR),
            rawResponse: raw,
        };
    }
    async refund(gatewayTransactionId, amount, _reason) {
        const payload = amount ? { amount: amount / 100 } : {};
        const raw = await this._request('POST', `/v1/payments/${gatewayTransactionId}/refunds`, payload);
        return {
            refundId: String(raw['id']),
            status: raw['status'],
            rawResponse: raw,
        };
    }
    _request(method, path, body = null, idempotencyKey = null) {
        return new Promise((resolve, reject) => {
            const bodyStr = body ? JSON.stringify(body) : '';
            const headers = {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'NexusBattles/1.0',
            };
            if (idempotencyKey)
                headers['X-Idempotency-Key'] = idempotencyKey;
            if (bodyStr)
                headers['Content-Length'] = Buffer.byteLength(bodyStr);
            const req = https_1.default.request({ hostname: 'api.mercadopago.com', path, method, headers }, (res) => {
                let data = '';
                res.on('data', chunk => { data += chunk; });
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        if ((res.statusCode ?? 0) >= 400) {
                            const err = new Error(`MercadoPago API error ${res.statusCode}`);
                            err.statusCode = res.statusCode;
                            err.gatewayError = parsed;
                            return reject(err);
                        }
                        resolve(parsed);
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            });
            req.on('error', reject);
            if (bodyStr)
                req.write(bodyStr);
            req.end();
        });
    }
}
exports.MercadoPagoGateway = MercadoPagoGateway;
//# sourceMappingURL=MercadoPagoGateway.js.map