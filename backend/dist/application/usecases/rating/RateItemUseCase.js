"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateProductUseCase = void 0;
const rating_validator_1 = require("../../validators/rating.validator");
const Rating_1 = require("../../../domain/entities/Rating");
const zod_1 = require("zod");
class RateProductUseCase {
    constructor(ratingRepository, productRepository) {
        this.ratingRepository = ratingRepository;
        this.productRepository = productRepository;
    }
    async execute(request) {
        try {
            // 1. Validar score
            const validated = rating_validator_1.rateItemSchema.parse({ score: request.score });
            // 2. Verificar que el producto existe
            const product = await this.productRepository.findById(request.productId);
            if (!product) {
                throw new Error('El producto no existe');
            }
            // ⚠️ Convertir productId a itemId (ej: 1 → "item-1")
            const itemId = `item-${request.productId}`;
            // 3. Buscar si el usuario ya calificó (✅ findByUserAndItem)
            const existingRating = await this.ratingRepository.findByUserAndItem(request.userId, itemId // ⚠️ Usar itemId, no productId
            );
            if (existingRating) {
                // 4a. ACTUALIZAR calificación existente
                const updatedRating = existingRating.updateScore(validated.score);
                await this.ratingRepository.update(updatedRating.id, updatedRating.score);
                return {
                    message: 'Calificación actualizada',
                    rating: {
                        id: updatedRating.id,
                        productId: request.productId, // ✅ Mantener productId para respuesta
                        itemId: updatedRating.itemId,
                        score: updatedRating.score,
                        createdAt: updatedRating.createdAt,
                        updatedAt: updatedRating.updatedAt
                    }
                };
            }
            else {
                // 4b. CREAR nueva calificación (✅ Rating.create espera itemId: string)
                const newRating = Rating_1.Rating.create(itemId, // ⚠️ string, no number
                request.userId, validated.score);
                await this.ratingRepository.create(newRating);
                return {
                    message: 'Calificación guardada',
                    rating: {
                        id: newRating.id,
                        productId: request.productId, // ✅ Mantener productId para respuesta
                        itemId: newRating.itemId,
                        score: newRating.score,
                        createdAt: newRating.createdAt,
                        updatedAt: newRating.updatedAt
                    }
                };
            }
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                throw new Error(`Datos inválidos: ${error.issues[0].message}`);
            }
            throw error;
        }
    }
}
exports.RateProductUseCase = RateProductUseCase;
//# sourceMappingURL=RateItemUseCase.js.map