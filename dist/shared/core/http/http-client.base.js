"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClientBase = void 0;
const axios_1 = require("axios");
class HttpClientBase {
    client;
    baseEndpointURI;
    globalHeaders = {
        Accept: 'application/json',
        'App-Version': '1.0.0',
    };
    constructor(baseURL) {
        if (!baseURL) {
            throw new Error('Base URL is required to initialize HttpClientBase');
        }
        this.baseEndpointURI = baseURL;
        const isProduction = process.env.NODE_ENV === 'production';
        const timeout = isProduction ? 10000 : 30000;
        this.client = axios_1.default.create({
            baseURL,
            timeout,
        });
        this.setupInterceptors();
    }
    setupInterceptors() {
        this.client.interceptors.response.use((response) => response.data, (error) => {
            const errorMessage = error.response?.data.message ||
                error.message ||
                'An unknown error occurred';
            return Promise.reject(new Error(errorMessage));
        });
    }
    buildURI(endpoint) {
        return `${this.baseEndpointURI.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    }
    getHeaders(specificHeaders = {}, customHeaders = {}) {
        return {
            ...this.globalHeaders,
            ...specificHeaders,
            ...customHeaders,
        };
    }
    async get(endpoint, customHeaders = {}, config) {
        const headers = this.getHeaders({}, customHeaders);
        const url = this.buildURI(endpoint);
        console.log(headers);
        const response = await this.client.get(url, { headers, ...config });
        return response.data;
    }
    async post(endpoint, body = {}, customHeaders = {}, config) {
        const headers = this.getHeaders({}, customHeaders);
        const url = this.buildURI(endpoint);
        console.log(url);
        const response = await this.client.post(url, body, {
            headers,
            ...config,
        });
        console.log('Response from interceptor:', response);
        console.log('Response type:', typeof response);
        return response;
    }
    async put(endpoint, body = {}, customHeaders = {}, config) {
        const headers = this.getHeaders({}, customHeaders);
        const url = this.buildURI(endpoint);
        const response = await this.client.put(url, body, {
            headers,
            ...config,
        });
        return response.data;
    }
    async delete(endpoint, customHeaders = {}, config) {
        const headers = this.getHeaders({}, customHeaders);
        const url = this.buildURI(endpoint);
        const response = await this.client.delete(url, { headers, ...config });
        return response.data;
    }
}
exports.HttpClientBase = HttpClientBase;
//# sourceMappingURL=http-client.base.js.map