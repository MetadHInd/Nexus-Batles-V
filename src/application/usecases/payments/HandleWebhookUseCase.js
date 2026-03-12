"use strict";
/**
 * HandleWebhookUseCase.ts — Application / Use Cases / Payments
 * Procesa eventos de webhook de la pasarela de forma idempotente.
 * Verifica firma, consulta estado real, actualiza TX + orden + inventario.
 * Migrado desde Imperial Guard (JS) → TypeScript para Nexus Battles.
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
exports.HandleWebhookUseCase = void 0;
var payments_constants_1 = require("../../../payments/constants/payments.constants");
var logger_1 = require("../../../infrastructure/logging/logger");
var HandleWebhookUseCase = /** @class */ (function () {
    function HandleWebhookUseCase(repository, gateway) {
        this.repository = repository;
        this.gateway = gateway;
    }
    HandleWebhookUseCase.prototype.execute = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var rawBody, signature, ipAddress, _a, valid, event, gatewayOrderId, tx, _b, gatewayStatus, rawResponse, conn, order, err_1;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        rawBody = input.rawBody, signature = input.signature, ipAddress = input.ipAddress;
                        return [4 /*yield*/, this.gateway.verifyWebhook(rawBody, signature)];
                    case 1:
                        _a = _d.sent(), valid = _a.valid, event = _a.event;
                        if (!valid || !event) {
                            logger_1.logger.warn('HandleWebhook: invalid signature', {
                                gateway: this.gateway.getGatewayName(),
                                ipAddress: ipAddress,
                            });
                            throw this._error('INVALID_WEBHOOK_SIGNATURE', 'Firma de webhook inválida', 401);
                        }
                        logger_1.logger.info('HandleWebhook: valid event received', {
                            gateway: this.gateway.getGatewayName(),
                            type: (_c = event['type']) !== null && _c !== void 0 ? _c : event['action'],
                        });
                        gatewayOrderId = this._extractGatewayOrderId(event);
                        if (!gatewayOrderId) {
                            logger_1.logger.warn('HandleWebhook: no gatewayOrderId found', { event: event });
                            return [2 /*return*/, { processed: false, reason: 'NO_GATEWAY_ORDER_ID' }];
                        }
                        return [4 /*yield*/, this.repository.findTransactionByGatewayOrderId(gatewayOrderId)];
                    case 2:
                        tx = _d.sent();
                        if (!tx) {
                            logger_1.logger.warn('HandleWebhook: transaction not found', { gatewayOrderId: gatewayOrderId });
                            return [2 /*return*/, { processed: false, reason: 'TX_NOT_FOUND' }];
                        }
                        return [4 /*yield*/, this.gateway.getPaymentStatus(gatewayOrderId)];
                    case 3:
                        _b = _d.sent(), gatewayStatus = _b.status, rawResponse = _b.rawResponse;
                        return [4 /*yield*/, this.repository.beginTransaction()];
                    case 4:
                        conn = _d.sent();
                        _d.label = 5;
                    case 5:
                        _d.trys.push([5, 19, , 21]);
                        return [4 /*yield*/, this.repository.lockOrder(tx.order_id, conn)];
                    case 6:
                        order = _d.sent();
                        if (!!order) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.repository.rollback(conn)];
                    case 7:
                        _d.sent();
                        return [2 /*return*/, { processed: false, reason: 'ORDER_NOT_FOUND' }];
                    case 8:
                        if (![payments_constants_1.ORDER_STATUS.PAID, payments_constants_1.ORDER_STATUS.REFUNDED].includes(order.status)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.repository.rollback(conn)];
                    case 9:
                        _d.sent();
                        return [2 /*return*/, { processed: true, reason: 'ALREADY_PROCESSED', orderId: order.order_id }];
                    case 10:
                        if (!(gatewayStatus === payments_constants_1.TRANSACTION_STATUS.APPROVED)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this._confirmPayment(order, tx, rawResponse, conn)];
                    case 11:
                        _d.sent();
                        return [3 /*break*/, 16];
                    case 12:
                        if (!(gatewayStatus === payments_constants_1.TRANSACTION_STATUS.REJECTED ||
                            gatewayStatus === payments_constants_1.TRANSACTION_STATUS.ERROR)) return [3 /*break*/, 14];
                        return [4 /*yield*/, this._failPayment(order, tx, rawResponse, conn)];
                    case 13:
                        _d.sent();
                        return [3 /*break*/, 16];
                    case 14: 
                    // PENDING: solo actualizar TX, no mover orden
                    return [4 /*yield*/, this.repository.updateTransactionStatus(tx.transaction_id, gatewayStatus, rawResponse, conn)];
                    case 15:
                        // PENDING: solo actualizar TX, no mover orden
                        _d.sent();
                        _d.label = 16;
                    case 16: 
                    // ── 7. Registro de auditoría ──────────────────────────────────────────────
                    return [4 /*yield*/, this.repository.createAuditLog({
                            entityType: 'TRANSACTION', entityId: tx.transaction_id,
                            action: payments_constants_1.AUDIT_ACTIONS.WEBHOOK_RECEIVED,
                            previousStatus: tx.status,
                            newStatus: gatewayStatus,
                            actorId: 'WEBHOOK',
                            metadata: {
                                gateway: this.gateway.getGatewayName(),
                                gatewayOrderId: gatewayOrderId,
                                ipAddress: ipAddress,
                            },
                        }, conn)];
                    case 17:
                        // ── 7. Registro de auditoría ──────────────────────────────────────────────
                        _d.sent();
                        return [4 /*yield*/, this.repository.commit(conn)];
                    case 18:
                        _d.sent();
                        return [2 /*return*/, { processed: true, orderId: order.order_id, newStatus: gatewayStatus }];
                    case 19:
                        err_1 = _d.sent();
                        return [4 /*yield*/, this.repository.rollback(conn)];
                    case 20:
                        _d.sent();
                        logger_1.logger.error('HandleWebhook: error processing', { error: err_1.message });
                        throw err_1;
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    // ─── Confirmar pago: TX + orden + inventario (atómica) ───────────────────────
    HandleWebhookUseCase.prototype._confirmPayment = function (order, tx, rawResponse, conn) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.updateTransactionStatus(tx.transaction_id, payments_constants_1.TRANSACTION_STATUS.APPROVED, rawResponse, conn)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.repository.updateOrderStatus(order.order_id, payments_constants_1.ORDER_STATUS.PAID, conn)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.repository.assignProductToUser(order.order_id, order.user_id, order.product_id, conn)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.repository.createAuditLog({
                                entityType: 'ORDER', entityId: order.order_id,
                                action: payments_constants_1.AUDIT_ACTIONS.ORDER_STATUS_CHANGED,
                                previousStatus: order.status,
                                newStatus: payments_constants_1.ORDER_STATUS.PAID,
                                actorId: 'WEBHOOK',
                                metadata: { transactionId: tx.transaction_id },
                            }, conn)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.repository.createAuditLog({
                                entityType: 'INVENTORY', entityId: order.order_id,
                                action: payments_constants_1.AUDIT_ACTIONS.INVENTORY_ASSIGNED,
                                previousStatus: null,
                                newStatus: 'ACTIVE',
                                actorId: 'WEBHOOK',
                                metadata: { productId: order.product_id, userId: order.user_id },
                            }, conn)];
                    case 5:
                        _a.sent();
                        logger_1.logger.info('HandleWebhook: payment confirmed', { orderId: order.order_id });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ─── Fallar pago: libera reserva ─────────────────────────────────────────────
    HandleWebhookUseCase.prototype._failPayment = function (order, tx, rawResponse, conn) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.updateTransactionStatus(tx.transaction_id, payments_constants_1.TRANSACTION_STATUS.REJECTED, rawResponse, conn)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.repository.updateOrderStatus(order.order_id, payments_constants_1.ORDER_STATUS.FAILED, conn)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.repository.releaseProductReservation(order.product_id, order.user_id, conn)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.repository.createAuditLog({
                                entityType: 'ORDER', entityId: order.order_id,
                                action: payments_constants_1.AUDIT_ACTIONS.ORDER_STATUS_CHANGED,
                                previousStatus: order.status,
                                newStatus: payments_constants_1.ORDER_STATUS.FAILED,
                                actorId: 'WEBHOOK',
                                metadata: { transactionId: tx.transaction_id },
                            }, conn)];
                    case 4:
                        _a.sent();
                        logger_1.logger.warn('HandleWebhook: payment failed', { orderId: order.order_id });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ─── Extraer ID de la orden según pasarela ────────────────────────────────────
    HandleWebhookUseCase.prototype._extractGatewayOrderId = function (event) {
        var _a, _b, _c;
        // MercadoPago: event.data.id
        var mpId = (_a = event === null || event === void 0 ? void 0 : event['data']) === null || _a === void 0 ? void 0 : _a['id'];
        if (mpId)
            return String(mpId);
        // Stripe: event.data.object.id
        var stripeId = (_c = (_b = event === null || event === void 0 ? void 0 : event['data']) === null || _b === void 0 ? void 0 : _b['object']) === null || _c === void 0 ? void 0 : _c['id'];
        if (stripeId)
            return stripeId;
        // Mock
        if (event === null || event === void 0 ? void 0 : event['gatewayOrderId'])
            return event['gatewayOrderId'];
        return null;
    };
    HandleWebhookUseCase.prototype._error = function (code, message, statusCode) {
        var err = new Error(message);
        err.code = code;
        err.statusCode = statusCode;
        return err;
    };
    return HandleWebhookUseCase;
}());
exports.HandleWebhookUseCase = HandleWebhookUseCase;
