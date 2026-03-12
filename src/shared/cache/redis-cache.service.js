"use strict";
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
exports.RedisCacheService = void 0;
var common_1 = require("@nestjs/common");
var ioredis_1 = require("ioredis");
var RedisCacheService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RedisCacheService = _classThis = /** @class */ (function () {
        function RedisCacheService_1() {
            var _this = this;
            this.redis = null;
            this.isConnected = false;
            this.connectionError = null;
            try {
                // Configuración base de Redis
                var redisConfig = {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT || '6379'),
                    connectTimeout: 5000,
                    maxRetriesPerRequest: 3,
                    enableReadyCheck: true,
                    lazyConnect: false,
                    retryStrategy: function (times) {
                        if (times > 3) {
                            console.log('⚠️ Redis connection failed after 3 attempts. Cache will be disabled.');
                            return null; // Stop retrying
                        }
                        var delay = Math.min(times * 50, 2000);
                        console.log("\uD83D\uDD04 Retrying Redis connection... attempt ".concat(times));
                        return delay;
                    },
                };
                // Agregar autenticación solo si está configurada (para producción)
                console.log('🔍 Debug Redis Config:', {
                    host: process.env.REDIS_HOST,
                    port: process.env.REDIS_PORT,
                    hasPassword: !!process.env.REDIS_PASSWORD,
                    hasUsername: !!process.env.REDIS_USERNAME,
                });
                if (process.env.REDIS_PASSWORD) {
                    redisConfig.password = process.env.REDIS_PASSWORD;
                    // Agregar username si está configurado (Redis 6+)
                    if (process.env.REDIS_USERNAME) {
                        redisConfig.username = process.env.REDIS_USERNAME;
                    }
                    console.log('🔐 Redis authentication enabled');
                }
                else {
                    console.log('🔓 Redis running without authentication (local development)');
                }
                // Configuración adicional para producción
                if (process.env.NODE_ENV === 'production') {
                    // TLS si está habilitado
                    if (process.env.REDIS_TLS === 'true') {
                        redisConfig.tls = {};
                        console.log('🔒 Redis TLS enabled');
                    }
                }
                this.redis = new ioredis_1.default(redisConfig);
                this.redis.on('connect', function () {
                    console.log('✅ Redis connected successfully');
                    _this.isConnected = true;
                    _this.connectionError = null;
                });
                this.redis.on('error', function (err) {
                    console.error('❌ Redis connection error:', err.message);
                    _this.connectionError = err;
                    _this.isConnected = false;
                });
                this.redis.on('close', function () {
                    console.log('🔴 Redis connection closed');
                    _this.isConnected = false;
                });
            }
            catch (error) {
                console.error('❌ Failed to initialize Redis:', error);
                this.redis = null;
            }
        }
        RedisCacheService_1.prototype.buildKey = function (_a) {
            var _b, _c;
            var key = _a.key, _d = _a.params, params = _d === void 0 ? {} : _d, namespace = _a.namespace;
            // 🔒 OBTENER TENANT_ID AUTOMÁTICAMENTE del contexto global
            var tenantId = null;
            try {
                var request = global.currentRequest;
                if ((_b = request === null || request === void 0 ? void 0 : request.selectedTenant) === null || _b === void 0 ? void 0 : _b.database_connection) {
                    tenantId = request.selectedTenant.database_connection;
                }
                // Fallback: buscar en headers directamente
                if (!tenantId && ((_c = request === null || request === void 0 ? void 0 : request.headers) === null || _c === void 0 ? void 0 : _c['x-tenant-id'])) {
                    tenantId = request.headers['x-tenant-id'];
                }
            }
            catch (_e) {
                // Ignorar errores al obtener tenant_id
            }
            // Usar namespace proporcionado o default
            var currentNamespace = namespace || 'default';
            // Construir la key con el formato: tenant:namespace:key:param1=value1:param2=value2
            // Si no hay tenant_id, usar 'global' como fallback
            var tenantPrefix = tenantId || 'global';
            var result = "".concat(tenantPrefix, ":").concat(currentNamespace, ":").concat(key.replace(/[^a-zA-Z0-9]/g, ''));
            // Agregar parámetros si existen
            for (var _i = 0, _f = Object.entries(params); _i < _f.length; _i++) {
                var _g = _f[_i], paramKey = _g[0], paramValue = _g[1];
                var cleanKey = paramKey.replace(/[^a-zA-Z0-9]/g, '');
                var cleanValue = String(paramValue).replace(/[^a-zA-Z0-9]/g, '');
                result += ":".concat(cleanKey, "=").concat(cleanValue);
            }
            return result;
        };
        RedisCacheService_1.prototype.set = function (input, value, ttl) {
            return __awaiter(this, void 0, void 0, function () {
                var endKey, serialized, _a, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.redis || !this.isConnected) {
                                console.log('⚠️ Redis not available, skipping cache SET');
                                return [2 /*return*/];
                            }
                            endKey = this.buildKey(input);
                            serialized = JSON.stringify(value);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 6, , 7]);
                            if (!ttl) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.redis.set(endKey, serialized, 'EX', ttl)];
                        case 2:
                            _a = _b.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, this.redis.set(endKey, serialized)];
                        case 4:
                            _a = _b.sent();
                            _b.label = 5;
                        case 5:
                            _a;
                            return [3 /*break*/, 7];
                        case 6:
                            error_1 = _b.sent();
                            console.error("\u274C Redis SET error for ".concat(endKey, ":"), error_1);
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        RedisCacheService_1.prototype.get = function (key_1) {
            return __awaiter(this, arguments, void 0, function (key, params) {
                var fullKey, raw, error_2;
                if (params === void 0) { params = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.redis || !this.isConnected) {
                                console.log('⚠️ Redis not available, returning null');
                                return [2 /*return*/, null];
                            }
                            fullKey = this.buildKey({ key: key, params: params });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redis.get(fullKey)];
                        case 2:
                            raw = _a.sent();
                            if (raw) {
                                return [2 /*return*/, JSON.parse(raw)];
                            }
                            else {
                                return [2 /*return*/, null];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            console.error("\u274C Error getting cache key ".concat(fullKey, ":"), error_2);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisCacheService_1.prototype.update = function (input, value, ttl) {
            return __awaiter(this, void 0, void 0, function () {
                var endKey, exists, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.redis || !this.isConnected) {
                                console.log('⚠️ Redis not available, skipping cache UPDATE');
                                return [2 /*return*/];
                            }
                            endKey = this.buildKey(input);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this.redis.exists(endKey)];
                        case 2:
                            exists = _a.sent();
                            if (!exists) {
                                console.log("\u26A0\uFE0F Key ".concat(endKey, " does not exist, creating new"));
                            }
                            return [4 /*yield*/, this.set(input, value, ttl)];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_3 = _a.sent();
                            console.error("\u274C Redis UPDATE error for ".concat(endKey, ":"), error_3);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        RedisCacheService_1.prototype.delete = function (key_1) {
            return __awaiter(this, arguments, void 0, function (key, params) {
                var endKey, error_4;
                if (params === void 0) { params = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.redis || !this.isConnected) {
                                console.log('⚠️ Redis not available, skipping cache DELETE');
                                return [2 /*return*/];
                            }
                            endKey = this.buildKey({ key: key, params: params });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redis.del(endKey)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_4 = _a.sent();
                            console.error("\u274C Redis DELETE error for ".concat(endKey, ":"), error_4);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisCacheService_1.prototype.clear = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.redis || !this.isConnected) {
                                console.log('⚠️ Redis not available, skipping cache CLEAR');
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redis.flushall()];
                        case 2:
                            _a.sent();
                            console.log('🧽 Redis cache cleared');
                            return [3 /*break*/, 4];
                        case 3:
                            error_5 = _a.sent();
                            console.error('❌ Redis CLEAR error:', error_5);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisCacheService_1.prototype.deletePattern = function (pattern) {
            return __awaiter(this, void 0, void 0, function () {
                var keys, error_6;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.redis || !this.isConnected) {
                                console.log('⚠️ Redis not available, skipping cache DELETE PATTERN');
                                return [2 /*return*/];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 6, , 7]);
                            return [4 /*yield*/, this.redis.keys(pattern)];
                        case 2:
                            keys = _b.sent();
                            if (!(keys.length > 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, (_a = this.redis).del.apply(_a, keys)];
                        case 3:
                            _b.sent();
                            console.log("\uD83E\uDDFD Deleted ".concat(keys.length, " keys matching pattern: ").concat(pattern));
                            return [3 /*break*/, 5];
                        case 4:
                            console.log("\uD83D\uDD0D No keys found matching pattern: ".concat(pattern));
                            _b.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            error_6 = _b.sent();
                            console.error("\u274C Redis DELETE PATTERN error for ".concat(pattern, ":"), error_6);
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        RedisCacheService_1.prototype.getKeys = function (pattern) {
            return __awaiter(this, void 0, void 0, function () {
                var error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.redis || !this.isConnected) {
                                console.log('⚠️ Redis not available, returning empty array');
                                return [2 /*return*/, []];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redis.keys(pattern)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_7 = _a.sent();
                            console.error("\u274C Redis GET KEYS error for ".concat(pattern, ":"), error_7);
                            return [2 /*return*/, []];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return RedisCacheService_1;
    }());
    __setFunctionName(_classThis, "RedisCacheService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RedisCacheService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RedisCacheService = _classThis;
}();
exports.RedisCacheService = RedisCacheService;
