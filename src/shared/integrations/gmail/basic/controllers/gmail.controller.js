"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
exports.GmailController = void 0;
// gmail.controller.ts
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var GmailController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('14 - Gmail Integration'), (0, common_1.Controller)('gmail')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getAuthUrl_decorators;
    var _exchangeCode_decorators;
    var _refreshToken_decorators;
    var _getProfile_decorators;
    var _searchMessages_decorators;
    var _getMessage_decorators;
    var _getParsedMessage_decorators;
    var _getAttachment_decorators;
    var _getLabels_decorators;
    var _getThread_decorators;
    var _getUnreadCount_decorators;
    var _markAsRead_decorators;
    var _markAsUnread_decorators;
    var GmailController = _classThis = /** @class */ (function () {
        function GmailController_1(gmailService) {
            this.gmailService = (__runInitializers(this, _instanceExtraInitializers), gmailService);
            this.logger = new common_1.Logger(GmailController.name);
        }
        GmailController_1.prototype.getAuthUrl = function (authDto) {
            try {
                var credentials = {
                    clientId: authDto.clientId || process.env.GMAIL_CLIENT_ID || '',
                    clientSecret: authDto.clientSecret || process.env.GMAIL_CLIENT_SECRET || '',
                    redirectUri: authDto.redirectUri || process.env.GMAIL_REDIRECT_URI || ''
                };
                if (!credentials.clientId || !credentials.clientSecret || !credentials.redirectUri) {
                    throw new common_1.HttpException('Gmail credentials not configured properly', common_1.HttpStatus.BAD_REQUEST);
                }
                var authUrl = this.gmailService.getAuthUrl(credentials);
                return { authUrl: authUrl };
            }
            catch (error) {
                this.logger.error('Failed to generate auth URL:', error);
                throw new common_1.HttpException('Failed to generate authorization URL', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        };
        GmailController_1.prototype.exchangeCode = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var credentials, error_1;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 2, , 3]);
                            credentials = {
                                clientId: ((_a = body.credentials) === null || _a === void 0 ? void 0 : _a.clientId) || process.env.GMAIL_CLIENT_ID || '',
                                clientSecret: ((_b = body.credentials) === null || _b === void 0 ? void 0 : _b.clientSecret) || process.env.GMAIL_CLIENT_SECRET || '',
                                redirectUri: ((_c = body.credentials) === null || _c === void 0 ? void 0 : _c.redirectUri) || process.env.GMAIL_REDIRECT_URI || ''
                            };
                            if (!credentials.clientId || !credentials.clientSecret || !credentials.redirectUri) {
                                throw new common_1.HttpException('Gmail credentials not configured properly', common_1.HttpStatus.BAD_REQUEST);
                            }
                            return [4 /*yield*/, this.gmailService.exchangeCodeForTokens(credentials, body.authorizationCode)];
                        case 1: return [2 /*return*/, _d.sent()];
                        case 2:
                            error_1 = _d.sent();
                            this.logger.error('Failed to exchange code:', error_1);
                            throw error_1;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        GmailController_1.prototype.refreshToken = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var credentials, accessToken, error_2;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 2, , 3]);
                            credentials = {
                                clientId: ((_a = body.credentials) === null || _a === void 0 ? void 0 : _a.clientId) || process.env.GMAIL_CLIENT_ID || '',
                                clientSecret: ((_b = body.credentials) === null || _b === void 0 ? void 0 : _b.clientSecret) || process.env.GMAIL_CLIENT_SECRET || '',
                                redirectUri: ((_c = body.credentials) === null || _c === void 0 ? void 0 : _c.redirectUri) || process.env.GMAIL_REDIRECT_URI || '',
                                refreshToken: body.refreshToken
                            };
                            if (!credentials.clientId || !credentials.clientSecret || !credentials.refreshToken) {
                                throw new common_1.HttpException('Gmail credentials not configured properly', common_1.HttpStatus.BAD_REQUEST);
                            }
                            return [4 /*yield*/, this.gmailService.refreshAccessToken(credentials)];
                        case 1:
                            accessToken = _d.sent();
                            return [2 /*return*/, { accessToken: accessToken }];
                        case 2:
                            error_2 = _d.sent();
                            this.logger.error('Failed to refresh token:', error_2);
                            throw error_2;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        GmailController_1.prototype.getProfile = function (accessToken) {
            return __awaiter(this, void 0, void 0, function () {
                var error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!accessToken) {
                                throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.gmailService.getProfile(accessToken)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_3 = _a.sent();
                            this.logger.error('Failed to get profile:', error_3);
                            throw error_3;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        GmailController_1.prototype.searchMessages = function (accessToken, searchDto) {
            return __awaiter(this, void 0, void 0, function () {
                var error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!accessToken) {
                                throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.gmailService.searchMessages(accessToken, searchDto)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_4 = _a.sent();
                            this.logger.error('Failed to search messages:', error_4);
                            throw error_4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        GmailController_1.prototype.getMessage = function (messageId, accessToken, format) {
            return __awaiter(this, void 0, void 0, function () {
                var error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!accessToken) {
                                throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.gmailService.getMessage(accessToken, messageId, format)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_5 = _a.sent();
                            this.logger.error("Failed to get message ".concat(messageId, ":"), error_5);
                            throw error_5;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        GmailController_1.prototype.getParsedMessage = function (messageId, accessToken) {
            return __awaiter(this, void 0, void 0, function () {
                var message, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!accessToken) {
                                throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.gmailService.getMessage(accessToken, messageId)];
                        case 2:
                            message = _a.sent();
                            return [2 /*return*/, this.gmailService.parseEmailContent(message)];
                        case 3:
                            error_6 = _a.sent();
                            this.logger.error("Failed to parse message ".concat(messageId, ":"), error_6);
                            throw error_6;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        GmailController_1.prototype.getAttachment = function (messageId, attachmentId, accessToken) {
            return __awaiter(this, void 0, void 0, function () {
                var error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!accessToken) {
                                throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.gmailService.getAttachment(accessToken, messageId, attachmentId)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_7 = _a.sent();
                            this.logger.error("Failed to get attachment ".concat(attachmentId, ":"), error_7);
                            throw error_7;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        GmailController_1.prototype.getLabels = function (accessToken) {
            return __awaiter(this, void 0, void 0, function () {
                var error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!accessToken) {
                                throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.gmailService.getLabels(accessToken)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_8 = _a.sent();
                            this.logger.error('Failed to get labels:', error_8);
                            throw error_8;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        GmailController_1.prototype.getThread = function (threadId, accessToken) {
            return __awaiter(this, void 0, void 0, function () {
                var error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!accessToken) {
                                throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.gmailService.getThread(accessToken, threadId)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_9 = _a.sent();
                            this.logger.error("Failed to get thread ".concat(threadId, ":"), error_9);
                            throw error_9;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        GmailController_1.prototype.getUnreadCount = function (accessToken) {
            return __awaiter(this, void 0, void 0, function () {
                var count, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!accessToken) {
                                throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.gmailService.getUnreadCount(accessToken)];
                        case 2:
                            count = _a.sent();
                            return [2 /*return*/, { count: count }];
                        case 3:
                            error_10 = _a.sent();
                            this.logger.error('Failed to get unread count:', error_10);
                            throw error_10;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        GmailController_1.prototype.markAsRead = function (messageId, body) {
            return __awaiter(this, void 0, void 0, function () {
                var error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!body.accessToken) {
                                throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.gmailService.markAsRead(body.accessToken, messageId)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { success: true }];
                        case 3:
                            error_11 = _a.sent();
                            this.logger.error("Failed to mark message ".concat(messageId, " as read:"), error_11);
                            throw error_11;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        GmailController_1.prototype.markAsUnread = function (messageId, body) {
            return __awaiter(this, void 0, void 0, function () {
                var error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!body.accessToken) {
                                throw new common_1.HttpException('Access token is required', common_1.HttpStatus.BAD_REQUEST);
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.gmailService.markAsUnread(body.accessToken, messageId)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { success: true }];
                        case 3:
                            error_12 = _a.sent();
                            this.logger.error("Failed to mark message ".concat(messageId, " as unread:"), error_12);
                            throw error_12;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return GmailController_1;
    }());
    __setFunctionName(_classThis, "GmailController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getAuthUrl_decorators = [(0, common_1.Get)('auth-url'), (0, swagger_1.ApiOperation)({ summary: 'Get Gmail OAuth authorization URL' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Authorization URL generated successfully' })];
        _exchangeCode_decorators = [(0, common_1.Post)('exchange-code'), (0, swagger_1.ApiOperation)({ summary: 'Exchange authorization code for tokens' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Tokens exchanged successfully' })];
        _refreshToken_decorators = [(0, common_1.Post)('refresh-token'), (0, swagger_1.ApiOperation)({ summary: 'Refresh Gmail access token' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Token refreshed successfully' })];
        _getProfile_decorators = [(0, common_1.Get)('profile'), (0, swagger_1.ApiOperation)({ summary: 'Get Gmail user profile' }), (0, swagger_1.ApiQuery)({ name: 'accessToken', description: 'Gmail access token' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile retrieved successfully' })];
        _searchMessages_decorators = [(0, common_1.Get)('messages/search'), (0, swagger_1.ApiOperation)({ summary: 'Search Gmail messages' }), (0, swagger_1.ApiQuery)({ name: 'accessToken', description: 'Gmail access token' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages searched successfully' })];
        _getMessage_decorators = [(0, common_1.Get)('messages/:messageId'), (0, swagger_1.ApiOperation)({ summary: 'Get a specific Gmail message' }), (0, swagger_1.ApiParam)({ name: 'messageId', description: 'Gmail message ID' }), (0, swagger_1.ApiQuery)({ name: 'accessToken', description: 'Gmail access token' }), (0, swagger_1.ApiQuery)({ name: 'format', enum: ['full', 'metadata', 'minimal', 'raw'], required: false }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Message retrieved successfully' })];
        _getParsedMessage_decorators = [(0, common_1.Get)('messages/:messageId/parsed'), (0, swagger_1.ApiOperation)({ summary: 'Get parsed Gmail message content' }), (0, swagger_1.ApiParam)({ name: 'messageId', description: 'Gmail message ID' }), (0, swagger_1.ApiQuery)({ name: 'accessToken', description: 'Gmail access token' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Message parsed successfully' })];
        _getAttachment_decorators = [(0, common_1.Get)('messages/:messageId/attachments/:attachmentId'), (0, swagger_1.ApiOperation)({ summary: 'Get Gmail message attachment' }), (0, swagger_1.ApiParam)({ name: 'messageId', description: 'Gmail message ID' }), (0, swagger_1.ApiParam)({ name: 'attachmentId', description: 'Gmail attachment ID' }), (0, swagger_1.ApiQuery)({ name: 'accessToken', description: 'Gmail access token' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Attachment retrieved successfully' })];
        _getLabels_decorators = [(0, common_1.Get)('labels'), (0, swagger_1.ApiOperation)({ summary: 'Get all Gmail labels' }), (0, swagger_1.ApiQuery)({ name: 'accessToken', description: 'Gmail access token' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Labels retrieved successfully' })];
        _getThread_decorators = [(0, common_1.Get)('threads/:threadId'), (0, swagger_1.ApiOperation)({ summary: 'Get Gmail thread' }), (0, swagger_1.ApiParam)({ name: 'threadId', description: 'Gmail thread ID' }), (0, swagger_1.ApiQuery)({ name: 'accessToken', description: 'Gmail access token' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Thread retrieved successfully' })];
        _getUnreadCount_decorators = [(0, common_1.Get)('unread-count'), (0, swagger_1.ApiOperation)({ summary: 'Get unread messages count' }), (0, swagger_1.ApiQuery)({ name: 'accessToken', description: 'Gmail access token' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Unread count retrieved successfully' })];
        _markAsRead_decorators = [(0, common_1.Post)('messages/:messageId/mark-read'), (0, swagger_1.ApiOperation)({ summary: 'Mark message as read' }), (0, swagger_1.ApiParam)({ name: 'messageId', description: 'Gmail message ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Message marked as read successfully' })];
        _markAsUnread_decorators = [(0, common_1.Post)('messages/:messageId/mark-unread'), (0, swagger_1.ApiOperation)({ summary: 'Mark message as unread' }), (0, swagger_1.ApiParam)({ name: 'messageId', description: 'Gmail message ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Message marked as unread successfully' })];
        __esDecorate(_classThis, null, _getAuthUrl_decorators, { kind: "method", name: "getAuthUrl", static: false, private: false, access: { has: function (obj) { return "getAuthUrl" in obj; }, get: function (obj) { return obj.getAuthUrl; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exchangeCode_decorators, { kind: "method", name: "exchangeCode", static: false, private: false, access: { has: function (obj) { return "exchangeCode" in obj; }, get: function (obj) { return obj.exchangeCode; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _refreshToken_decorators, { kind: "method", name: "refreshToken", static: false, private: false, access: { has: function (obj) { return "refreshToken" in obj; }, get: function (obj) { return obj.refreshToken; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProfile_decorators, { kind: "method", name: "getProfile", static: false, private: false, access: { has: function (obj) { return "getProfile" in obj; }, get: function (obj) { return obj.getProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _searchMessages_decorators, { kind: "method", name: "searchMessages", static: false, private: false, access: { has: function (obj) { return "searchMessages" in obj; }, get: function (obj) { return obj.searchMessages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMessage_decorators, { kind: "method", name: "getMessage", static: false, private: false, access: { has: function (obj) { return "getMessage" in obj; }, get: function (obj) { return obj.getMessage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getParsedMessage_decorators, { kind: "method", name: "getParsedMessage", static: false, private: false, access: { has: function (obj) { return "getParsedMessage" in obj; }, get: function (obj) { return obj.getParsedMessage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAttachment_decorators, { kind: "method", name: "getAttachment", static: false, private: false, access: { has: function (obj) { return "getAttachment" in obj; }, get: function (obj) { return obj.getAttachment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getLabels_decorators, { kind: "method", name: "getLabels", static: false, private: false, access: { has: function (obj) { return "getLabels" in obj; }, get: function (obj) { return obj.getLabels; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getThread_decorators, { kind: "method", name: "getThread", static: false, private: false, access: { has: function (obj) { return "getThread" in obj; }, get: function (obj) { return obj.getThread; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUnreadCount_decorators, { kind: "method", name: "getUnreadCount", static: false, private: false, access: { has: function (obj) { return "getUnreadCount" in obj; }, get: function (obj) { return obj.getUnreadCount; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _markAsRead_decorators, { kind: "method", name: "markAsRead", static: false, private: false, access: { has: function (obj) { return "markAsRead" in obj; }, get: function (obj) { return obj.markAsRead; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _markAsUnread_decorators, { kind: "method", name: "markAsUnread", static: false, private: false, access: { has: function (obj) { return "markAsUnread" in obj; }, get: function (obj) { return obj.markAsUnread; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GmailController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GmailController = _classThis;
}();
exports.GmailController = GmailController;
