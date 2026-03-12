"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playersApi = void 0;
var client_1 = require("./client");
exports.playersApi = {
    getMe: function () {
        return client_1.apiClient.get('/players/me');
    },
    updateMe: function (data) {
        return client_1.apiClient.patch('/players/me', data);
    },
    getRankings: function (params) {
        return client_1.apiClient.get('/players/rankings', { params: params });
    },
    getMyInventory: function () {
        return client_1.apiClient.get('/players/me/inventory');
    },
    getById: function (id) {
        return client_1.apiClient.get("/players/".concat(id));
    },
};
