"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmPurchase = void 0;
class ConfirmPurchase {
    cartRepository;
    productRepository;
    orderRepository;
    constructor(cartRepository, productRepository, orderRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }
    async execute(userId) {
        const cartItems = await this.cartRepository.getCart(userId);
        if (cartItems.length === 0) {
            throw new Error("El carrito está vacío");
        }
        for (const item of cartItems) {
            const product = await this.productRepository.findById(item.productId);
            if (!product)
                throw new Error("Producto no encontrado");
            if (product.stock < item.quantity) {
                throw new Error(`Stock insuficiente para ${product.name}`);
            }
        }
        await this.orderRepository.createOrderWithItems(userId, cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        })));
    }
}
exports.ConfirmPurchase = ConfirmPurchase;
//# sourceMappingURL=ConfirmPurchase.js.map