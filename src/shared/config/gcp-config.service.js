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
exports.GcpConfigService = void 0;
var common_1 = require("@nestjs/common");
var secret_manager_1 = require("@google-cloud/secret-manager");
var GcpConfigService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var GcpConfigService = _classThis = /** @class */ (function () {
        function GcpConfigService_1() {
            this.logger = new common_1.Logger(GcpConfigService.name);
            this.secretsCache = new Map();
            this.projectId =
                process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || '';
            this.client = new secret_manager_1.SecretManagerServiceClient();
        }
        GcpConfigService_1.prototype.loadAllSecrets = function () {
            return __awaiter(this, void 0, void 0, function () {
                var secretNames, promises;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log('Loading secrets from GCP Secret Manager...');
                            secretNames = [
                                'DATABASE_URL',
                                'DATABASE_URL_DEV',
                                'AUTH_URL',
                                'AUTH_UUID_ORIGIN',
                                'AUTH_UUID_TOKEN',
                                'TEST_JWT_TOKEN',
                                'JWT_SECRET',
                                'SMTP_HOST',
                                'SMTP_USER',
                                'SMTP_PASS',
                                'ONESIGNAL_APP_ID',
                                'ONESIGNAL_API_KEY',
                                'PINECONE_API_KEY',
                                'GEMINI_API_KEY',
                                'OPENAI_API_KEY',
                                'GOOGLE_MAPS_API_KEY',
                                'STRIPE_SECRET_KEY',
                                'STRIPE_WEBHOOK_SECRET',
                                'ODIN_TOKEN',
                                'WHATSAPP_VERIFY_TOKEN',
                                'WHATSAPP_ACCESS_TOKEN',
                            ];
                            promises = secretNames.map(function (secretName) { return __awaiter(_this, void 0, void 0, function () {
                                var value, error_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this.getSecret(secretName)];
                                        case 1:
                                            value = _a.sent();
                                            this.secretsCache.set(secretName, value);
                                            process.env[secretName] = value;
                                            this.logger.debug("\u2705 Loaded secret: ".concat(secretName));
                                            return [3 /*break*/, 3];
                                        case 2:
                                            error_1 = _a.sent();
                                            this.logger.warn("\u26A0\uFE0F  Failed to load secret ".concat(secretName, ": ").concat(error_1.message));
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [4 /*yield*/, Promise.all(promises)];
                        case 1:
                            _a.sent();
                            this.logger.log("Loaded ".concat(this.secretsCache.size, " secrets from GCP Secret Manager"));
                            return [2 /*return*/];
                    }
                });
            });
        };
        GcpConfigService_1.prototype.getSecret = function (secretName) {
            return __awaiter(this, void 0, void 0, function () {
                var name_1, version, payload, error_2;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            name_1 = "projects/".concat(this.projectId, "/secrets/").concat(secretName, "/versions/latest");
                            return [4 /*yield*/, this.client.accessSecretVersion({ name: name_1 })];
                        case 1:
                            version = (_c.sent())[0];
                            payload = (_b = (_a = version.payload) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.toString();
                            if (!payload) {
                                throw new Error("Secret ".concat(secretName, " is empty"));
                            }
                            return [2 /*return*/, payload];
                        case 2:
                            error_2 = _c.sent();
                            throw new Error("Failed to get secret ".concat(secretName, ": ").concat(error_2.message));
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        GcpConfigService_1.prototype.getSecretFromCache = function (secretName) {
            return this.secretsCache.get(secretName);
        };
        GcpConfigService_1.prototype.refreshSecret = function (secretName) {
            return __awaiter(this, void 0, void 0, function () {
                var value, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.getSecret(secretName)];
                        case 1:
                            value = _a.sent();
                            this.secretsCache.set(secretName, value);
                            process.env[secretName] = value;
                            this.logger.log("Refreshed secret: ".concat(secretName));
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            this.logger.error("Failed to refresh secret ".concat(secretName, ":"), error_3);
                            throw error_3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return GcpConfigService_1;
    }());
    __setFunctionName(_classThis, "GcpConfigService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GcpConfigService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GcpConfigService = _classThis;
}();
exports.GcpConfigService = GcpConfigService;
