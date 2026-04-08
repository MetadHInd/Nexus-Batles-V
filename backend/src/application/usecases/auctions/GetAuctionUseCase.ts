/**
 * GetAuctionUseCase.ts — Application / Use Cases / Auctions
 * HU: Rutas de API Gateway para subastas
 *
 * GET /api/v1/auctions/:id — Retorna el detalle de una subasta.
 */

import type { IAuctionRepository } from '../../../domain/repositories/IAuctionRepository';
import type { Auction } from '../../../domain/entities/Auction';
import { NotFoundError } from '../../../domain/errors/DomainError';

export class GetAuctionUseCase {
  constructor(private readonly auctionRepository: IAuctionRepository) {}

  async execute(auctionId: string): Promise<Auction> {
    const auction = await this.auctionRepository.findById(auctionId);
    if (!auction) throw new NotFoundError('Subasta');
    return auction;
  }
}
