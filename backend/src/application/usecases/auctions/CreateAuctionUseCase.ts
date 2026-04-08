/**
 * CreateAuctionUseCase.ts — Application / Use Cases / Auctions
 * HU: Rutas de API Gateway para subastas
 *
 * POST /api/v1/auctions — Publica una nueva subasta (solo ADMIN).
 */

import type { IAuctionRepository } from '../../../domain/repositories/IAuctionRepository';
import type { Auction } from '../../../domain/entities/Auction';
import { ValidationError } from '../../../domain/errors/DomainError';

export interface CreateAuctionInput {
  itemId:     string;
  sellerId:   string;
  startPrice: number;
  endsAt:     Date;
}

export class CreateAuctionUseCase {
  constructor(private readonly auctionRepository: IAuctionRepository) {}

  async execute(input: CreateAuctionInput): Promise<Auction> {
    if (input.endsAt <= new Date()) {
      throw new ValidationError('La fecha de cierre debe ser futura');
    }
    return this.auctionRepository.create({
      itemId:          input.itemId,
      sellerId:        input.sellerId,
      startPrice:      input.startPrice,
      currentPrice:    input.startPrice,
      status:          'ACTIVE',
      endsAt:          input.endsAt,
    });
  }
}
