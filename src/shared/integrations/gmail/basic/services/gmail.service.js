"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailService = void 0;
// gmail.service.ts
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var GmailService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var GmailService = _classThis = /** @class */ (function () {
        function GmailService_1(httpService) {
            this.httpService = httpService;
            this.logger = new common_1.Logger(GmailService.name);
            this.GMAIL_API_BASE_URL = 'https://gmail.googleapis.com/gmail/v1';
            this.OAUTH_URL = 'https://oauth2.googleapis.com/token';
        }
        /**
         * Get OAuth authorization URL
         */
        GmailService_1.prototype.getAuthUrl = function (credentials, scopes) {
            if (scopes === void 0) { scopes = ['https://www.googleapis.com/auth/gmail.readonly']; }
            var params = new URLSearchParams({
                client_id: credentials.clientId,
                redirect_uri: credentials.redirectUri,
                scope: scopes.join(' '),
                response_type: 'code',
                access_type: 'offline',
                prompt: 'consent'
            });
            return "https://accounts.google.com/o/oauth2/v2/auth?".concat(params.toString());
        };
        /**
         * Exchange authorization code for tokens
         */
        GmailService_1.prototype.exchangeCodeForTokens = function (credentials, authorizationCode) {
            return __awaiter(this, void 0, void 0, function () {
                var tokenData, response, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            tokenData = {
                                client_id: credentials.clientId,
                                client_secret: credentials.clientSecret,
                                code: authorizationCode,
                                grant_type: 'authorization_code',
                                redirect_uri: credentials.redirectUri
                            };
                            return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.post(this.OAUTH_URL, tokenData, {
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    }
                                }))];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, {
                                    accessToken: response.data.access_token,
                                    refreshToken: response.data.refresh_token
                                }];
                        case 2:
                            error_1 = _a.sent();
                            this.logger.error('Failed to exchange code for tokens:', error_1);
                            throw new common_1.HttpException('Failed to authenticate with Gmail', common_1.HttpStatus.UNAUTHORIZED);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Refresh access token using refresh token
         */
        GmailService_1.prototype.refreshAccessToken = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                var tokenData, response, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            tokenData = {
                                client_id: credentials.clientId,
                                client_secret: credentials.clientSecret,
                                refresh_token: credentials.refreshToken,
                                grant_type: 'refresh_token'
                            };
                            return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.post(this.OAUTH_URL, tokenData, {
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    }
                                }))];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.access_token];
                        case 2:
                            error_2 = _a.sent();
                            this.logger.error('Failed to refresh access token:', error_2);
                            throw new common_1.HttpException('Failed to refresh Gmail authentication', common_1.HttpStatus.UNAUTHORIZED);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get user's Gmail profile
         */
        GmailService_1.prototype.getProfile = function (accessToken) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.get("".concat(this.GMAIL_API_BASE_URL, "/users/me/profile"), {
                                    headers: {
                                        Authorization: "Bearer ".concat(accessToken)
                                    }
                                }))];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data];
                        case 2:
                            error_3 = _a.sent();
                            this.logger.error('Failed to get Gmail profile:', error_3);
                            throw new common_1.HttpException('Failed to get Gmail profile', common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Search for messages
         */
        GmailService_1.prototype.searchMessages = function (accessToken_1) {
            return __awaiter(this, arguments, void 0, function (accessToken, options) {
                var params_1, response, messages, error_4;
                var _this = this;
                var _a;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            params_1 = new URLSearchParams();
                            if (options.query)
                                params_1.append('q', options.query);
                            if (options.maxResults)
                                params_1.append('maxResults', options.maxResults.toString());
                            if (options.pageToken)
                                params_1.append('pageToken', options.pageToken);
                            if (options.includeSpamTrash)
                                params_1.append('includeSpamTrash', 'true');
                            if ((_a = options.labelIds) === null || _a === void 0 ? void 0 : _a.length) {
                                options.labelIds.forEach(function (labelId) { return params_1.append('labelIds', labelId); });
                            }
                            return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.get("".concat(this.GMAIL_API_BASE_URL, "/users/me/messages?").concat(params_1.toString()), {
                                    headers: {
                                        Authorization: "Bearer ".concat(accessToken)
                                    }
                                }))];
                        case 1:
                            response = _b.sent();
                            return [4 /*yield*/, Promise.all((response.data.messages || []).map(function (msg) {
                                    return _this.getMessage(accessToken, msg.id);
                                }))];
                        case 2:
                            messages = _b.sent();
                            return [2 /*return*/, {
                                    messages: messages,
                                    nextPageToken: response.data.nextPageToken,
                                    resultSizeEstimate: response.data.resultSizeEstimate || 0
                                }];
                        case 3:
                            error_4 = _b.sent();
                            this.logger.error('Failed to search messages:', error_4);
                            throw new common_1.HttpException('Failed to search Gmail messages', common_1.HttpStatus.BAD_REQUEST);
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get a specific message by ID
         */
        GmailService_1.prototype.getMessage = function (accessToken_1, messageId_1) {
            return __awaiter(this, arguments, void 0, function (accessToken, messageId, format) {
                var params, response, error_5;
                if (format === void 0) { format = 'full'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            params = new URLSearchParams();
                            params.append('format', format);
                            return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.get("".concat(this.GMAIL_API_BASE_URL, "/users/me/messages/").concat(messageId, "?").concat(params.toString()), {
                                    headers: {
                                        Authorization: "Bearer ".concat(accessToken)
                                    }
                                }))];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data];
                        case 2:
                            error_5 = _a.sent();
                            this.logger.error("Failed to get message ".concat(messageId, ":"), error_5);
                            throw new common_1.HttpException('Failed to get Gmail message', common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get message attachment
         */
        GmailService_1.prototype.getAttachment = function (accessToken, messageId, attachmentId) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.get("".concat(this.GMAIL_API_BASE_URL, "/users/me/messages/").concat(messageId, "/attachments/").concat(attachmentId), {
                                    headers: {
                                        Authorization: "Bearer ".concat(accessToken)
                                    }
                                }))];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data];
                        case 2:
                            error_6 = _a.sent();
                            this.logger.error("Failed to get attachment ".concat(attachmentId, ":"), error_6);
                            throw new common_1.HttpException('Failed to get Gmail attachment', common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get all labels
         */
        GmailService_1.prototype.getLabels = function (accessToken) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.get("".concat(this.GMAIL_API_BASE_URL, "/users/me/labels"), {
                                    headers: {
                                        Authorization: "Bearer ".concat(accessToken)
                                    }
                                }))];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data.labels || []];
                        case 2:
                            error_7 = _a.sent();
                            this.logger.error('Failed to get labels:', error_7);
                            throw new common_1.HttpException('Failed to get Gmail labels', common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get thread by ID
         */
        GmailService_1.prototype.getThread = function (accessToken, threadId) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.get("".concat(this.GMAIL_API_BASE_URL, "/users/me/threads/").concat(threadId), {
                                    headers: {
                                        Authorization: "Bearer ".concat(accessToken)
                                    }
                                }))];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data];
                        case 2:
                            error_8 = _a.sent();
                            this.logger.error("Failed to get thread ".concat(threadId, ":"), error_8);
                            throw new common_1.HttpException('Failed to get Gmail thread', common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Parse email content from Gmail message
         */
        GmailService_1.prototype.parseEmailContent = function (message) {
            var headers = message.payload.headers;
            var getHeader = function (name) { var _a; return ((_a = headers.find(function (h) { return h.name.toLowerCase() === name.toLowerCase(); })) === null || _a === void 0 ? void 0 : _a.value) || ''; };
            var subject = getHeader('Subject');
            var from = getHeader('From');
            var to = getHeader('To').split(',').map(function (email) { return email.trim(); }).filter(Boolean);
            var cc = getHeader('Cc').split(',').map(function (email) { return email.trim(); }).filter(Boolean);
            var bcc = getHeader('Bcc').split(',').map(function (email) { return email.trim(); }).filter(Boolean);
            var dateStr = getHeader('Date');
            var date = dateStr ? new Date(dateStr) : new Date(parseInt(message.internalDate));
            var _a = this.extractContent(message.payload), textContent = _a.textContent, htmlContent = _a.htmlContent, attachments = _a.attachments;
            return {
                subject: subject,
                from: from,
                to: to,
                cc: cc.length > 0 ? cc : undefined,
                bcc: bcc.length > 0 ? bcc : undefined,
                date: date,
                textContent: textContent,
                htmlContent: htmlContent,
                attachments: attachments
            };
        };
        /**
         * Extract content and attachments from message payload
         */
        GmailService_1.prototype.extractContent = function (payload) {
            var _this = this;
            var textContent;
            var htmlContent;
            var attachments = [];
            var processPayload = function (part) {
                var _a, _b, _c;
                if (part.mimeType === 'text/plain' && ((_a = part.body) === null || _a === void 0 ? void 0 : _a.data)) {
                    textContent = _this.decodeBase64Url(part.body.data);
                }
                else if (part.mimeType === 'text/html' && ((_b = part.body) === null || _b === void 0 ? void 0 : _b.data)) {
                    htmlContent = _this.decodeBase64Url(part.body.data);
                }
                else if (part.filename && ((_c = part.body) === null || _c === void 0 ? void 0 : _c.attachmentId)) {
                    attachments.push({
                        filename: part.filename,
                        mimeType: part.mimeType,
                        size: part.body.size,
                        attachmentId: part.body.attachmentId
                    });
                }
                // Process nested parts
                if (part.parts) {
                    part.parts.forEach(processPayload);
                }
            };
            processPayload(payload);
            return { textContent: textContent, htmlContent: htmlContent, attachments: attachments };
        };
        /**
         * Decode base64url encoded data
         */
        GmailService_1.prototype.decodeBase64Url = function (data) {
            try {
                // Convert base64url to base64
                var base64 = data.replace(/-/g, '+').replace(/_/g, '/');
                // Add padding if necessary
                var padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
                return Buffer.from(padded, 'base64').toString('utf-8');
            }
            catch (error) {
                this.logger.warn('Failed to decode base64url data:', error);
                return '';
            }
        };
        /**
         * Get unread messages count
         */
        GmailService_1.prototype.getUnreadCount = function (accessToken) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.searchMessages(accessToken, {
                                    query: 'is:unread',
                                    maxResults: 1
                                })];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result.resultSizeEstimate];
                        case 2:
                            error_9 = _a.sent();
                            this.logger.error('Failed to get unread count:', error_9);
                            return [2 /*return*/, 0];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Mark message as read
         */
        GmailService_1.prototype.markAsRead = function (accessToken, messageId) {
            return __awaiter(this, void 0, void 0, function () {
                var error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.post("".concat(this.GMAIL_API_BASE_URL, "/users/me/messages/").concat(messageId, "/modify"), {
                                    removeLabelIds: ['UNREAD']
                                }, {
                                    headers: {
                                        Authorization: "Bearer ".concat(accessToken),
                                        'Content-Type': 'application/json'
                                    }
                                }))];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_10 = _a.sent();
                            this.logger.error("Failed to mark message ".concat(messageId, " as read:"), error_10);
                            throw new common_1.HttpException('Failed to mark message as read', common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Mark message as unread
         */
        GmailService_1.prototype.markAsUnread = function (accessToken, messageId) {
            return __awaiter(this, void 0, void 0, function () {
                var error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.post("".concat(this.GMAIL_API_BASE_URL, "/users/me/messages/").concat(messageId, "/modify"), {
                                    addLabelIds: ['UNREAD']
                                }, {
                                    headers: {
                                        Authorization: "Bearer ".concat(accessToken),
                                        'Content-Type': 'application/json'
                                    }
                                }))];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_11 = _a.sent();
                            this.logger.error("Failed to mark message ".concat(messageId, " as unread:"), error_11);
                            throw new common_1.HttpException('Failed to mark message as unread', common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return GmailService_1;
    }());
    __setFunctionName(_classThis, "GmailService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GmailService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GmailService = _classThis;
}();
exports.GmailService = GmailService;
