"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductRatingUseCase = void 0;
class GetProductRatingUseCase {
    constructor(ratingRepository, productRepository) {
        this.ratingRepository = ratingRepository;
        this.productRepository = productRepository;
    }
    async execute(productId) {
        // Verificar que el producto existe
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error('El producto no existe');
        }
        // Obtener calificaciones
        const rating = await this.ratingRepository.getAverageByProduct(String(productId));
        return {
            average: rating.average,
            count: rating.count
        };
    }
}
exports.GetProductRatingUseCase = GetProductRatingUseCase;
//# sourceMappingURL=GetItemRatingUseCase.js.map