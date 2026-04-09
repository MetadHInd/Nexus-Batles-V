"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
class Order {
    constructor(id, userId, total, createdAt = new Date()) {
        this.id = id;
        this.userId = userId;
        this.total = total;
        this.createdAt = createdAt;
        if (this.total <= 0) {
            throw new Error("El total de la orden debe ser mayor a 0");
        }
    }
}
exports.Order = Order;
//# sourceMappingURL=Order.js.map