import { MySQLRatingRepository } from '../../../infrastructure/repositories/MySQLRatingRepository';
import { MySQLProductRepository } from '../../../infrastructure/repositories/MySQLProductRepository';

export class GetProductRatingUseCase {
  constructor(
    private ratingRepository: MySQLRatingRepository,
    private productRepository: MySQLProductRepository
  ) {}

  async execute(productId: number) {
    // Verificar que el producto existe
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('El producto no existe');
    }

    // ⚠️ Convertir productId a itemId (ej: 1 → "item-1")
    const itemId = `item-${productId}`;

    // ✅ Usar getAverageByItem (NO getAverageByProduct)
    const rating = await this.ratingRepository.getAverageByItem(itemId);
    
    return {
      average: rating.average,
      count: rating.count
    };
  }
}