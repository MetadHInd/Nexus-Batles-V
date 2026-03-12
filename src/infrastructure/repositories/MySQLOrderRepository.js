"use strict";
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
exports.MySQLOrderRepository = void 0;
var Order_1 = require("../../domain/entities/Order");
var connection_1 = require("@infrastructure/database/connection");
var MySQLOrderRepository = /** @class */ (function () {
    function MySQLOrderRepository() {
    }
    MySQLOrderRepository.prototype.createOrderWithItems = function (userId, items) {
        return __awaiter(this, void 0, void 0, function () {
            var connection, total, _i, items_1, item, orderResult, orderId, _a, items_2, item, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, connection_1.pool.getConnection()];
                    case 1:
                        connection = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 12, 14, 15]);
                        return [4 /*yield*/, connection.beginTransaction()];
                    case 3:
                        _b.sent();
                        total = 0;
                        for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                            item = items_1[_i];
                            total += item.price * item.quantity;
                        }
                        return [4 /*yield*/, connection.query("INSERT INTO orders (user_id, total) VALUES (?, ?)", [userId, total])];
                    case 4:
                        orderResult = (_b.sent())[0];
                        orderId = orderResult.insertId;
                        _a = 0, items_2 = items;
                        _b.label = 5;
                    case 5:
                        if (!(_a < items_2.length)) return [3 /*break*/, 9];
                        item = items_2[_a];
                        return [4 /*yield*/, connection.query("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)", [orderId, item.productId, item.quantity, item.price])];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, connection.query("UPDATE products SET stock = stock - ? WHERE id = ?", [item.quantity, item.productId])];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        _a++;
                        return [3 /*break*/, 5];
                    case 9: 
                    // Vaciar carrito
                    return [4 /*yield*/, connection.query("DELETE FROM cart WHERE user_id = ?", [userId])];
                    case 10:
                        // Vaciar carrito
                        _b.sent();
                        return [4 /*yield*/, connection.commit()];
                    case 11:
                        _b.sent();
                        return [3 /*break*/, 15];
                    case 12:
                        error_1 = _b.sent();
                        return [4 /*yield*/, connection.rollback()];
                    case 13:
                        _b.sent();
                        throw error_1;
                    case 14:
                        connection.release();
                        return [7 /*endfinally*/];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    MySQLOrderRepository.prototype.findByUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection_1.pool.query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [userId])];
                    case 1:
                        rows = (_a.sent())[0];
                        return [2 /*return*/, rows.map(function (row) {
                                return new Order_1.Order(row.id, row.user_id, row.total, row.created_at);
                            })];
                }
            });
        });
    };
    return MySQLOrderRepository;
}());
exports.MySQLOrderRepository = MySQLOrderRepository;
