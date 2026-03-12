"use strict";
/**
 * PaymentController.ts — Infrastructure / Controllers
 * Orquesta los use cases de pagos.
 * Recibe HTTP, delega en use cases y responde.
 * Migrado desde Imperial Guard (JS) → TypeScript para Nexus Battles.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.paymentController = exports.PaymentController = void 0;
var MySQLPaymentRepository_1 = require("../repositories/MySQLPaymentRepository");
var gateway_factory_1 = require("../factories/gateway.factory");
var CreateOrderUseCase_1 = require("../../application/usecases/payments/CreateOrderUseCase");
var ProcessPaymentUseCase_1 = require("../../application/usecases/payments/ProcessPaymentUseCase");
var RefundPaymentUseCase_1 = require("../../application/usecases/payments/RefundPaymentUseCase");
var HandleWebhookUseCase_1 = require("../../application/usecases/payments/HandleWebhookUseCase");
var logger_1 = require("../logging/logger");
var PaymentController = /** @class */ (function () {
    function PaymentController() {
    }
    // ── POST /api/v1/payments/orders ─────────────────────────────────────────────
    PaymentController.prototype.createOrder = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var useCase, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        useCase = new CreateOrderUseCase_1.CreateOrderUseCase(MySQLPaymentRepository_1.paymentRepository);
                        return [4 /*yield*/, useCase.execute({
                                userId: req.user.id,
                                productId: req.body.productId,
                                currency: req.body.currency,
                                countryCode: req.body.countryCode,
                                idempotencyKey: req.body.idempotencyKey,
                                buyerInfo: req.body.buyerInfo,
                                promoCode: req.body.promoCode,
                            })];
                    case 1:
                        result = _a.sent();
                        res.status(result.idempotent ? 200 : 201).json({ success: true, data: result });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        next(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ── POST /api/v1/payments/orders/:orderId/pay ─────────────────────────────────
    PaymentController.prototype.processPayment = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var gatewayName, gateway, useCase, result, err_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        gatewayName = (_a = req.body.gateway) !== null && _a !== void 0 ? _a : process.env.DEFAULT_PAYMENT_GATEWAY;
                        gateway = (0, gateway_factory_1.createGateway)(gatewayName);
                        useCase = new ProcessPaymentUseCase_1.ProcessPaymentUseCase(MySQLPaymentRepository_1.paymentRepository, gateway);
                        return [4 /*yield*/, useCase.execute({
                                orderId: req.params.orderId,
                                userId: req.user.id,
                                buyerInfo: req.body.buyerInfo,
                            })];
                    case 1:
                        result = _b.sent();
                        res.status(200).json({ success: true, data: result });
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _b.sent();
                        next(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ── GET /api/v1/payments/orders/:orderId ──────────────────────────────────────
    PaymentController.prototype.getOrderStatus = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var order, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, MySQLPaymentRepository_1.paymentRepository.getOrderById(req.params.orderId)];
                    case 1:
                        order = _a.sent();
                        if (!order) {
                            res.status(404).json({ success: false, error: 'ORDER_NOT_FOUND' });
                            return [2 /*return*/];
                        }
                        if (order.user_id !== req.user.id) {
                            res.status(403).json({ success: false, error: 'FORBIDDEN' });
                            return [2 /*return*/];
                        }
                        res.json({ success: true, data: order });
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        next(err_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ── POST /api/v1/payments/orders/:orderId/refund ──────────────────────────────
    PaymentController.prototype.refundPayment = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var gateway, useCase, result, err_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        gateway = (0, gateway_factory_1.createGateway)((_a = req.body.gateway) !== null && _a !== void 0 ? _a : process.env.DEFAULT_PAYMENT_GATEWAY);
                        useCase = new RefundPaymentUseCase_1.RefundPaymentUseCase(MySQLPaymentRepository_1.paymentRepository, gateway);
                        return [4 /*yield*/, useCase.execute({
                                orderId: req.params.orderId,
                                userId: req.user.id,
                                amount: req.body.amount,
                                reason: req.body.reason,
                                requestedBy: req.user.id,
                            })];
                    case 1:
                        result = _b.sent();
                        res.status(200).json({ success: true, data: result });
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _b.sent();
                        next(err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ── POST /api/v1/payments/webhook?gateway=<name> ──────────────────────────────
    PaymentController.prototype.webhook = function (req, res, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var gatewayName, gateway, useCase, signature, result, err_5;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        gatewayName = req.query['gateway'];
                        if (!gatewayName) {
                            res.status(400).json({ error: 'gateway query param required' });
                            return [2 /*return*/];
                        }
                        gateway = (0, gateway_factory_1.createGateway)(gatewayName);
                        useCase = new HandleWebhookUseCase_1.HandleWebhookUseCase(MySQLPaymentRepository_1.paymentRepository, gateway);
                        signature = req.headers['x-signature'] ||
                            req.headers['stripe-signature'] ||
                            req.headers['x-hub-signature-256'] ||
                            '';
                        return [4 /*yield*/, useCase.execute({
                                rawBody: (_a = req.rawBody) !== null && _a !== void 0 ? _a : '',
                                signature: signature,
                                ipAddress: (_c = (_b = req.clientIp) !== null && _b !== void 0 ? _b : req.ip) !== null && _c !== void 0 ? _c : '',
                            })];
                    case 1:
                        result = _d.sent();
                        // Siempre 200 rápido → evita reintentos infinitos de la pasarela
                        res.status(200).json(__assign({ received: true }, result));
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _d.sent();
                        if (err_5.code === 'INVALID_WEBHOOK_SIGNATURE') {
                            res.status(401).json({ error: err_5.message });
                            return [2 /*return*/];
                        }
                        logger_1.logger.error('WebhookController: unhandled error', { error: err_5.message });
                        res.status(200).json({ received: true, processed: false });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return PaymentController;
}());
exports.PaymentController = PaymentController;
exports.paymentController = new PaymentController();
