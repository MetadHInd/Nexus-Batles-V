import { ProductRepository } from "../../../domain/repositories/IProductRepository";
import { CartRepository } from "../../../domain/repositories/ICartRepository";
export declare class AddProductToCart {
    private readonly cartRepository;
    private readonly productRepository;
    constructor(cartRepository: CartRepository, productRepository: ProductRepository);
    execute(userId: number, productId: number, quantity: number): Promise<void>;
}
