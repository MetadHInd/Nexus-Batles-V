"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosInstance = void 0;
const axios_1 = require("axios");
exports.axiosInstance = axios_1.default.create({
    baseURL: process.env.API_URL ?? 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
//# sourceMappingURL=axios-instance.js.map