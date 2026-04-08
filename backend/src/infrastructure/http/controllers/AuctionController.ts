/**
 * AuctionController.ts — Infrastructure / HTTP / Controllers
 * HU: Rutas de API Gateway para subastas
 *
 * Maneja las peticiones HTTP del modulo de subastas y delega
 * la logica de negocio a los use cases correspondientes.
 *
 * Codigos HTTP retornados:
 *   200 — OK (lista, detalle, historial de pujas)
 *   201 — Created (subasta publicada, puja realizada)
 *   400 — Bad Request (validacion fallida)
 *   401 — Unauthorized (token ausente o invalido)
 *   403 — Forbidden (rol insuficiente)
 *   404 — Not Found (subasta no encontrada)
 *   500 — Internal Server Error
 */

import { Request, Response, NextFunction } from 'express';
import { ListAuctionsUseCase }   from '../../../application/usecases/auctions/ListAuctionsUseCase';
import { GetAuctionUseCase }     from '../../../application/usecases/auctions/GetAuctionUseCase';
import { CreateAuctionUseCase }  from '../../../application/usecases/auctions/CreateAuctionUseCase';
import { CancelAuctionUseCase }  from '../../../application/usecases/auctions/CancelAuctionUseCase';
import { PlaceBidUseCase }       from '../../../application/usecases/auctions/PlaceBidUseCase';
import { GetBidHistoryUseCase }  from '../../../application/usecases/auctions/GetBidHistoryUseCase';
import type { IAuctionRepository } from '../../../domain/repositories/IAuctionRepository';
import type { IPlayerRepository }  from '../../../domain/repositories/IPlayerRepository';

export class AuctionController {
  constructor(
    private readonly auctionRepository: IAuctionRepository,
    private readonly playerRepository:  IPlayerRepository,
  ) {}

  // GET /api/v1/auctions
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit  = Math.min(Number(req.query['limit'])  || 20, 100);
      const offset = Math.max(Number(req.query['offset']) || 0,  0);
      const useCase = new ListAuctionsUseCase(this.auctionRepository);
      const result  = await useCase.execute({ limit, offset });
      res.status(200).json(result);
    } catch (err) { next(err); }
  }

  // GET /api/v1/auctions/:id
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetAuctionUseCase(this.auctionRepository);
      const auction = await useCase.execute(req.params['id']!);
      res.status(200).json(auction);
    } catch (err) { next(err); }
  }

  // POST /api/v1/auctions  (ADMIN)
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user    = (req as any).user;
      const useCase = new CreateAuctionUseCase(this.auctionRepository);
      const auction = await useCase.execute({
        itemId:     req.body.itemId,
        sellerId:   String(user?.userId ?? user?.id),
        startPrice: req.body.startPrice,
        endsAt:     new Date(req.body.endsAt),
      });
      res.status(201).json(auction);
    } catch (err) { next(err); }
  }

  // DELETE /api/v1/auctions/:id  (ADMIN)
  async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new CancelAuctionUseCase(this.auctionRepository);
      await useCase.execute({
        auctionId: req.params['id']!,
        reason:    req.body?.reason ?? 'Cancelada por administrador',
      });
      res.status(200).json({ message: 'Subasta cancelada correctamente' });
    } catch (err) { next(err); }
  }

  // POST /api/v1/auctions/:id/pujas  (autenticado)
  async placeBid(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user    = (req as any).user;
      const useCase = new PlaceBidUseCase(this.auctionRepository, this.playerRepository);
      const auction = await useCase.execute({
        auctionId: req.params['id']!,
        playerId:  String(user?.userId ?? user?.id),
        amount:    req.body.amount,
      });
      res.status(201).json(auction);
    } catch (err) { next(err); }
  }

  // GET /api/v1/auctions/:id/pujas
  async getBidHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetBidHistoryUseCase(this.auctionRepository);
      const result  = await useCase.execute(req.params['id']!);
      res.status(200).json(result);
    } catch (err) { next(err); }
  }
}
