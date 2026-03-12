"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authApi = void 0;
var client_1 = require("./client");
exports.authApi = {
    register: function (data) {
        return client_1.apiClient.post('/auth/register', data);
    },
    login: function (data) {
        return client_1.apiClient.post('/auth/login', data);
    },
    logout: function (refreshToken) {
        return client_1.apiClient.post('/auth/logout', { refreshToken: refreshToken });
    },
    refresh: function (refreshToken) {
        return client_1.apiClient.post('/auth/refresh', { refreshToken: refreshToken });
    },
};
