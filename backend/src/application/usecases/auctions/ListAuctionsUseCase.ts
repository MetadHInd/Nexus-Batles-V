/**
 * ListAuctionsUseCase.ts — Application / Use Cases / Auctions
 * HU: Rutas de API Gateway para subastas
 *
 * GET /api/v1/auctions — Lista subastas activas con paginacion.
 */

import type { IAuctionRepository } from '../../../domain/repositories/IAuctionRepository';
import type { Auction } from '../../../domain/entities/Auction';

export interface ListAuctionsInput {
  limit:  number;
  offset: number;
}

export interface ListAuctionsResult {
  auctions: Auction[];
  limit:    number;
  offset:   number;
}

export class ListAuctionsUseCase {
  constructor(private readonly auctionRepository: IAuctionRepository) {}

  async execute(input: ListAuctionsInput): Promise<ListAuctionsResult> {
    const { limit, offset } = input;
    const auctions = await this.auctionRepository.findActive(limit, offset);
    return { auctions, limit, offset };
  }
}
