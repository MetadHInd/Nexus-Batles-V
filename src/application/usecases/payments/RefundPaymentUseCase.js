"use strict";
/**
 * RefundPaymentUseCase.ts — Application / Use Cases / Payments
 * Procesa reembolsos totales o parciales con auditoría completa.
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
exports.RefundPaymentUseCase = void 0;
var payments_constants_1 = require("../../../payments/constants/payments.constants");
var logger_1 = require("../../../infrastructure/logging/logger");
var RefundPaymentUseCase = /** @class */ (function () {
    function RefundPaymentUseCase(repository, gateway) {
        this.repository = repository;
        this.gateway = gateway;
    }
    RefundPaymentUseCase.prototype.execute = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var orderId, userId, amount, reason, requestedBy, conn, order, tx, refundAmount, refundResult, conn2, refundId, e_1, err_1, _1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orderId = input.orderId, userId = input.userId, amount = input.amount, reason = input.reason, requestedBy = input.requestedBy;
                        return [4 /*yield*/, this.repository.beginTransaction()];
                    case 1:
                        conn = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 17, , 22]);
                        return [4 /*yield*/, this.repository.lockOrder(orderId, conn)];
                    case 3:
                        order = _a.sent();
                        if (!order)
                            throw this._error('ORDER_NOT_FOUND', 'Orden no encontrada', 404);
                        if (order.user_id !== userId)
                            throw this._error('FORBIDDEN', 'No autorizado', 403);
                        if (order.status !== payments_constants_1.ORDER_STATUS.PAID)
                            throw this._error('NOT_REFUNDABLE', "Orden en estado ".concat(order.status, " no es reembolsable"), 409);
                        return [4 /*yield*/, this.repository.getTransactionByOrderId(orderId, conn)];
                    case 4:
                        tx = _a.sent();
                        if (!tx || tx.status !== payments_constants_1.TRANSACTION_STATUS.APPROVED)
                            throw this._error('TX_NOT_FOUND', 'Transacción aprobada no encontrada', 404);
                        refundAmount = amount !== null && amount !== void 0 ? amount : order.total_amount;
                        // ── 3. Commit parcial antes de llamar pasarela ────────────────────────────
                        return [4 /*yield*/, this.repository.commit(conn)];
                    case 5:
                        // ── 3. Commit parcial antes de llamar pasarela ────────────────────────────
                        _a.sent();
                        return [4 /*yield*/, this.gateway.refund(tx.gateway_order_id, refundAmount, reason)];
                    case 6:
                        refundResult = _a.sent();
                        return [4 /*yield*/, this.repository.beginTransaction()];
                    case 7:
                        conn2 = _a.sent();
                        _a.label = 8;
                    case 8:
                        _a.trys.push([8, 14, , 16]);
                        return [4 /*yield*/, this.repository.createRefund({
                                transactionId: tx.transaction_id,
                                orderId: orderId,
                                amount: refundAmount,
                                reason: reason,
                                gatewayRefundId: refundResult.refundId,
                                requestedBy: requestedBy !== null && requestedBy !== void 0 ? requestedBy : userId,
                            }, conn2)];
                    case 9:
                        refundId = (_a.sent()).refundId;
                        return [4 /*yield*/, this.repository.updateOrderStatus(orderId, payments_constants_1.ORDER_STATUS.REFUNDED, conn2)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.repository.updateTransactionStatus(tx.transaction_id, payments_constants_1.TRANSACTION_STATUS.REFUNDED, refundResult.rawResponse, conn2)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.repository.createAuditLog({
                                entityType: 'ORDER',
                                entityId: orderId,
                                action: payments_constants_1.AUDIT_ACTIONS.REFUND_COMPLETED,
                                previousStatus: payments_constants_1.ORDER_STATUS.PAID,
                                newStatus: payments_constants_1.ORDER_STATUS.REFUNDED,
                                actorId: requestedBy !== null && requestedBy !== void 0 ? requestedBy : userId,
                                metadata: {
                                    orderId: orderId,
                                    refundId: refundId,
                                    amount: refundAmount,
                                    reason: reason,
                                    gatewayRefundId: refundResult.refundId,
                                },
                            }, conn2)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, this.repository.commit(conn2)];
                    case 13:
                        _a.sent();
                        logger_1.logger.info('RefundPayment: refund completed', { orderId: orderId, refundId: refundId, refundAmount: refundAmount });
                        return [2 /*return*/, { refundId: refundId, orderId: orderId, amount: refundAmount, status: 'COMPLETED' }];
                    case 14:
                        e_1 = _a.sent();
                        return [4 /*yield*/, this.repository.rollback(conn2)];
                    case 15:
                        _a.sent();
                        throw e_1;
                    case 16: return [3 /*break*/, 22];
                    case 17:
                        err_1 = _a.sent();
                        _a.label = 18;
                    case 18:
                        _a.trys.push([18, 20, , 21]);
                        return [4 /*yield*/, this.repository.rollback(conn)];
                    case 19:
                        _a.sent();
                        return [3 /*break*/, 21];
                    case 20:
                        _1 = _a.sent();
                        return [3 /*break*/, 21];
                    case 21: throw err_1;
                    case 22: return [2 /*return*/];
                }
            });
        });
    };
    RefundPaymentUseCase.prototype._error = function (code, message, statusCode) {
        var err = new Error(message);
        err.code = code;
        err.statusCode = statusCode;
        return err;
    };
    return RefundPaymentUseCase;
}());
exports.RefundPaymentUseCase = RefundPaymentUseCase;
