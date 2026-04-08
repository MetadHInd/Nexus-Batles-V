/**
 * CancelAuctionUseCase.ts — Application / Use Cases / Auctions
 * HU: Rutas de API Gateway para subastas
 *
 * DELETE /api/v1/auctions/:id — Cancela una subasta (solo ADMIN).
 */

import type { IAuctionRepository } from '../../../domain/repositories/IAuctionRepository';
import { NotFoundError } from '../../../domain/errors/DomainError';

export interface CancelAuctionInput {
  auctionId: string;
  reason:    string;
}

export class CancelAuctionUseCase {
  constructor(private readonly auctionRepository: IAuctionRepository) {}

  async execute(input: CancelAuctionInput): Promise<void> {
    const auction = await this.auctionRepository.findById(input.auctionId);
    if (!auction) throw new NotFoundError('Subasta');
    await this.auctionRepository.cancel(input.auctionId, input.reason);
  }
}
