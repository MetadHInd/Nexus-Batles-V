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
exports.ChecksumService = void 0;
// src/modules/auth/services/shared/checksum.service.ts
var common_1 = require("@nestjs/common");
var ChecksumService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ChecksumService = _classThis = /** @class */ (function () {
        function ChecksumService_1(signatureService, jwtSecretProvider) {
            this.signatureService = signatureService;
            this.jwtSecretProvider = jwtSecretProvider;
            this.logger = new common_1.Logger(ChecksumService.name);
            this.authData = null;
            this.maxRetries = 3;
        }
        ChecksumService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            // Inicializar el checksum_secret al arrancar la aplicación
                            return [4 /*yield*/, this.initializeAuthData()];
                        case 1:
                            // Inicializar el checksum_secret al arrancar la aplicación
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            this.logger.error('Error initializing auth data, will continue without it:', error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        ChecksumService_1.prototype.initializeAuthData = function () {
            return __awaiter(this, void 0, void 0, function () {
                var token, uuid, retries, success, _loop_1, this_1;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            token = process.env.AUTH_UUID_TOKEN;
                            uuid = process.env.AUTH_UUID_ORIGIN;
                            if (!token || !uuid) {
                                this.logger.warn('AUTH_TOKEN or AUTH_UUID_ORIGIN not defined in environment variables');
                                return [2 /*return*/];
                            }
                            retries = 0;
                            success = false;
                            _loop_1 = function () {
                                var response, error_2, waitTime_1;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            _d.trys.push([0, 2, , 6]);
                                            return [4 /*yield*/, this_1.signatureService.getAuthorizedSign(token, uuid)];
                                        case 1:
                                            response = _d.sent();
                                            // Validar que tenemos los datos necesarios
                                            if (!response.payload.signSecret) {
                                                throw new Error('SignSecret no recibido en la respuesta');
                                            }
                                            this_1.authData = response.payload;
                                            process.env.JWT_SECRET = this_1.authData.signSecret;
                                            this_1.jwtSecretProvider.setSecret(this_1.authData.signSecret);
                                            console.log(process.env.JWT_SECRET);
                                            // Solo asignar checkSumSecret si existe
                                            if (this_1.authData.checkSumSecret) {
                                                process.env.CHECKSUM_SECRET = this_1.authData.checkSumSecret;
                                            }
                                            this_1.logger.log("Auth data initialized successfully for origin: ".concat(this_1.authData.originName));
                                            this_1.logger.log("SignSecret length: ".concat((_a = this_1.authData.signSecret) === null || _a === void 0 ? void 0 : _a.length));
                                            this_1.logger.log("CheckSumSecret length: ".concat(((_b = this_1.authData.checkSumSecret) === null || _b === void 0 ? void 0 : _b.length) || 'undefined'));
                                            if (this_1.authData.expiresAt) {
                                                this_1.logger.log("Checksum secret expires at: ".concat(this_1.authData.expiresAt));
                                            }
                                            success = true;
                                            return [3 /*break*/, 6];
                                        case 2:
                                            error_2 = _d.sent();
                                            retries++;
                                            this_1.logger.error("Failed to initialize auth data (attempt ".concat(retries, "/").concat(this_1.maxRetries, "):"), error_2);
                                            if (!(retries < this_1.maxRetries)) return [3 /*break*/, 4];
                                            waitTime_1 = Math.pow(2, retries) * 1000;
                                            this_1.logger.log("Retrying in ".concat(waitTime_1, "ms..."));
                                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, waitTime_1); })];
                                        case 3:
                                            _d.sent();
                                            return [3 /*break*/, 5];
                                        case 4: throw error_2;
                                        case 5: return [3 /*break*/, 6];
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _c.label = 1;
                        case 1:
                            if (!(!success && retries < this.maxRetries)) return [3 /*break*/, 3];
                            return [5 /*yield**/, _loop_1()];
                        case 2:
                            _c.sent();
                            return [3 /*break*/, 1];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // Métodos públicos para obtener los datos de autenticación
        ChecksumService_1.prototype.getCheckSumSecret = function () {
            var _a;
            return ((_a = this.authData) === null || _a === void 0 ? void 0 : _a.checkSumSecret) || null;
        };
        ChecksumService_1.prototype.getSignSecret = function () {
            var _a;
            return ((_a = this.authData) === null || _a === void 0 ? void 0 : _a.signSecret) || null;
        };
        ChecksumService_1.prototype.getOriginName = function () {
            var _a;
            return ((_a = this.authData) === null || _a === void 0 ? void 0 : _a.originName) || null;
        };
        ChecksumService_1.prototype.getExpiresAt = function () {
            var _a;
            return ((_a = this.authData) === null || _a === void 0 ? void 0 : _a.expiresAt) ? new Date(this.authData.expiresAt) : null;
        };
        // Verificar si los datos están por vencer
        ChecksumService_1.prototype.isExpiringSoon = function (thresholdMinutes) {
            var _a;
            if (thresholdMinutes === void 0) { thresholdMinutes = 60; }
            if (!((_a = this.authData) === null || _a === void 0 ? void 0 : _a.expiresAt)) {
                this.logger.warn('No expiration date available, considering as expiring');
                return true;
            }
            try {
                var expiresAt = new Date(this.authData.expiresAt);
                var now = new Date();
                var thresholdMs = thresholdMinutes * 60 * 1000;
                var isExpiring = expiresAt.getTime() - now.getTime() < thresholdMs;
                if (isExpiring) {
                    this.logger.warn("Auth data expiring soon. Expires at: ".concat(this.authData.expiresAt));
                }
                return isExpiring;
            }
            catch (error) {
                this.logger.error('Error checking expiration date:', error);
                return true; // Considerar como expirado si hay error
            }
        };
        // Método para actualizar los datos manualmente si es necesario
        ChecksumService_1.prototype.refreshAuthData = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.initializeAuthData()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // Método para obtener todos los datos de autenticación
        ChecksumService_1.prototype.getAllAuthData = function () {
            return this.authData;
        };
        return ChecksumService_1;
    }());
    __setFunctionName(_classThis, "ChecksumService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChecksumService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChecksumService = _classThis;
}();
exports.ChecksumService = ChecksumService;
