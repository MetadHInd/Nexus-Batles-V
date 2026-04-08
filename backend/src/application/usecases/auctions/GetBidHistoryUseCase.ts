/**
 * GetBidHistoryUseCase.ts — Application / Use Cases / Auctions
 * HU: Rutas de API Gateway para subastas
 *
 * GET /api/v1/auctions/:id/pujas — Retorna el historial de pujas de una subasta.
 */

import type { IAuctionRepository } from '../../../domain/repositories/IAuctionRepository';
import type { Bid } from '../../../domain/entities/Auction';
import { NotFoundError } from '../../../domain/errors/DomainError';

export interface GetBidHistoryResult {
  auctionId:    string;
  currentPrice: number;
  bids:         Bid[];
}

export class GetBidHistoryUseCase {
  constructor(private readonly auctionRepository: IAuctionRepository) {}

  async execute(auctionId: string): Promise<GetBidHistoryResult> {
    const auction = await this.auctionRepository.findById(auctionId);
    if (!auction) throw new NotFoundError('Subasta');
    return {
      auctionId,
      currentPrice: auction.currentPrice,
      bids:         auction.bids,
    };
  }
}
