"use strict";
/**
 * MercadoPagoGateway.ts — Infrastructure / Gateway
 * Implementación de IPaymentGateway para MercadoPago.
 * Migrado desde Imperial Guard (JS) → TypeScript para Nexus Battles.
 *
 * Soporta:
 *  - Checkout Pro (redirect URL)
 *  - Verificación HMAC-SHA256 de webhooks
 *  - Consulta de estado de pagos
 *  - Reembolsos totales y parciales
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MercadoPagoGateway = void 0;
var https_1 = require("https");
var crypto_1 = require("crypto");
var payments_constants_1 = require("../../payments/constants/payments.constants");
var env_1 = require("../../config/env");
var MercadoPagoGateway = /** @class */ (function () {
    function MercadoPagoGateway(config) {
        if (!config.accessToken)
            throw new Error('MercadoPagoGateway: accessToken is required');
        this.accessToken = config.accessToken;
        this.webhookSecret = config.webhookSecret;
    }
    MercadoPagoGateway.prototype.getGatewayName = function () { return 'mercadopago'; };
    // ─── Crear Preferencia (Checkout Pro) ────────────────────────────────────────
    MercadoPagoGateway.prototype.createPayment = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var orderId, currency, description, idempotencyKey, buyer, items, payload, raw;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orderId = input.orderId, currency = input.currency, description = input.description, idempotencyKey = input.idempotencyKey, buyer = input.buyer, items = input.items;
                        payload = {
                            external_reference: orderId,
                            reason: description,
                            currency_id: currency,
                            items: items.map(function (i) { return ({
                                title: i.title,
                                quantity: i.quantity,
                                unit_price: i.unitPrice / 100, // MP usa decimales
                                currency_id: currency,
                            }); }),
                            payer: { email: buyer.email, name: buyer.name },
                            back_urls: {
                                success: "".concat(env_1.env.CORS_ORIGIN, "/payments/success"),
                                failure: "".concat(env_1.env.CORS_ORIGIN, "/payments/failure"),
                                pending: "".concat(env_1.env.CORS_ORIGIN, "/payments/pending"),
                            },
                            auto_return: 'approved',
                            notification_url: "".concat(env_1.env.CORS_ORIGIN, "/api/v1/payments/webhook?gateway=mercadopago"),
                            statement_descriptor: 'NEXUSBATTLES',
                        };
                        return [4 /*yield*/, this._request('POST', '/checkout/preferences', payload, idempotencyKey)];
                    case 1:
                        raw = _a.sent();
                        return [2 /*return*/, {
                                gatewayOrderId: raw['id'],
                                redirectUrl: env_1.env.NODE_ENV === 'production'
                                    ? raw['init_point']
                                    : raw['sandbox_init_point'],
                                rawResponse: raw,
                            }];
                }
            });
        });
    };
    // ─── Verificación de Webhook ──────────────────────────────────────────────────
    MercadoPagoGateway.prototype.verifyWebhook = function (rawBody, signature) {
        return __awaiter(this, void 0, void 0, function () {
            var parts, ts, v1, body, bodyParsed, requestId, manifest, expected, valid;
            var _a;
            return __generator(this, function (_b) {
                try {
                    parts = (signature || '').split(',').reduce(function (acc, part) {
                        var _a = part.split('='), k = _a[0], v = _a[1];
                        if (k && v)
                            acc[k.trim()] = v.trim();
                        return acc;
                    }, {});
                    ts = parts['ts'];
                    v1 = parts['v1'];
                    if (!ts || !v1)
                        return [2 /*return*/, { valid: false, event: null }];
                    body = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf-8');
                    bodyParsed = JSON.parse(body);
                    requestId = '';
                    manifest = "id:".concat((_a = bodyParsed['id']) !== null && _a !== void 0 ? _a : '', ";request-id:").concat(requestId, ";ts:").concat(ts, ";");
                    expected = crypto_1.default
                        .createHmac('sha256', this.webhookSecret)
                        .update(manifest)
                        .digest('hex');
                    valid = crypto_1.default.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(v1, 'hex'));
                    return [2 /*return*/, { valid: valid, event: bodyParsed }];
                }
                catch (_c) {
                    return [2 /*return*/, { valid: false, event: null }];
                }
                return [2 /*return*/];
            });
        });
    };
    // ─── Consultar Estado ─────────────────────────────────────────────────────────
    MercadoPagoGateway.prototype.getPaymentStatus = function (gatewayTransactionId) {
        return __awaiter(this, void 0, void 0, function () {
            var raw, statusMap;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._request('GET', "/v1/payments/".concat(gatewayTransactionId))];
                    case 1:
                        raw = _b.sent();
                        statusMap = {
                            approved: payments_constants_1.TRANSACTION_STATUS.APPROVED,
                            rejected: payments_constants_1.TRANSACTION_STATUS.REJECTED,
                            pending: payments_constants_1.TRANSACTION_STATUS.PENDING,
                            in_process: payments_constants_1.TRANSACTION_STATUS.PENDING,
                            refunded: payments_constants_1.TRANSACTION_STATUS.REFUNDED,
                        };
                        return [2 /*return*/, {
                                status: ((_a = statusMap[raw['status']]) !== null && _a !== void 0 ? _a : payments_constants_1.TRANSACTION_STATUS.ERROR),
                                rawResponse: raw,
                            }];
                }
            });
        });
    };
    // ─── Reembolso ────────────────────────────────────────────────────────────────
    MercadoPagoGateway.prototype.refund = function (gatewayTransactionId, amount, _reason) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, raw;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = amount ? { amount: amount / 100 } : {};
                        return [4 /*yield*/, this._request('POST', "/v1/payments/".concat(gatewayTransactionId, "/refunds"), payload)];
                    case 1:
                        raw = _a.sent();
                        return [2 /*return*/, {
                                refundId: String(raw['id']),
                                status: raw['status'],
                                rawResponse: raw,
                            }];
                }
            });
        });
    };
    // ─── HTTP Helper ──────────────────────────────────────────────────────────────
    MercadoPagoGateway.prototype._request = function (method, path, body, idempotencyKey) {
        var _this = this;
        if (body === void 0) { body = null; }
        if (idempotencyKey === void 0) { idempotencyKey = null; }
        return new Promise(function (resolve, reject) {
            var bodyStr = body ? JSON.stringify(body) : '';
            var headers = {
                'Authorization': "Bearer ".concat(_this.accessToken),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'NexusBattles/1.0',
            };
            if (idempotencyKey)
                headers['X-Idempotency-Key'] = idempotencyKey;
            if (bodyStr)
                headers['Content-Length'] = Buffer.byteLength(bodyStr);
            var req = https_1.default.request({ hostname: 'api.mercadopago.com', path: path, method: method, headers: headers }, function (res) {
                var data = '';
                res.on('data', function (chunk) { data += chunk; });
                res.on('end', function () {
                    var _a;
                    try {
                        var parsed = JSON.parse(data);
                        if (((_a = res.statusCode) !== null && _a !== void 0 ? _a : 0) >= 400) {
                            var err = new Error("MercadoPago API error ".concat(res.statusCode));
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
    };
    return MercadoPagoGateway;
}());
exports.MercadoPagoGateway = MercadoPagoGateway;
