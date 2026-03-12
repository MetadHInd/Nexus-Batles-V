"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
var Order = /** @class */ (function () {
    function Order(id, userId, total, createdAt) {
        if (createdAt === void 0) { createdAt = new Date(); }
        this.id = id;
        this.userId = userId;
        this.total = total;
        this.createdAt = createdAt;
        if (this.total <= 0) {
            throw new Error("El total de la orden debe ser mayor a 0");
        }
    }
    return Order;
}());
exports.Order = Order;
