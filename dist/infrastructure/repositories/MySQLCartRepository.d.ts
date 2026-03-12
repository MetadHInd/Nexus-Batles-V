import { CartRepository } from "../../domain/repositories/ICartRepository";
import { CartItem } from "../../domain/entities/Cart";
export declare class MySQLCartRepository implements CartRepository {
    addProduct(userId: number, productId: number, quantity: number): Promise<void>;
    getCart(userId: number): Promise<CartItem[]>;
    updateQuantity(id: number, quantity: number): Promise<void>;
    removeProduct(id: number): Promise<void>;
}
