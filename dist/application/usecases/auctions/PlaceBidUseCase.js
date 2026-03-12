"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceBidUseCase = void 0;
const AuctionDomainService_1 = require("../../../domain/services/AuctionDomainService");
const PlayerDomainService_1 = require("../../../domain/services/PlayerDomainService");
const DomainError_1 = require("../../../domain/errors/DomainError");
class PlaceBidUseCase {
    auctionRepository;
    playerRepository;
    auctionService = new AuctionDomainService_1.AuctionDomainService();
    playerService = new PlayerDomainService_1.PlayerDomainService();
    constructor(auctionRepository, playerRepository) {
        this.auctionRepository = auctionRepository;
        this.playerRepository = playerRepository;
    }
    async execute(input) {
        const [auction, player] = await Promise.all([
            this.auctionRepository.findById(input.auctionId),
            this.playerRepository.findById(input.playerId),
        ]);
        if (!auction)
            throw new DomainError_1.NotFoundError('Subasta');
        if (!player)
            throw new DomainError_1.NotFoundError('Jugador');
        const bid = { playerId: input.playerId, amount: input.amount, placedAt: new Date() };
        this.auctionService.validateBid(auction, bid);
        this.playerService.validateSufficientCoins(player, input.amount);
        return this.auctionRepository.placeBid(input.auctionId, bid);
    }
}
exports.PlaceBidUseCase = PlaceBidUseCase;
//# sourceMappingURL=PlaceBidUseCase.js.map