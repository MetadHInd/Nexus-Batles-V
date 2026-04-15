"use strict";
/**
 * CartController.ts — Infrastructure / HTTP / Controllers
 * FIX: userId ahora se extrae del token JWT (req as any).user.sub,
 *      no de req.body.userId (inseguro).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const AddProductToCart_1 = require("../../../application/usecases/cart/AddProductToCart");
const MySQLCartRepository_1 = require("../../repositories/MySQLCartRepository");
const MySQLProductRepository_1 = require("../../repositories/MySQLProductRepository");
const cartRepository = new MySQLCartRepository_1.MySQLCartRepository();
const productRepository = new MySQLProductRepository_1.MySQLProductRepository();
class CartController {
    static async add(req, res) {
        try {
            const { productId, quantity } = req.body;
            const userId = req.user?.sub ?? req.user?.id;
            if (!userId) {
                res.status(401).json({ error: 'No autenticado' });
                return;
            }
            const useCase = new AddProductToCart_1.AddProductToCart(cartRepository, productRepository);
            await useCase.execute(userId, productId, quantity);
            res.status(200).json({ message: 'Producto agregado al carrito' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.CartController = CartController;
//# sourceMappingURL=CartController.js.map