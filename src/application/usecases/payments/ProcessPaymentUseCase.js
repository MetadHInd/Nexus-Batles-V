"use strict";
/**
 * ProcessPaymentUseCase.ts — Application / Use Cases / Payments
 * Inicia el proceso de pago con la pasarela elegida.
 * Patrón: commit antes de llamada externa + manejo de error de pasarela.
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
exports.ProcessPaymentUseCase = void 0;
var payments_constants_1 = require("../../../payments/constants/payments.constants");
var logger_1 = require("../../../infrastructure/logging/logger");
var ProcessPaymentUseCase = /** @class */ (function () {
    function ProcessPaymentUseCase(repository, gateway) {
        this.repository = repository;
        this.gateway = gateway;
    }
    ProcessPaymentUseCase.prototype.execute = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var orderId, userId, buyerInfo, conn, order, transactionId, gatewayResult, gatewayErr_1, conn2, e_1, err_1, _1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orderId = input.orderId, userId = input.userId, buyerInfo = input.buyerInfo;
                        return [4 /*yield*/, this.repository.beginTransaction()];
                    case 1:
                        conn = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 22, , 27]);
                        return [4 /*yield*/, this.repository.lockOrder(orderId, conn)];
                    case 3:
                        order = _a.sent();
                        if (!order)
                            throw this._error('ORDER_NOT_FOUND', 'Orden no encontrada', 404);
                        if (order.user_id !== userId)
                            throw this._error('FORBIDDEN', 'No autorizado', 403);
                        if (order.status !== payments_constants_1.ORDER_STATUS.PENDING)
                            throw this._error('ORDER_NOT_PENDING', "La orden est\u00E1 en estado ".concat(order.status), 409);
                        // ── 2. Transición a PROCESSING ────────────────────────────────────────────
                        return [4 /*yield*/, this.repository.updateOrderStatus(orderId, payments_constants_1.ORDER_STATUS.PROCESSING, conn)];
                    case 4:
                        // ── 2. Transición a PROCESSING ────────────────────────────────────────────
                        _a.sent();
                        return [4 /*yield*/, this.repository.createAuditLog({
                                entityType: 'ORDER', entityId: orderId,
                                action: payments_constants_1.AUDIT_ACTIONS.ORDER_STATUS_CHANGED,
                                previousStatus: payments_constants_1.ORDER_STATUS.PENDING,
                                newStatus: payments_constants_1.ORDER_STATUS.PROCESSING,
                                actorId: userId,
                                metadata: { gateway: this.gateway.getGatewayName() },
                            }, conn)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.repository.createTransaction({
                                orderId: orderId,
                                gatewayName: this.gateway.getGatewayName(),
                                gatewayOrderId: null,
                                status: payments_constants_1.TRANSACTION_STATUS.INITIATED,
                                amount: order.total_amount,
                                currency: order.currency,
                                gatewayRawResponse: {},
                            }, conn)];
                    case 6:
                        transactionId = (_a.sent()).transactionId;
                        return [4 /*yield*/, this.repository.createAuditLog({
                                entityType: 'TRANSACTION', entityId: transactionId,
                                action: payments_constants_1.AUDIT_ACTIONS.TRANSACTION_CREATED,
                                previousStatus: null,
                                newStatus: payments_constants_1.TRANSACTION_STATUS.INITIATED,
                                actorId: userId,
                                metadata: { orderId: orderId, gateway: this.gateway.getGatewayName() },
                            }, conn)];
                    case 7:
                        _a.sent();
                        // ── 4. Commit ANTES de llamar a la pasarela (no bloquear con TX abierta) ─
                        return [4 /*yield*/, this.repository.commit(conn)];
                    case 8:
                        // ── 4. Commit ANTES de llamar a la pasarela (no bloquear con TX abierta) ─
                        _a.sent();
                        gatewayResult = void 0;
                        _a.label = 9;
                    case 9:
                        _a.trys.push([9, 11, , 13]);
                        return [4 /*yield*/, this.gateway.createPayment({
                                orderId: orderId,
                                totalAmount: order.total_amount,
                                currency: order.currency,
                                description: "Nexus Battles \u2014 Orden ".concat(orderId),
                                idempotencyKey: order.idempotency_key,
                                buyer: buyerInfo,
                                items: [{
                                        title: "Producto #".concat(order.product_id),
                                        quantity: 1,
                                        unitPrice: order.total_amount,
                                    }],
                            })];
                    case 10:
                        gatewayResult = _a.sent();
                        return [3 /*break*/, 13];
                    case 11:
                        gatewayErr_1 = _a.sent();
                        return [4 /*yield*/, this._handleGatewayError(transactionId, orderId, userId, gatewayErr_1)];
                    case 12:
                        _a.sent();
                        throw this._error('GATEWAY_ERROR', 'Error al procesar el pago en la pasarela', 502);
                    case 13: return [4 /*yield*/, this.repository.beginTransaction()];
                    case 14:
                        conn2 = _a.sent();
                        _a.label = 15;
                    case 15:
                        _a.trys.push([15, 19, , 21]);
                        return [4 /*yield*/, this.repository.updateTransactionStatus(transactionId, payments_constants_1.TRANSACTION_STATUS.PENDING, gatewayResult.rawResponse, conn2)];
                    case 16:
                        _a.sent();
                        // Guardar gateway_order_id necesario para procesar el webhook
                        return [4 /*yield*/, conn2.execute('UPDATE payment_transactions SET gateway_order_id = ? WHERE transaction_id = ?', [gatewayResult.gatewayOrderId, transactionId])];
                    case 17:
                        // Guardar gateway_order_id necesario para procesar el webhook
                        _a.sent();
                        return [4 /*yield*/, this.repository.commit(conn2)];
                    case 18:
                        _a.sent();
                        return [3 /*break*/, 21];
                    case 19:
                        e_1 = _a.sent();
                        return [4 /*yield*/, this.repository.rollback(conn2)];
                    case 20:
                        _a.sent();
                        throw e_1;
                    case 21:
                        logger_1.logger.info('ProcessPayment: payment initiated', {
                            orderId: orderId,
                            transactionId: transactionId,
                            gateway: this.gateway.getGatewayName(),
                            gatewayOrderId: gatewayResult.gatewayOrderId,
                        });
                        return [2 /*return*/, {
                                orderId: orderId,
                                transactionId: transactionId,
                                gatewayOrderId: gatewayResult.gatewayOrderId,
                                redirectUrl: gatewayResult.redirectUrl,
                                clientSecret: gatewayResult.clientSecret,
                                gateway: this.gateway.getGatewayName(),
                            }];
                    case 22:
                        err_1 = _a.sent();
                        _a.label = 23;
                    case 23:
                        _a.trys.push([23, 25, , 26]);
                        return [4 /*yield*/, this.repository.rollback(conn)];
                    case 24:
                        _a.sent();
                        return [3 /*break*/, 26];
                    case 25:
                        _1 = _a.sent();
                        return [3 /*break*/, 26];
                    case 26: throw err_1;
                    case 27: return [2 /*return*/];
                }
            });
        });
    };
    ProcessPaymentUseCase.prototype._handleGatewayError = function (transactionId, orderId, userId, gatewayErr) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.beginTransaction()];
                    case 1:
                        conn = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 9]);
                        return [4 /*yield*/, this.repository.updateTransactionStatus(transactionId, payments_constants_1.TRANSACTION_STATUS.ERROR, { error: gatewayErr.message, gatewayError: gatewayErr.gatewayError }, conn)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.repository.updateOrderStatus(orderId, payments_constants_1.ORDER_STATUS.FAILED, conn)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.repository.createAuditLog({
                                entityType: 'TRANSACTION', entityId: transactionId,
                                action: payments_constants_1.AUDIT_ACTIONS.TX_STATUS_CHANGED,
                                previousStatus: payments_constants_1.TRANSACTION_STATUS.INITIATED,
                                newStatus: payments_constants_1.TRANSACTION_STATUS.ERROR,
                                actorId: userId,
                                metadata: { error: gatewayErr.message },
                            }, conn)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.repository.commit(conn)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 7:
                        e_2 = _a.sent();
                        return [4 /*yield*/, this.repository.rollback(conn)];
                    case 8:
                        _a.sent();
                        logger_1.logger.error('ProcessPayment: failed to record gateway error', { error: e_2.message });
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    ProcessPaymentUseCase.prototype._error = function (code, message, statusCode) {
        var err = new Error(message);
        err.code = code;
        err.statusCode = statusCode;
        return err;
    };
    return ProcessPaymentUseCase;
}());
exports.ProcessPaymentUseCase = ProcessPaymentUseCase;
