import { IAuctionRepository } from '../../../domain/repositories/IAuctionRepository';
import { IPlayerRepository } from '../../../domain/repositories/IPlayerRepository';
export interface PlaceBidInput {
    auctionId: string;
    playerId: string;
    amount: number;
}
export declare class PlaceBidUseCase {
    private readonly auctionRepository;
    private readonly playerRepository;
    private auctionService;
    private playerService;
    constructor(auctionRepository: IAuctionRepository, playerRepository: IPlayerRepository);
    execute(input: PlaceBidInput): Promise<import("../../../domain/entities/Auction").Auction>;
}
//# sourceMappingURL=PlaceBidUseCase.d.ts.map