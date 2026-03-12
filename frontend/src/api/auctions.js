"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auctionsApi = void 0;
var client_1 = require("./client");
exports.auctionsApi = {
    getAll: function (params) {
        return client_1.apiClient.get('/auctions', { params: params });
    },
    getById: function (id) {
        return client_1.apiClient.get("/auctions/".concat(id));
    },
    placeBid: function (auctionId, amount) {
        return client_1.apiClient.post("/auctions/".concat(auctionId, "/bids"), { amount: amount });
    },
};
