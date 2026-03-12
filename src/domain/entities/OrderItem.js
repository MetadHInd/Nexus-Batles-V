"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = void 0;
var OrderItem = /** @class */ (function () {
    function OrderItem(orderId, productId, quantity, price) {
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
        if (this.quantity <= 0) {
            throw new Error("Cantidad inválida");
        }
    }
    return OrderItem;
}());
exports.OrderItem = OrderItem;
