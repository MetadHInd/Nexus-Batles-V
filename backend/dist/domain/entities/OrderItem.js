"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = void 0;
class OrderItem {
    constructor(orderId, productId, quantity, price) {
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
        if (this.quantity <= 0) {
            throw new Error("Cantidad inválida");
        }
    }
}
exports.OrderItem = OrderItem;
//# sourceMappingURL=OrderItem.js.map