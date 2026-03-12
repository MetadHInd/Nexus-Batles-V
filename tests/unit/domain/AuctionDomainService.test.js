"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var AuctionDomainService_1 = require("../../../src/domain/services/AuctionDomainService");
describe('AuctionDomainService', function () {
    var service = new AuctionDomainService_1.AuctionDomainService();
    var baseAuction = {
        id: '1', itemId: 'item1', sellerId: 'seller1',
        startPrice: 100, currentPrice: 100, currentBidderId: null, bids: [],
        status: 'ACTIVE', endsAt: new Date(Date.now() + 86400000), createdAt: new Date(),
    };
    it('debe rechazar puja del propio vendedor', function () {
        var bid = { playerId: 'seller1', amount: 200, placedAt: new Date() };
        expect(function () { return service.validateBid(baseAuction, bid); }).toThrow('vendedor');
    });
    it('debe rechazar puja menor o igual al precio actual', function () {
        var bid = { playerId: 'player2', amount: 100, placedAt: new Date() };
        expect(function () { return service.validateBid(baseAuction, bid); }).toThrow('mayor');
    });
    it('debe aceptar puja valida', function () {
        var bid = { playerId: 'player2', amount: 150, placedAt: new Date() };
        expect(function () { return service.validateBid(baseAuction, bid); }).not.toThrow();
    });
    it('debe rechazar si la subasta no esta activa', function () {
        var closed = __assign(__assign({}, baseAuction), { status: 'CLOSED' });
        var bid = { playerId: 'player2', amount: 200, placedAt: new Date() };
        expect(function () { return service.validateBid(closed, bid); }).toThrow('activa');
    });
});
