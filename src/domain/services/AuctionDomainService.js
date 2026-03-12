"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionDomainService = void 0;
var DomainError_1 = require("../errors/DomainError");
var AuctionDomainService = /** @class */ (function () {
    function AuctionDomainService() {
    }
    AuctionDomainService.prototype.validateBid = function (auction, bid) {
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
            throw new DomainError_1.ConflictError("La puja debe ser mayor a ".concat(auction.currentPrice));
        }
    };
    return AuctionDomainService;
}());
exports.AuctionDomainService = AuctionDomainService;
