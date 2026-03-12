"use strict";
/**
 * payments.ts — API layer for the payments module
 * All calls go through apiClient (handles JWT + refresh)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsApi = void 0;
var client_1 = require("./client");
// ─── API calls ────────────────────────────────────────────────────────────────
exports.paymentsApi = {
    createOrder: function (payload) {
        return client_1.apiClient.post('/payments/orders', payload);
    },
    processPayment: function (orderId, payload) {
        return client_1.apiClient.post("/payments/orders/".concat(orderId, "/pay"), payload);
    },
    getOrderStatus: function (orderId) {
        return client_1.apiClient.get("/payments/orders/".concat(orderId));
    },
    // Products available in the shop (uses existing product endpoint)
    getShopProducts: function () {
        return client_1.apiClient.get('/products?shop=true');
    },
};
