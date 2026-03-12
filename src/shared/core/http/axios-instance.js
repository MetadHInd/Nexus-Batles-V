"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosInstance = void 0;
var axios_1 = require("axios");
exports.axiosInstance = axios_1.default.create({
    baseURL: (_a = process.env.API_URL) !== null && _a !== void 0 ? _a : 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
