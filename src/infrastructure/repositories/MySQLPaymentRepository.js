"use strict";
/**
 * MySQLPaymentRepository.ts — Infrastructure / Repository
 * Implementación MySQL del contrato IPaymentRepository.
 * Migrado desde Imperial Guard (JS) → TypeScript para Nexus Battles.
 * Usa el pool existente de Nexus (mysql2/promise).
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
exports.paymentRepository = exports.MySQLPaymentRepository = void 0;
var crypto_1 = require("crypto");
var connection_1 = require("../database/connection");
var MySQLPaymentRepository = /** @class */ (function () {
    function MySQLPaymentRepository() {
    }
    // ─── Transacciones DB ────────────────────────────────────────────────────────
    MySQLPaymentRepository.prototype.beginTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection_1.pool.getConnection()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, conn];
                }
            });
        });
    };
    MySQLPaymentRepository.prototype.commit = function (conn) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, conn.commit()];
                    case 1:
                        _a.sent();
                        conn.release();
                        return [2 /*return*/];
                }
            });
        });
    };
    MySQLPaymentRepository.prototype.rollback = function (conn) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 2, 3]);
                        return [4 /*yield*/, conn.rollback()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        conn.release();
                        return [7 /*endfinally*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MySQLPaymentRepository.prototype.db = function (conn) {
        return conn ? conn : connection_1.pool;
    };
    // ─── Órdenes ─────────────────────────────────────────────────────────────────
    MySQLPaymentRepository.prototype.createOrder = function (data, conn) {
        return __awaiter(this, void 0, void 0, function () {
            var orderId, userId, productId, baseAmount, taxAmount, discountAmount, totalAmount, currency, idempotencyKey, promotionId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orderId = (0, crypto_1.randomUUID)();
                        userId = data.userId, productId = data.productId, baseAmount = data.baseAmount, taxAmount = data.taxAmount, discountAmount = data.discountAmount, totalAmount = data.totalAmount, currency = data.currency, idempotencyKey = data.idempotencyKey, promotionId = data.promotionId;
                        return [4 /*yield*/, this.db(conn).execute("INSERT INTO payment_orders\n         (order_id, user_id, product_id, base_amount, tax_amount, discount_amount,\n          total_amount, currency, status, idempotency_key, promotion_id)\n       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?)", [orderId, userId, productId, baseAmount, taxAmount,
                                discountAmount, totalAmount, currency, idempotencyKey, promotionId !== null && promotionId !== void 0 ? promotionId : null])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { orderId: orderId }];
                }
            });
        });
    };
    MySQLPaymentRepository.prototype.getOrderById = function (orderId_1, conn_1) {
        return __awaiter(this, arguments, void 0, function (orderId, conn, withLock) {
            var sql, rows;
            var _a;
            if (withLock === void 0) { withLock = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sql = withLock
                            ? 'SELECT * FROM payment_orders WHERE order_id = ? AND deleted_at IS NULL FOR UPDATE'
                            : 'SELECT * FROM payment_orders WHERE order_id = ? AND deleted_at IS NULL';
                        return [4 /*yield*/, this.db(conn).execute(sql, [orderId])];
                    case 1:
                        rows = (_b.sent())[0];
                        return [2 /*return*/, (_a = rows[0]) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    MySQLPaymentRepository.prototype.lockOrder = function (orderId, conn) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.db(conn).execute('SELECT * FROM payment_orders WHERE order_id = ? AND deleted_at IS NULL FOR UPDATE', [orderId])];
                    case 1:
                        rows = (_b.sent())[0];
                        return [2 /*return*/, (_a = rows[0]) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    MySQLPaymentRepository.prototype.updateOrderStatus = function (orderId, status, conn) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db(conn).execute('UPDATE payment_orders SET status = ?, updated_at = NOW() WHERE order_id = ?', [status, orderId])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MySQLPaymentRepository.prototype.countUserOrdersToday = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection_1.pool.execute("SELECT COUNT(*) as cnt FROM payment_orders\n         WHERE user_id = ? AND DATE(created_at) = CURDATE()\n           AND status NOT IN ('CANCELLED','FAILED')", [userId])];
                    case 1:
                        rows = (_a.sent())[0];
                        return [2 /*return*/, rows[0].cnt];
                }
            });
        });
    };
    // ─── Transacciones de pasarela ────────────────────────────────────────────────
    MySQLPaymentRepository.prototype.createTransaction = function (data, conn) {
        return __awaiter(this, void 0, void 0, function () {
            var transactionId, orderId, gatewayName, gatewayOrderId, status, amount, currency, gatewayRawResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transactionId = (0, crypto_1.randomUUID)();
                        orderId = data.orderId, gatewayName = data.gatewayName, gatewayOrderId = data.gatewayOrderId, status = data.status, amount = data.amount, currency = data.currency, gatewayRawResponse = data.gatewayRawResponse;
                        return [4 /*yield*/, this.db(conn).execute("INSERT INTO payment_transactions\n         (transaction_id, order_id, gateway_name, gateway_order_id,\n          status, amount, currency, gateway_raw_response)\n       VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [transactionId, orderId, gatewayName, gatewayOrderId !== null && gatewayOrderId !== void 0 ? gatewayOrderId : null, status, amount, currency, JSON.stringify(gatewayRawResponse)])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { transactionId: transactionId }];
                }
            });
        });
    };
    MySQLPaymentRepository.prototype.updateTransactionStatus = function (transactionId, status, rawResponse, conn) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db(conn).execute("UPDATE payment_transactions\n         SET status = ?, gateway_raw_response = ?, updated_at = NOW()\n       WHERE transaction_id = ?", [status, JSON.stringify(rawResponse), transactionId])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MySQLPaymentRepository.prototype.findTransactionByIdempotencyKey = function (idempotencyKey) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, connection_1.pool.execute("SELECT pt.order_id FROM payment_transactions pt\n         JOIN payment_orders o ON pt.order_id = o.order_id\n       WHERE o.idempotency_key = ? LIMIT 1", [idempotencyKey])];
                    case 1:
                        rows = (_b.sent())[0];
                        return [2 /*return*/, (_a = rows[0]) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    MySQLPaymentRepository.prototype.findTransactionByGatewayOrderId = function (gatewayOrderId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, connection_1.pool.execute('SELECT * FROM payment_transactions WHERE gateway_order_id = ? LIMIT 1', [gatewayOrderId])];
                    case 1:
                        rows = (_b.sent())[0];
                        return [2 /*return*/, (_a = rows[0]) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    /** Devuelve la transacción más reciente de una orden (para reembolsos) */
    MySQLPaymentRepository.prototype.getTransactionByOrderId = function (orderId, conn) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.db(conn).execute('SELECT * FROM payment_transactions WHERE order_id = ? ORDER BY created_at DESC LIMIT 1', [orderId])];
                    case 1:
                        rows = (_b.sent())[0];
                        return [2 /*return*/, (_a = rows[0]) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    // ─── Inventario / Producto ─────────────────────────────────────────────────────
    MySQLPaymentRepository.prototype.reserveProductForUser = function (productId, userId, conn) {
        return __awaiter(this, void 0, void 0, function () {
            var products, product, existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db(conn).execute("SELECT p.*, ps.available_stock\n         FROM products p\n         JOIN product_stock ps ON p.product_id = ps.product_id\n       WHERE p.product_id = ? AND p.deleted_at IS NULL\n         AND p.is_active = 1\n         FOR UPDATE", [productId])];
                    case 1:
                        products = (_a.sent())[0];
                        if (!products.length)
                            return [2 /*return*/, { available: false, product: null }];
                        product = products[0];
                        if (product.available_stock <= 0)
                            return [2 /*return*/, { available: false, product: product }];
                        return [4 /*yield*/, this.db(conn).execute("SELECT 1 FROM user_inventory\n         WHERE user_id = ? AND product_id = ? AND status = 'ACTIVE' LIMIT 1", [userId, productId])];
                    case 2:
                        existing = (_a.sent())[0];
                        if (existing.length)
                            return [2 /*return*/, { available: false, product: __assign(__assign({}, product), { alreadyOwned: true }) }];
                        // Reservar: decrementa available_stock atómicamente
                        return [4 /*yield*/, this.db(conn).execute("UPDATE product_stock\n         SET reserved_stock  = reserved_stock  + 1,\n             available_stock = available_stock - 1,\n             updated_at      = NOW()\n       WHERE product_id = ? AND available_stock > 0", [productId])];
                    case 3:
                        // Reservar: decrementa available_stock atómicamente
                        _a.sent();
                        return [2 /*return*/, { available: true, product: product }];
                }
            });
        });
    };
    MySQLPaymentRepository.prototype.assignProductToUser = function (orderId, userId, productId, conn) {
        return __awaiter(this, void 0, void 0, function () {
            var inventoryId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inventoryId = (0, crypto_1.randomUUID)();
                        return [4 /*yield*/, this.db(conn).execute("INSERT INTO user_inventory\n         (inventory_id, user_id, product_id, order_id, status, assigned_at)\n       VALUES (?, ?, ?, ?, 'ACTIVE', NOW())", [inventoryId, userId, productId, orderId])];
                    case 1:
                        _a.sent();
                        // Confirmar reserva: solo libera el reserved_stock
                        return [4 /*yield*/, this.db(conn).execute("UPDATE product_stock\n         SET reserved_stock = reserved_stock - 1,\n             updated_at     = NOW()\n       WHERE product_id = ?", [productId])];
                    case 2:
                        // Confirmar reserva: solo libera el reserved_stock
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MySQLPaymentRepository.prototype.releaseProductReservation = function (productId, _userId, conn) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db(conn).execute("UPDATE product_stock\n         SET reserved_stock  = reserved_stock  - 1,\n             available_stock = available_stock + 1,\n             updated_at      = NOW()\n       WHERE product_id = ? AND reserved_stock > 0", [productId])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // ─── Reglas de negocio ─────────────────────────────────────────────────────────
    MySQLPaymentRepository.prototype.getTaxRule = function (productId, countryCode) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, connection_1.pool.execute("SELECT tr.* FROM tax_rules tr\n       WHERE (tr.product_id = ? OR tr.product_id IS NULL)\n         AND tr.country_code = ?\n         AND tr.is_active = 1\n       ORDER BY tr.product_id DESC\n       LIMIT 1", [productId, countryCode])];
                    case 1:
                        rows = (_b.sent())[0];
                        return [2 /*return*/, (_a = rows[0]) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    MySQLPaymentRepository.prototype.getValidPromotion = function (promoCode, productId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows, promo, used;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection_1.pool.execute("SELECT p.* FROM promotions p\n       WHERE p.code = ?\n         AND p.is_active = 1\n         AND p.deleted_at IS NULL\n         AND (p.product_id IS NULL OR p.product_id = ?)\n         AND (p.max_uses IS NULL OR p.current_uses < p.max_uses)\n         AND (p.valid_from  IS NULL OR p.valid_from  <= NOW())\n         AND (p.valid_until IS NULL OR p.valid_until >= NOW())\n       LIMIT 1", [promoCode, productId])];
                    case 1:
                        rows = (_a.sent())[0];
                        if (!rows.length)
                            return [2 /*return*/, null];
                        promo = rows[0];
                        return [4 /*yield*/, connection_1.pool.execute("SELECT 1 FROM payment_orders\n         WHERE user_id = ? AND promotion_id = ?\n           AND status IN ('PAID','PROCESSING')\n       LIMIT 1", [userId, promo.promotion_id])];
                    case 2:
                        used = (_a.sent())[0];
                        if (used.length)
                            return [2 /*return*/, null];
                        return [2 /*return*/, promo];
                }
            });
        });
    };
    // ─── Reembolsos ───────────────────────────────────────────────────────────────
    MySQLPaymentRepository.prototype.createRefund = function (data, conn) {
        return __awaiter(this, void 0, void 0, function () {
            var refundId, transactionId, orderId, amount, reason, gatewayRefundId, requestedBy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        refundId = (0, crypto_1.randomUUID)();
                        transactionId = data.transactionId, orderId = data.orderId, amount = data.amount, reason = data.reason, gatewayRefundId = data.gatewayRefundId, requestedBy = data.requestedBy;
                        return [4 /*yield*/, this.db(conn).execute("INSERT INTO refunds\n         (refund_id, transaction_id, order_id, amount, reason,\n          gateway_refund_id, requested_by, status)\n       VALUES (?, ?, ?, ?, ?, ?, ?, 'COMPLETED')", [refundId, transactionId, orderId, amount, reason, gatewayRefundId, requestedBy])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { refundId: refundId }];
                }
            });
        });
    };
    // ─── Auditoría (INSERT ONLY — nunca UPDATE/DELETE) ────────────────────────────
    MySQLPaymentRepository.prototype.createAuditLog = function (data, conn) {
        return __awaiter(this, void 0, void 0, function () {
            var entityType, entityId, action, previousStatus, newStatus, actorId, metadata;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        entityType = data.entityType, entityId = data.entityId, action = data.action, previousStatus = data.previousStatus, newStatus = data.newStatus, actorId = data.actorId, metadata = data.metadata;
                        return [4 /*yield*/, this.db(conn).execute("INSERT INTO audit_logs\n         (log_id, entity_type, entity_id, action,\n          previous_status, new_status, actor_id, metadata, ip_address)\n       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                                (0, crypto_1.randomUUID)(), entityType, entityId, action,
                                previousStatus !== null && previousStatus !== void 0 ? previousStatus : null,
                                newStatus !== null && newStatus !== void 0 ? newStatus : null,
                                String(actorId), JSON.stringify(metadata !== null && metadata !== void 0 ? metadata : {}),
                                (_a = metadata === null || metadata === void 0 ? void 0 : metadata.ipAddress) !== null && _a !== void 0 ? _a : null,
                            ])];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // ─── Legacy (compatibilidad con IPaymentRepository original de Nexus) ─────────
    MySQLPaymentRepository.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getOrderById(id)];
                    case 1:
                        order = _a.sent();
                        if (!order)
                            return [2 /*return*/, null];
                        return [2 /*return*/, { id: order.order_id, status: order.status }];
                }
            });
        });
    };
    MySQLPaymentRepository.prototype.findByExternalId = function (externalId) {
        return __awaiter(this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findTransactionByGatewayOrderId(externalId)];
                    case 1:
                        tx = _a.sent();
                        if (!tx)
                            return [2 /*return*/, null];
                        return [2 /*return*/, { id: tx.transaction_id, status: tx.status }];
                }
            });
        });
    };
    MySQLPaymentRepository.prototype.updateStatus = function (id, status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateOrderStatus(id, status)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MySQLPaymentRepository;
}());
exports.MySQLPaymentRepository = MySQLPaymentRepository;
// Singleton para inyección en toda la app
exports.paymentRepository = new MySQLPaymentRepository();
