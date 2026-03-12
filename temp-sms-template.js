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
exports.DeliveryService = void 0;
var common_1 = require("@nestjs/common");
var service_cache_1 = require("../../../../src/shared/core/services/service-cache/service-cache");
/**
 * Servicio principal de deliveries con estructura de datos simplificada
 */
var DeliveryService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DeliveryService = _classThis = /** @class */ (function () {
        function DeliveryService_1() {
            this.logger = new common_1.Logger(DeliveryService.name);
            this.providerServices = new Map();
            this.logger.log('🚚 Delivery Service initialized');
        }
        /**
         * Registrar un servicio de proveedor específico
         */
        DeliveryService_1.prototype.registerProvider = function (providerId, service) {
            this.providerServices.set(providerId, service);
            this.logger.log("\u2705 Registered delivery provider: ".concat(providerId));
        };
        /**
         * Enviar un delivery con datos simplificados
         */
        DeliveryService_1.prototype.SendDelivery = function (providerId, deliveryData) {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, operationId, provider, deliveryService, response, duration, error_1, duration;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            startTime = Date.now();
                            operationId = this.generateOperationId();
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 6, , 7]);
                            console.log("deliveryData", deliveryData);
                            this.logger.log("\uD83D\uDE80 Starting delivery operation ".concat(operationId, " with provider ID: ").concat(providerId));
                            return [4 /*yield*/, this.getProviderById(providerId)];
                        case 2:
                            provider = _b.sent();
                            if (!provider) {
                                throw new common_1.NotFoundException("Provider with ID ".concat(providerId, " not found"));
                            }
                            this.logger.log("\uD83D\uDCCB Provider found: ".concat(provider.providerName, " (Type: ").concat(provider.providertype, ")"));
                            deliveryService = this.getProviderService(providerId);
                            // 3. Configurar credenciales del proveedor
                            return [4 /*yield*/, this.configureProviderCredentials(deliveryService, provider)];
                        case 3:
                            // 3. Configurar credenciales del proveedor
                            _b.sent();
                            // 4. Enviar el delivery
                            this.logger.log("\uD83D\uDCE6 Sending delivery with provider ".concat(providerId, "..."));
                            return [4 /*yield*/, deliveryService.sendDelivery(deliveryData)];
                        case 4:
                            response = _b.sent();
                            this.logger.log("\u2705 Delivery sent successfully with response:", response);
                            // 5. Guardar el resultado en la base de datos (opcional)
                            return [4 /*yield*/, this.saveDeliveryRecord(response, providerId, deliveryData)];
                        case 5:
                            // 5. Guardar el resultado en la base de datos (opcional)
                            _b.sent();
                            duration = Date.now() - startTime;
                            this.logger.log("\u2705 Delivery sent successfully in ".concat(duration, "ms"), {
                                operationId: operationId,
                                deliveryId: (_a = response.data) === null || _a === void 0 ? void 0 : _a.id,
                                provider: providerId,
                            });
                            return [2 /*return*/, response];
                        case 6:
                            error_1 = _b.sent();
                            duration = Date.now() - startTime;
                            this.logger.error("\u274C Delivery operation ".concat(operationId, " failed after ").concat(duration, "ms:"), {
                                providerId: providerId,
                                error: error_1.message,
                                stack: error_1.stack,
                            });
                            return [2 /*return*/, {
                                    success: false,
                                    error: {
                                        code: error_1.code || 'DELIVERY_ERROR',
                                        message: error_1.message,
                                        details: {
                                            providerId: providerId,
                                            operationId: operationId,
                                            duration: duration,
                                        },
                                    },
                                    timestamp: new Date(),
                                }];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Obtener estado de un delivery
         */
        DeliveryService_1.prototype.GetDeliveryStatus = function (deliveryId, providerId) {
            return __awaiter(this, void 0, void 0, function () {
                var deliveryRecord, provider, deliveryService, status_1, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            this.logger.log("\uD83D\uDD0D Getting delivery status: ".concat(deliveryId));
                            if (!!providerId) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.findDeliveryRecord(deliveryId)];
                        case 1:
                            deliveryRecord = _a.sent();
                            providerId = deliveryRecord === null || deliveryRecord === void 0 ? void 0 : deliveryRecord.providerId;
                            _a.label = 2;
                        case 2:
                            if (!providerId) {
                                throw new Error('Provider ID is required for getting delivery status');
                            }
                            return [4 /*yield*/, this.getProviderById(providerId)];
                        case 3:
                            provider = _a.sent();
                            if (!provider) {
                                throw new common_1.NotFoundException("Provider with ID ".concat(providerId, " not found"));
                            }
                            deliveryService = this.getProviderService(providerId);
                            return [4 /*yield*/, deliveryService.getDeliveryStatus(deliveryId)];
                        case 4:
                            status_1 = _a.sent();
                            return [2 /*return*/, status_1];
                        case 5:
                            error_2 = _a.sent();
                            this.logger.error("\u274C Status check failed for delivery ".concat(deliveryId, ":"), error_2);
                            return [2 /*return*/, {
                                    success: false,
                                    error: {
                                        code: 'STATUS_ERROR',
                                        message: error_2.message,
                                    },
                                    timestamp: new Date(),
                                }];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Actualizar un delivery
         */
        DeliveryService_1.prototype.UpdateDelivery = function (providerId, updateData) {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, operationId, provider, deliveryService, response, duration, error_3, duration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = Date.now();
                            operationId = this.generateOperationId();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            this.logger.log("\uD83D\uDD04 Starting delivery update operation ".concat(operationId, " with provider ID: ").concat(providerId));
                            return [4 /*yield*/, this.getProviderById(providerId)];
                        case 2:
                            provider = _a.sent();
                            if (!provider) {
                                throw new common_1.NotFoundException("Provider with ID ".concat(providerId, " not found"));
                            }
                            this.logger.log("\uD83D\uDCCB Provider found: ".concat(provider.providerName, " (Type: ").concat(provider.providertype, ")"));
                            deliveryService = this.getProviderService(providerId);
                            // 3. Verificar si el servicio soporta actualización
                            if (typeof deliveryService.updateDelivery !== 'function') {
                                throw new Error("Provider ".concat(providerId, " does not support delivery updates"));
                            }
                            // 4. Configurar credenciales del proveedor
                            return [4 /*yield*/, this.configureProviderCredentials(deliveryService, provider)];
                        case 3:
                            // 4. Configurar credenciales del proveedor
                            _a.sent();
                            // 5. Actualizar el delivery
                            this.logger.log("\uD83D\uDD04 Updating delivery with provider ".concat(providerId, "..."));
                            return [4 /*yield*/, deliveryService.updateDelivery(updateData)];
                        case 4:
                            response = _a.sent();
                            this.logger.log("\u2705 Delivery updated successfully with response:", response);
                            duration = Date.now() - startTime;
                            this.logger.log("\u2705 Delivery updated successfully in ".concat(duration, "ms"), {
                                operationId: operationId,
                                deliveryId: updateData.deliveryId,
                                provider: providerId,
                            });
                            return [2 /*return*/, response];
                        case 5:
                            error_3 = _a.sent();
                            duration = Date.now() - startTime;
                            this.logger.error("\u274C Delivery update operation ".concat(operationId, " failed after ").concat(duration, "ms:"), {
                                providerId: providerId,
                                error: error_3.message,
                                stack: error_3.stack,
                            });
                            return [2 /*return*/, {
                                    success: false,
                                    error: {
                                        code: error_3.code || 'DELIVERY_UPDATE_ERROR',
                                        message: error_3.message,
                                        details: {
                                            providerId: providerId,
                                            operationId: operationId,
                                            duration: duration,
                                        },
                                    },
                                    timestamp: new Date(),
                                }];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Cancelar un delivery
         */
        DeliveryService_1.prototype.CancelDelivery = function (deliveryId, providerId, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var provider, deliveryService, cancelled, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            this.logger.log("\u274C Cancelling delivery: ".concat(deliveryId));
                            return [4 /*yield*/, this.getProviderById(providerId)];
                        case 1:
                            provider = _a.sent();
                            if (!provider) {
                                throw new common_1.NotFoundException("Provider with ID ".concat(providerId, " not found"));
                            }
                            deliveryService = this.getProviderService(providerId);
                            return [4 /*yield*/, deliveryService.cancelDelivery(deliveryId, reason)];
                        case 2:
                            cancelled = _a.sent();
                            return [2 /*return*/, cancelled];
                        case 3:
                            error_4 = _a.sent();
                            this.logger.error("\u274C Cancellation failed for delivery ".concat(deliveryId, ":"), error_4);
                            return [2 /*return*/, {
                                    success: false,
                                    error: {
                                        code: 'CANCELLATION_ERROR',
                                        message: error_4.message,
                                    },
                                    timestamp: new Date(),
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 🚚 ACTUALIZAR TIP DE UN DELIVERY (método específico para proveedores como WeKnock)
         */
        DeliveryService_1.prototype.UpdateDeliveryTip = function (providerId, externalDeliveryId, newTipAmount, newOrderAmount) {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, operationId, provider, deliveryService, response, duration, error_5, duration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = Date.now();
                            operationId = this.generateOperationId();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            this.logger.log("\uD83D\uDE9A Starting delivery tip update operation ".concat(operationId, " with provider ID: ").concat(providerId), { externalDeliveryId: externalDeliveryId, newTipAmount: newTipAmount, newOrderAmount: newOrderAmount });
                            return [4 /*yield*/, this.getProviderById(providerId)];
                        case 2:
                            provider = _a.sent();
                            if (!provider) {
                                throw new common_1.NotFoundException("Provider with ID ".concat(providerId, " not found"));
                            }
                            this.logger.log("\uD83D\uDCCB Provider found: ".concat(provider.providerName, " (Type: ").concat(provider.providertype, ")"));
                            deliveryService = this.getProviderService(providerId);
                            // 3. Verificar si el servicio soporta actualización de tip
                            if (typeof deliveryService.updateDeliveryTip !== 'function') {
                                this.logger.warn("\u26A0\uFE0F Provider ".concat(providerId, " does not support tip updates"));
                                return [2 /*return*/, {
                                        success: false,
                                        error: {
                                            code: 'TIP_UPDATE_NOT_SUPPORTED',
                                            message: "Provider ".concat(providerId, " (").concat(provider.providerName, ") does not support tip updates"),
                                        },
                                        timestamp: new Date(),
                                    }];
                            }
                            // 4. Configurar credenciales del proveedor
                            return [4 /*yield*/, this.configureProviderCredentials(deliveryService, provider)];
                        case 3:
                            // 4. Configurar credenciales del proveedor
                            _a.sent();
                            // 5. Actualizar el tip del delivery
                            this.logger.log("\uD83D\uDCB0 Updating delivery tip with provider ".concat(providerId, "..."));
                            return [4 /*yield*/, deliveryService.updateDeliveryTip(externalDeliveryId, newTipAmount, newOrderAmount)];
                        case 4:
                            response = _a.sent();
                            duration = Date.now() - startTime;
                            if (response.success) {
                                this.logger.log("\u2705 Delivery tip updated successfully in ".concat(duration, "ms"), {
                                    operationId: operationId,
                                    externalDeliveryId: externalDeliveryId,
                                    provider: providerId,
                                    newTipAmount: newTipAmount,
                                });
                            }
                            else {
                                this.logger.error("\u274C Delivery tip update failed in ".concat(duration, "ms"), {
                                    operationId: operationId,
                                    externalDeliveryId: externalDeliveryId,
                                    provider: providerId,
                                    error: response.error,
                                });
                            }
                            return [2 /*return*/, response];
                        case 5:
                            error_5 = _a.sent();
                            duration = Date.now() - startTime;
                            this.logger.error("\u274C Delivery tip update operation ".concat(operationId, " failed after ").concat(duration, "ms:"), {
                                providerId: providerId,
                                externalDeliveryId: externalDeliveryId,
                                error: error_5.message,
                                stack: error_5.stack,
                            });
                            return [2 /*return*/, {
                                    success: false,
                                    error: {
                                        code: error_5.code || 'DELIVERY_TIP_UPDATE_ERROR',
                                        message: error_5.message,
                                        details: {
                                            providerId: providerId,
                                            operationId: operationId,
                                            duration: duration,
                                            externalDeliveryId: externalDeliveryId,
                                        },
                                    },
                                    timestamp: new Date(),
                                }];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Obtener lista de proveedores disponibles
         */
        DeliveryService_1.prototype.GetAvailableProviders = function () {
            return __awaiter(this, void 0, void 0, function () {
                var providers, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.provider.findMany({
                                    where: {
                                        providertype: 'delivery',
                                    },
                                    select: {
                                        idProvider: true,
                                        providerName: true,
                                        providertype: true,
                                    },
                                })];
                        case 1:
                            providers = _a.sent();
                            return [2 /*return*/, providers.map(function (provider) { return ({
                                    id: provider.idProvider,
                                    name: provider.providerName || 'Unknown Provider',
                                    type: provider.providertype || 'delivery',
                                    isActive: true,
                                }); })];
                        case 2:
                            error_6 = _a.sent();
                            this.logger.error("\u274C Failed to get available providers:", error_6);
                            return [2 /*return*/, []];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Métodos privados
         */
        DeliveryService_1.prototype.getProviderById = function (providerId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.provider.findUnique({
                                where: { idProvider: providerId },
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        DeliveryService_1.prototype.getProviderService = function (providerId) {
            var service = this.providerServices.get(providerId);
            if (!service) {
                throw new Error("Delivery service not registered for provider: ".concat(providerId));
            }
            return service;
        };
        DeliveryService_1.prototype.configureProviderCredentials = function (service, provider) {
            return __awaiter(this, void 0, void 0, function () {
                var credentials;
                return __generator(this, function (_a) {
                    // Configurar credenciales específicas del proveedor
                    if (provider.providerToken) {
                        if (typeof service.setApiKey === 'function') {
                            service.setApiKey(provider.providerToken);
                        }
                    }
                    if (provider.providerCredential) {
                        try {
                            credentials = JSON.parse(provider.providerCredential);
                            if (typeof service.setCredentials === 'function') {
                                service.setCredentials(credentials);
                            }
                        }
                        catch (_b) {
                            // Si no es JSON, usar como string simple
                            if (typeof service.setSecret === 'function') {
                                service.setSecret(provider.providerCredential);
                            }
                        }
                    }
                    return [2 /*return*/];
                });
            });
        };
        DeliveryService_1.prototype.saveDeliveryRecord = function (response, providerId, deliveryData) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    try {
                        // Guardar el registro en la base de datos
                        // Implementación depende de tu esquema de base de datos
                        this.logger.debug('📝 Simple delivery record saved (implementation pending)');
                    }
                    catch (error) {
                        this.logger.warn('⚠️ Failed to save simple delivery record:', error);
                    }
                    return [2 /*return*/];
                });
            });
        };
        DeliveryService_1.prototype.findDeliveryRecord = function (deliveryId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    try {
                        // Buscar registro de delivery en la base de datos
                        // Implementación depende de tu esquema de base de datos
                        return [2 /*return*/, null];
                    }
                    catch (error) {
                        this.logger.warn('⚠️ Failed to find delivery record:', error);
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/];
                });
            });
        };
        DeliveryService_1.prototype.generateOperationId = function () {
            return "delivery_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 9));
        };
        return DeliveryService_1;
    }());
    __setFunctionName(_classThis, "DeliveryService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DeliveryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DeliveryService = _classThis;
}();
exports.DeliveryService = DeliveryService;
