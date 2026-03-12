import { CartRepository } from "@domain/repositories/ICartRepository";
import { OrderRepository } from "@domain/repositories/IOrderRepository";
import { ProductRepository } from "@domain/repositories/IProductRepository";
export declare class ConfirmPurchase {
    private readonly cartRepository;
    private readonly productRepository;
    private readonly orderRepository;
    constructor(cartRepository: CartRepository, productRepository: ProductRepository, orderRepository: OrderRepository);
    execute(userId: number): Promise<void>;
}
