"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProductToCart = void 0;
class AddProductToCart {
    cartRepository;
    productRepository;
    constructor(cartRepository, productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }
    async execute(userId, productId, quantity) {
        if (quantity <= 0) {
            throw new Error("Cantidad inválida");
        }
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error("Producto no encontrado");
        }
        if (product.stock < quantity) {
            throw new Error("Stock insuficiente");
        }
        await this.cartRepository.addProduct(userId, productId, quantity);
    }
}
exports.AddProductToCart = AddProductToCart;
//# sourceMappingURL=AddProductToCart.js.map