import { Request, Response } from "express";
import { AddProductToCart } from "../../application/usecases/cart/AddProductToCart";
import { MySQLCartRepository } from "../repositories/MySQLCartRepository";
import { MySQLProductRepository } from "../repositories/MySQLProductRepository";

const cartRepository    = new MySQLCartRepository();
const productRepository = new MySQLProductRepository();

export class CartController {

  static async add(req: Request, res: Response) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.body.userId; // luego lo sacas del token

      const useCase = new AddProductToCart(cartRepository, productRepository);
      await useCase.execute(userId, productId, quantity);

      res.status(200).json({ message: "Producto agregado al carrito" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}