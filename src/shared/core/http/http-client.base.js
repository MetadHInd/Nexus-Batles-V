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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClientBase = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
var axios_1 = require("axios");
var HttpClientBase = /** @class */ (function () {
    function HttpClientBase(baseURL) {
        this.globalHeaders = {
            Accept: 'application/json',
            'App-Version': '1.0.0',
        };
        if (!baseURL) {
            throw new Error('Base URL is required to initialize HttpClientBase');
        }
        this.baseEndpointURI = baseURL;
        // En produccion timeout corto (10s), en dev/sandbox timeout largo (60s) para cold starts
        var isProduction = process.env.NODE_ENV === 'production';
        var timeout = isProduction ? 10000 : 30000;
        this.client = axios_1.default.create({
            baseURL: baseURL,
            timeout: timeout,
        });
        this.setupInterceptors();
    }
    HttpClientBase.prototype.setupInterceptors = function () {
        this.client.interceptors.response.use(function (response) { return response.data; }, function (error) {
            var _a;
            var errorMessage = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data.message) ||
                error.message ||
                'An unknown error occurred';
            return Promise.reject(new Error(errorMessage));
        });
    };
    HttpClientBase.prototype.buildURI = function (endpoint) {
        return "".concat(this.baseEndpointURI.replace(/\/$/, ''), "/").concat(endpoint.replace(/^\//, ''));
    };
    HttpClientBase.prototype.getHeaders = function (specificHeaders, customHeaders) {
        if (specificHeaders === void 0) { specificHeaders = {}; }
        if (customHeaders === void 0) { customHeaders = {}; }
        return __assign(__assign(__assign({}, this.globalHeaders), specificHeaders), customHeaders);
    };
    HttpClientBase.prototype.get = function (endpoint_1) {
        return __awaiter(this, arguments, void 0, function (endpoint, customHeaders, config) {
            var headers, url, response;
            if (customHeaders === void 0) { customHeaders = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headers = this.getHeaders({}, customHeaders);
                        url = this.buildURI(endpoint);
                        console.log(headers);
                        return [4 /*yield*/, this.client.get(url, __assign({ headers: headers }, config))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    HttpClientBase.prototype.post = function (endpoint_1) {
        return __awaiter(this, arguments, void 0, function (endpoint, body, customHeaders, config) {
            var headers, url, response;
            if (body === void 0) { body = {}; }
            if (customHeaders === void 0) { customHeaders = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headers = this.getHeaders({}, customHeaders);
                        url = this.buildURI(endpoint);
                        console.log(url);
                        return [4 /*yield*/, this.client.post(url, body, __assign({ headers: headers }, config))];
                    case 1:
                        response = _a.sent();
                        console.log('Response from interceptor:', response);
                        console.log('Response type:', typeof response);
                        return [2 /*return*/, response];
                }
            });
        });
    };
    HttpClientBase.prototype.put = function (endpoint_1) {
        return __awaiter(this, arguments, void 0, function (endpoint, body, customHeaders, config) {
            var headers, url, response;
            if (body === void 0) { body = {}; }
            if (customHeaders === void 0) { customHeaders = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headers = this.getHeaders({}, customHeaders);
                        url = this.buildURI(endpoint);
                        return [4 /*yield*/, this.client.put(url, body, __assign({ headers: headers }, config))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    HttpClientBase.prototype.delete = function (endpoint_1) {
        return __awaiter(this, arguments, void 0, function (endpoint, customHeaders, config) {
            var headers, url, response;
            if (customHeaders === void 0) { customHeaders = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headers = this.getHeaders({}, customHeaders);
                        url = this.buildURI(endpoint);
                        return [4 /*yield*/, this.client.delete(url, __assign({ headers: headers }, config))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    return HttpClientBase;
}());
exports.HttpClientBase = HttpClientBase;
