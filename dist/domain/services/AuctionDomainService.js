"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionDomainService = void 0;
const DomainError_1 = require("../errors/DomainError");
class AuctionDomainService {
    validateBid(auction, bid) {
        if (auction.status !== 'ACTIVE') {
            throw new DomainError_1.ConflictError('La subasta no esta activa');
        }
        if (new Date() > auction.endsAt) {
            throw new DomainError_1.ConflictError('La subasta ha expirado');
        }
        if (bid.playerId === auction.sellerId) {
            throw new DomainError_1.ValidationError('El vendedor no puede pujar en su propia subasta');
        }
        if (bid.amount <= auction.currentPrice) {
            throw new DomainError_1.ConflictError(`La puja debe ser mayor a ${auction.currentPrice}`);
        }
    }
}
exports.AuctionDomainService = AuctionDomainService;
//# sourceMappingURL=AuctionDomainService.js.map