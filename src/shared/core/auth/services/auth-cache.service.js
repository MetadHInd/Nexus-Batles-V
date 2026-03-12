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
exports.AuthCacheService = void 0;
var common_1 = require("@nestjs/common");
var AuthCacheService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthCacheService = _classThis = /** @class */ (function () {
        function AuthCacheService_1(cacheService) {
            this.cacheService = cacheService;
            this.logger = new common_1.Logger(AuthCacheService.name);
        }
        /**
         * Invalidar caché cuando se actualiza el rol de un usuario
         */
        AuthCacheService_1.prototype.invalidateOnRoleUpdate = function (userId, newRoleId) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            // Invalidar caché del usuario
                            return [4 /*yield*/, this.cacheService.delete("user:".concat(userId))];
                        case 1:
                            // Invalidar caché del usuario
                            _a.sent();
                            return [4 /*yield*/, this.cacheService.delete("user:profile:".concat(userId))];
                        case 2:
                            _a.sent();
                            this.logger.log("Cach\u00E9 invalidado para usuario ".concat(userId, " por cambio de rol a ").concat(newRoleId));
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.error("Error al invalidar cach\u00E9 por cambio de rol: ".concat(error_1.message));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Invalidar caché cuando se actualizan las branches de un usuario
         */
        AuthCacheService_1.prototype.invalidateOnBranchAssignment = function (userId, branchId, isManager) {
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            // Invalidar caché del usuario
                            return [4 /*yield*/, this.cacheService.delete("user:".concat(userId))];
                        case 1:
                            // Invalidar caché del usuario
                            _a.sent();
                            return [4 /*yield*/, this.cacheService.delete("user:branches:".concat(userId))];
                        case 2:
                            _a.sent();
                            this.logger.log("Cach\u00E9 invalidado para usuario ".concat(userId, " por asignaci\u00F3n a branch ").concat(branchId, " (manager: ").concat(isManager, ")"));
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            this.logger.error("Error al invalidar cach\u00E9 por asignaci\u00F3n de branch: ".concat(error_2.message));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Invalidar caché cuando se remueve un usuario de una branch
         */
        AuthCacheService_1.prototype.invalidateOnBranchRemoval = function (userId, branchId) {
            return __awaiter(this, void 0, void 0, function () {
                var error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.cacheService.delete("user:".concat(userId))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.cacheService.delete("user:branches:".concat(userId))];
                        case 2:
                            _a.sent();
                            this.logger.log("Cach\u00E9 invalidado para usuario ".concat(userId, " por remoci\u00F3n de branch ").concat(branchId));
                            return [3 /*break*/, 4];
                        case 3:
                            error_3 = _a.sent();
                            this.logger.error("Error al invalidar cach\u00E9 por remoci\u00F3n de branch: ".concat(error_3.message));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Invalidar caché cuando se actualiza el estado de un usuario
         */
        AuthCacheService_1.prototype.invalidateOnStatusUpdate = function (userId, newStatusId) {
            return __awaiter(this, void 0, void 0, function () {
                var error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.cacheService.delete("user:".concat(userId))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.cacheService.delete("user:profile:".concat(userId))];
                        case 2:
                            _a.sent();
                            this.logger.log("Cach\u00E9 invalidado para usuario ".concat(userId, " por cambio de estado a ").concat(newStatusId));
                            return [3 /*break*/, 4];
                        case 3:
                            error_4 = _a.sent();
                            this.logger.error("Error al invalidar cach\u00E9 por cambio de estado: ".concat(error_4.message));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Invalidar caché masivo cuando se actualiza información de una branch
         */
        AuthCacheService_1.prototype.invalidateOnBranchUpdate = function (branchId) {
            return __awaiter(this, void 0, void 0, function () {
                var error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            // Invalidar todos los usuarios relacionados con la branch usando patrón
                            return [4 /*yield*/, this.cacheService.deletePattern("branch:".concat(branchId, ":*"))];
                        case 1:
                            // Invalidar todos los usuarios relacionados con la branch usando patrón
                            _a.sent();
                            this.logger.log("Cach\u00E9 invalidado masivamente por actualizaci\u00F3n de branch ".concat(branchId));
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _a.sent();
                            this.logger.error("Error al invalidar cach\u00E9 masivo por branch: ".concat(error_5.message));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Forzar actualización del perfil en caché
         */
        AuthCacheService_1.prototype.refreshUserProfile = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            // Invalidar primero
                            return [4 /*yield*/, this.cacheService.delete("user:".concat(userId))];
                        case 1:
                            // Invalidar primero
                            _a.sent();
                            return [4 /*yield*/, this.cacheService.delete("user:profile:".concat(userId))];
                        case 2:
                            _a.sent();
                            this.logger.log("Perfil refrescado en cach\u00E9 para usuario ".concat(userId));
                            return [3 /*break*/, 4];
                        case 3:
                            error_6 = _a.sent();
                            this.logger.error("Error al refrescar perfil en cach\u00E9: ".concat(error_6.message));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Verificar si un usuario existe en caché
         */
        AuthCacheService_1.prototype.isUserInCache = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var cached, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.cacheService.get("user:".concat(userId))];
                        case 1:
                            cached = _a.sent();
                            return [2 /*return*/, cached !== null];
                        case 2:
                            error_7 = _a.sent();
                            this.logger.error("Error al verificar usuario en cach\u00E9: ".concat(error_7.message));
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Obtener estadísticas de caché de usuarios
         */
        AuthCacheService_1.prototype.getCacheStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Implementar si el sistema de caché lo soporta
                    return [2 /*return*/, {
                            totalCachedUsers: 0,
                            cacheHitRate: 0,
                        }];
                });
            });
        };
        return AuthCacheService_1;
    }());
    __setFunctionName(_classThis, "AuthCacheService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthCacheService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthCacheService = _classThis;
}();
exports.AuthCacheService = AuthCacheService;
