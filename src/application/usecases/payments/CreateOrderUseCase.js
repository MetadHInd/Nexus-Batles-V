"use strict";
/**
 * CreateOrderUseCase.ts — Application / Use Cases / Payments
 * Crea una orden de pago con idempotencia, límites diarios,
 * reserva de stock, impuestos y descuentos.
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
exports.CreateOrderUseCase = void 0;
var Money_1 = require("../../../payments/domain/value-objects/Money");
var PricingRules_1 = require("../../../payments/domain/rules/PricingRules");
var payments_constants_1 = require("../../../payments/constants/payments.constants");
var logger_1 = require("../../../infrastructure/logging/logger");
var CreateOrderUseCase = /** @class */ (function () {
    function CreateOrderUseCase(repository) {
        this.repository = repository;
    }
    CreateOrderUseCase.prototype.execute = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, productId, currency, countryCode, idempotencyKey, promoCode, existing, order, dailyCount, conn, _a, product, available, baseAmount, taxRule, taxAmount, promotionId, discountAmount, promotion, totalAmount, orderId, err_1, _1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = input.userId, productId = input.productId, currency = input.currency, countryCode = input.countryCode, idempotencyKey = input.idempotencyKey, promoCode = input.promoCode;
                        return [4 /*yield*/, this.repository.findTransactionByIdempotencyKey(idempotencyKey)];
                    case 1:
                        existing = _b.sent();
                        if (!existing) return [3 /*break*/, 3];
                        logger_1.logger.info('CreateOrder: idempotency hit', { idempotencyKey: idempotencyKey });
                        return [4 /*yield*/, this.repository.getOrderById(existing.order_id)];
                    case 2:
                        order = _b.sent();
                        if (!order)
                            throw this._error('ORDER_NOT_FOUND', 'Orden idempotente no encontrada', 404);
                        return [2 /*return*/, {
                                orderId: order.order_id,
                                idempotent: true,
                                amounts: {
                                    base: order.base_amount / 100,
                                    tax: order.tax_amount / 100,
                                    discount: order.discount_amount / 100,
                                    total: order.total_amount / 100,
                                    currency: order.currency,
                                },
                            }];
                    case 3: return [4 /*yield*/, this.repository.countUserOrdersToday(userId)];
                    case 4:
                        dailyCount = _b.sent();
                        if (dailyCount >= payments_constants_1.PAYMENT_LIMITS.MAX_DAILY_ORDERS) {
                            throw this._error('DAILY_LIMIT_EXCEEDED', 'Has alcanzado el límite de órdenes diarias', 429);
                        }
                        return [4 /*yield*/, this.repository.beginTransaction()];
                    case 5:
                        conn = _b.sent();
                        _b.label = 6;
                    case 6:
                        _b.trys.push([6, 16, , 21]);
                        return [4 /*yield*/, this.repository.reserveProductForUser(productId, userId, conn)];
                    case 7:
                        _a = _b.sent(), product = _a.product, available = _a.available;
                        if (!!available) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.repository.rollback(conn)];
                    case 8:
                        _b.sent();
                        if (product === null || product === void 0 ? void 0 : product.alreadyOwned)
                            throw this._error('PRODUCT_ALREADY_OWNED', 'Ya posees este producto', 409);
                        throw this._error('PRODUCT_UNAVAILABLE', 'Producto no disponible o sin stock', 422);
                    case 9:
                        baseAmount = new Money_1.Money(product.price_cents, currency);
                        return [4 /*yield*/, this.repository.getTaxRule(productId, countryCode)];
                    case 10:
                        taxRule = _b.sent();
                        taxAmount = PricingRules_1.PricingRules.calculateTax(baseAmount, taxRule);
                        promotionId = null;
                        discountAmount = Money_1.Money.zero(currency);
                        if (!promoCode) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.repository.getValidPromotion(promoCode, productId, userId)];
                    case 11:
                        promotion = _b.sent();
                        if (!promotion)
                            throw this._error('INVALID_PROMO', 'Código promocional inválido o expirado', 422);
                        promotionId = promotion.promotion_id;
                        discountAmount = PricingRules_1.PricingRules.calculateDiscount(baseAmount, {
                            type: promotion.discount_type,
                            value: promotion.discount_value,
                        });
                        _b.label = 12;
                    case 12:
                        totalAmount = PricingRules_1.PricingRules.calculateTotal(baseAmount, taxAmount, discountAmount);
                        if (totalAmount.amountInCents < payments_constants_1.PAYMENT_LIMITS.MIN_AMOUNT_CENTS)
                            throw this._error('AMOUNT_TOO_LOW', "Monto m\u00EDnimo: $".concat(payments_constants_1.PAYMENT_LIMITS.MIN_AMOUNT_CENTS / 100), 422);
                        if (totalAmount.amountInCents > payments_constants_1.PAYMENT_LIMITS.MAX_AMOUNT_CENTS)
                            throw this._error('AMOUNT_TOO_HIGH', 'Monto supera el límite permitido', 422);
                        return [4 /*yield*/, this.repository.createOrder({
                                userId: userId,
                                productId: productId,
                                baseAmount: baseAmount.amountInCents,
                                taxAmount: taxAmount.amountInCents,
                                discountAmount: discountAmount.amountInCents,
                                totalAmount: totalAmount.amountInCents,
                                currency: currency,
                                idempotencyKey: idempotencyKey,
                                promotionId: promotionId,
                            }, conn)];
                    case 13:
                        orderId = (_b.sent()).orderId;
                        // ── 8. Auditoría ──────────────────────────────────────────────────────────
                        return [4 /*yield*/, this.repository.createAuditLog({
                                entityType: 'ORDER',
                                entityId: orderId,
                                action: payments_constants_1.AUDIT_ACTIONS.ORDER_CREATED,
                                previousStatus: null,
                                newStatus: payments_constants_1.ORDER_STATUS.PENDING,
                                actorId: userId,
                                metadata: { productId: productId, totalAmount: totalAmount.amountInCents, currency: currency, promoCode: promoCode },
                            }, conn)];
                    case 14:
                        // ── 8. Auditoría ──────────────────────────────────────────────────────────
                        _b.sent();
                        return [4 /*yield*/, this.repository.commit(conn)];
                    case 15:
                        _b.sent();
                        logger_1.logger.info('CreateOrder: order created', {
                            orderId: orderId,
                            userId: userId,
                            total: totalAmount.toString(),
                        });
                        return [2 /*return*/, {
                                orderId: orderId,
                                idempotent: false,
                                amounts: {
                                    base: baseAmount.toDecimal(),
                                    tax: taxAmount.toDecimal(),
                                    discount: discountAmount.toDecimal(),
                                    total: totalAmount.toDecimal(),
                                    currency: currency,
                                },
                            }];
                    case 16:
                        err_1 = _b.sent();
                        _b.label = 17;
                    case 17:
                        _b.trys.push([17, 19, , 20]);
                        return [4 /*yield*/, this.repository.rollback(conn)];
                    case 18:
                        _b.sent();
                        return [3 /*break*/, 20];
                    case 19:
                        _1 = _b.sent();
                        return [3 /*break*/, 20];
                    case 20: throw err_1;
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderUseCase.prototype._error = function (code, message, statusCode) {
        var err = new Error(message);
        err.code = code;
        err.statusCode = statusCode;
        return err;
    };
    return CreateOrderUseCase;
}());
exports.CreateOrderUseCase = CreateOrderUseCase;
