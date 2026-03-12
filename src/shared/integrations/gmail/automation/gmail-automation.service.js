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
exports.GmailAutomationService = void 0;
// gmail-automation.service.ts
var common_1 = require("@nestjs/common");
// import { Cron, CronExpression } from '@nestjs/schedule';
var rxjs_1 = require("rxjs");
var GmailAutomationService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var GmailAutomationService = _classThis = /** @class */ (function () {
        function GmailAutomationService_1(gmailService, httpService) {
            this.gmailService = gmailService;
            this.httpService = httpService;
            this.logger = new common_1.Logger(GmailAutomationService.name);
            this.activeConfigs = new Map();
            this.processingInProgress = false;
            this.processedMessages = new Set();
            this.monitoringInterval = null;
        }
        GmailAutomationService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log('Gmail Automation Service iniciado');
                            // Cargar configuraciones desde base de datos si existe
                            return [4 /*yield*/, this.loadConfigurations()];
                        case 1:
                            // Cargar configuraciones desde base de datos si existe
                            _a.sent();
                            // Iniciar monitoreo automático
                            this.startMonitoring();
                            return [2 /*return*/];
                    }
                });
            });
        };
        GmailAutomationService_1.prototype.onModuleDestroy = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log('Gmail Automation Service detenido');
                    this.stopMonitoring();
                    return [2 /*return*/];
                });
            });
        };
        /**
         * Iniciar monitoreo automático con intervalo
         */
        GmailAutomationService_1.prototype.startMonitoring = function () {
            var _this = this;
            if (this.monitoringInterval) {
                return; // Ya está iniciado
            }
            this.logger.log('Iniciando monitoreo automático de correos cada 30 segundos');
            this.monitoringInterval = setInterval(function () {
                _this.checkForNewEmails().catch(function (error) {
                    _this.logger.error('Error en verificación automática:', error);
                });
            }, 30000); // 30 segundos
        };
        /**
         * Detener monitoreo automático
         */
        GmailAutomationService_1.prototype.stopMonitoring = function () {
            if (this.monitoringInterval) {
                clearInterval(this.monitoringInterval);
                this.monitoringInterval = null;
                this.logger.log('Monitoreo automático detenido');
            }
        };
        /**
         * Método público para forzar verificación manual
         */
        GmailAutomationService_1.prototype.forceCheck = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log('Forzando verificación manual de correos');
                            return [4 /*yield*/, this.checkForNewEmails()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Registrar un usuario para monitoreo automático de correos
         */
        GmailAutomationService_1.prototype.registerUser = function (config) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            // Validar tokens
                            return [4 /*yield*/, this.gmailService.getProfile(config.accessToken)];
                        case 1:
                            // Validar tokens
                            _a.sent();
                            this.activeConfigs.set(config.userId, config);
                            this.logger.log("Usuario ".concat(config.userId, " registrado para monitoreo autom\u00E1tico"));
                            // Procesar correos existentes no leídos inmediatamente
                            return [4 /*yield*/, this.processUserEmails(config.userId)];
                        case 2:
                            // Procesar correos existentes no leídos inmediatamente
                            _a.sent();
                            // Guardar configuración en base de datos (opcional)
                            return [4 /*yield*/, this.saveConfiguration(config)];
                        case 3:
                            // Guardar configuración en base de datos (opcional)
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            this.logger.error("Error registrando usuario ".concat(config.userId, ":"), error_1);
                            throw error_1;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Desregistrar un usuario del monitoreo
         */
        GmailAutomationService_1.prototype.unregisterUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.activeConfigs.delete(userId);
                            this.logger.log("Usuario ".concat(userId, " desregistrado del monitoreo"));
                            // Eliminar de base de datos si existe
                            return [4 /*yield*/, this.removeConfiguration(userId)];
                        case 1:
                            // Eliminar de base de datos si existe
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Actualizar configuración de un usuario
         */
        GmailAutomationService_1.prototype.updateUserConfig = function (userId, updates) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            existing = this.activeConfigs.get(userId);
                            if (!existing) {
                                throw new Error("Usuario ".concat(userId, " no est\u00E1 registrado"));
                            }
                            updated = __assign(__assign({}, existing), updates);
                            this.activeConfigs.set(userId, updated);
                            return [4 /*yield*/, this.saveConfiguration(updated)];
                        case 1:
                            _a.sent();
                            this.logger.log("Configuraci\u00F3n actualizada para usuario ".concat(userId));
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Cron job que ejecuta cada 30 segundos para verificar nuevos correos
         * Comentado temporalmente hasta instalar @nestjs/schedule
         */
        // @Cron('*/30 * * * * *') // Cada 30 segundos
        GmailAutomationService_1.prototype.checkForNewEmails = function () {
            return __awaiter(this, void 0, void 0, function () {
                var promises, error_2;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.processingInProgress || this.activeConfigs.size === 0) {
                                return [2 /*return*/];
                            }
                            this.processingInProgress = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            promises = Array.from(this.activeConfigs.keys()).map(function (userId) {
                                return _this.processUserEmails(userId).catch(function (error) {
                                    _this.logger.error("Error procesando correos para usuario ".concat(userId, ":"), error);
                                });
                            });
                            return [4 /*yield*/, Promise.all(promises)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 3:
                            error_2 = _a.sent();
                            this.logger.error('Error en verificación automática de correos:', error_2);
                            return [3 /*break*/, 5];
                        case 4:
                            this.processingInProgress = false;
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Procesar correos de un usuario específico (método público)
         */
        GmailAutomationService_1.prototype.processUserEmailsManually = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.processUserEmails(userId)];
                });
            });
        };
        /**
         * Procesar correos de un usuario específico
         */
        GmailAutomationService_1.prototype.processUserEmails = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var config, accessToken, newMessages, _i, newMessages_1, message, lastMessage, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            config = this.activeConfigs.get(userId);
                            if (!config)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 10, , 13]);
                            return [4 /*yield*/, this.ensureValidToken(config)];
                        case 2:
                            accessToken = _a.sent();
                            return [4 /*yield*/, this.findNewMessages(accessToken, config)];
                        case 3:
                            newMessages = _a.sent();
                            if (newMessages.length === 0) {
                                return [2 /*return*/];
                            }
                            this.logger.log("Encontrados ".concat(newMessages.length, " correos nuevos para usuario ").concat(userId));
                            _i = 0, newMessages_1 = newMessages;
                            _a.label = 4;
                        case 4:
                            if (!(_i < newMessages_1.length)) return [3 /*break*/, 7];
                            message = newMessages_1[_i];
                            return [4 /*yield*/, this.processMessage(userId, message, config)];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 4];
                        case 7:
                            if (!(newMessages.length > 0)) return [3 /*break*/, 9];
                            lastMessage = newMessages[0];
                            config.lastProcessedMessageId = lastMessage.id;
                            config.lastProcessedDate = new Date();
                            this.activeConfigs.set(userId, config);
                            return [4 /*yield*/, this.saveConfiguration(config)];
                        case 8:
                            _a.sent();
                            _a.label = 9;
                        case 9: return [3 /*break*/, 13];
                        case 10:
                            error_3 = _a.sent();
                            this.logger.error("Error procesando correos para usuario ".concat(userId, ":"), error_3);
                            if (!(error_3.status === 401)) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.refreshUserToken(userId)];
                        case 11:
                            _a.sent();
                            _a.label = 12;
                        case 12: return [3 /*break*/, 13];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Buscar mensajes nuevos desde la última verificación
         */
        GmailAutomationService_1.prototype.findNewMessages = function (accessToken, config) {
            return __awaiter(this, void 0, void 0, function () {
                var query, enabledFilters, filterQueries, result, newMessages;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            query = 'is:unread';
                            // Agregar filtros personalizados
                            if (config.filters && config.filters.length > 0) {
                                enabledFilters = config.filters.filter(function (f) { return f.enabled; });
                                if (enabledFilters.length > 0) {
                                    filterQueries = enabledFilters.map(function (f) { return f.query; }).join(' OR ');
                                    query = "(".concat(query, ") AND (").concat(filterQueries, ")");
                                }
                            }
                            // Buscar solo correos de la última hora para evitar procesar demasiados
                            query += ' newer_than:1h';
                            return [4 /*yield*/, this.gmailService.searchMessages(accessToken, {
                                    query: query,
                                    maxResults: 50
                                })];
                        case 1:
                            result = _a.sent();
                            newMessages = result.messages.filter(function (msg) {
                                return !_this.processedMessages.has(msg.id) &&
                                    (!config.lastProcessedMessageId || msg.id !== config.lastProcessedMessageId);
                            });
                            return [2 /*return*/, newMessages];
                    }
                });
            });
        };
        /**
         * Procesar un mensaje individual
         */
        GmailAutomationService_1.prototype.processMessage = function (userId, message, config) {
            return __awaiter(this, void 0, void 0, function () {
                var parsedEmail, actionResults, processed, error_4;
                var _this = this;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (this.processedMessages.has(message.id)) {
                                return [2 /*return*/]; // Ya se está procesando
                            }
                            this.processedMessages.add(message.id);
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 6, 8, 9]);
                            parsedEmail = this.gmailService.parseEmailContent(message);
                            this.logger.log("Procesando correo para ".concat(userId, ": ").concat(parsedEmail.subject, " de ").concat(parsedEmail.from));
                            return [4 /*yield*/, this.executeActions(userId, message, parsedEmail, config)];
                        case 2:
                            actionResults = _c.sent();
                            processed = {
                                messageId: message.id,
                                userId: userId,
                                processed: new Date(),
                                actions: actionResults.map(function (r) { return r.action; }),
                                success: actionResults.every(function (r) { return r.success; }),
                                error: (_a = actionResults.find(function (r) { return !r.success; })) === null || _a === void 0 ? void 0 : _a.error
                            };
                            return [4 /*yield*/, this.saveProcessedEmail(processed)];
                        case 3:
                            _c.sent();
                            if (!((_b = config.actions) === null || _b === void 0 ? void 0 : _b.some(function (a) { return a.type === 'mark_read' && a.enabled; }))) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.gmailService.markAsRead(config.accessToken, message.id)];
                        case 4:
                            _c.sent();
                            _c.label = 5;
                        case 5: return [3 /*break*/, 9];
                        case 6:
                            error_4 = _c.sent();
                            this.logger.error("Error procesando mensaje ".concat(message.id, " para usuario ").concat(userId, ":"), error_4);
                            return [4 /*yield*/, this.saveProcessedEmail({
                                    messageId: message.id,
                                    userId: userId,
                                    processed: new Date(),
                                    actions: [],
                                    success: false,
                                    error: error_4.message
                                })];
                        case 7:
                            _c.sent();
                            return [3 /*break*/, 9];
                        case 8:
                            // Mantener en memoria por un tiempo para evitar reprocesar
                            setTimeout(function () {
                                _this.processedMessages.delete(message.id);
                            }, 5 * 60 * 1000); // 5 minutos
                            return [7 /*endfinally*/];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Ejecutar acciones configuradas para un correo
         */
        GmailAutomationService_1.prototype.executeActions = function (userId, message, parsedEmail, config) {
            return __awaiter(this, void 0, void 0, function () {
                var results, _a, _b, _i, _c, action, result, _d, error_5;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            results = [];
                            if (!(!config.actions || config.actions.length === 0)) return [3 /*break*/, 2];
                            // Acción por defecto: llamar webhook genérico
                            _b = (_a = results).push;
                            return [4 /*yield*/, this.executeDefaultAction(userId, message, parsedEmail)];
                        case 1:
                            // Acción por defecto: llamar webhook genérico
                            _b.apply(_a, [_e.sent()]);
                            return [2 /*return*/, results];
                        case 2:
                            _i = 0, _c = config.actions.filter(function (a) { return a.enabled; });
                            _e.label = 3;
                        case 3:
                            if (!(_i < _c.length)) return [3 /*break*/, 17];
                            action = _c[_i];
                            _e.label = 4;
                        case 4:
                            _e.trys.push([4, 15, , 16]);
                            result = void 0;
                            _d = action.type;
                            switch (_d) {
                                case 'webhook': return [3 /*break*/, 5];
                                case 'function': return [3 /*break*/, 7];
                                case 'database': return [3 /*break*/, 9];
                                case 'notification': return [3 /*break*/, 11];
                            }
                            return [3 /*break*/, 13];
                        case 5: return [4 /*yield*/, this.executeWebhookAction(action, userId, message, parsedEmail)];
                        case 6:
                            result = _e.sent();
                            return [3 /*break*/, 14];
                        case 7: return [4 /*yield*/, this.executeFunctionAction(action, userId, message, parsedEmail)];
                        case 8:
                            result = _e.sent();
                            return [3 /*break*/, 14];
                        case 9: return [4 /*yield*/, this.executeDatabaseAction(action, userId, message, parsedEmail)];
                        case 10:
                            result = _e.sent();
                            return [3 /*break*/, 14];
                        case 11: return [4 /*yield*/, this.executeNotificationAction(action, userId, message, parsedEmail)];
                        case 12:
                            result = _e.sent();
                            return [3 /*break*/, 14];
                        case 13: throw new Error("Tipo de acci\u00F3n no soportado: ".concat(action.type));
                        case 14:
                            results.push(__assign({ action: action.name, success: true }, result));
                            return [3 /*break*/, 16];
                        case 15:
                            error_5 = _e.sent();
                            this.logger.error("Error ejecutando acci\u00F3n ".concat(action.name, ":"), error_5);
                            results.push({
                                action: action.name,
                                success: false,
                                error: error_5.message
                            });
                            return [3 /*break*/, 16];
                        case 16:
                            _i++;
                            return [3 /*break*/, 3];
                        case 17: return [2 /*return*/, results];
                    }
                });
            });
        };
        /**
         * Ejecutar acción webhook
         */
        GmailAutomationService_1.prototype.executeWebhookAction = function (action, userId, message, parsedEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            payload = {
                                userId: userId,
                                messageId: message.id,
                                email: {
                                    from: parsedEmail.from,
                                    to: parsedEmail.to,
                                    subject: parsedEmail.subject,
                                    date: parsedEmail.date,
                                    textContent: parsedEmail.textContent,
                                    htmlContent: parsedEmail.htmlContent,
                                    attachments: parsedEmail.attachments
                                },
                                timestamp: new Date()
                            };
                            return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.post(action.config.url, payload, {
                                    headers: __assign({ 'Content-Type': 'application/json' }, action.config.headers),
                                    timeout: action.config.timeout || 30000
                                }))];
                        case 1:
                            response = _a.sent();
                            this.logger.log("Webhook ejecutado para ".concat(action.name, ": ").concat(response.status));
                            return [2 /*return*/, { webhookResponse: response.data }];
                    }
                });
            });
        };
        /**
         * Ejecutar acción de función personalizada
         */
        GmailAutomationService_1.prototype.executeFunctionAction = function (action, userId, message, parsedEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = action.config.functionName;
                            switch (_a) {
                                case 'processSupport': return [3 /*break*/, 1];
                                case 'extractInvoice': return [3 /*break*/, 3];
                                case 'autoReply': return [3 /*break*/, 5];
                            }
                            return [3 /*break*/, 7];
                        case 1: return [4 /*yield*/, this.processSupportEmail(userId, parsedEmail)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3: return [4 /*yield*/, this.extractInvoiceData(userId, parsedEmail)];
                        case 4: return [2 /*return*/, _b.sent()];
                        case 5: return [4 /*yield*/, this.sendAutoReply(userId, parsedEmail)];
                        case 6: return [2 /*return*/, _b.sent()];
                        case 7: throw new Error("Funci\u00F3n no implementada: ".concat(action.config.functionName));
                    }
                });
            });
        };
        /**
         * Ejecutar acción de base de datos
         */
        GmailAutomationService_1.prototype.executeDatabaseAction = function (action, userId, message, parsedEmail) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Aquí puedes guardar en tu base de datos
                    this.logger.log("Guardando email en base de datos: ".concat(parsedEmail.subject));
                    return [2 /*return*/, { saved: true }];
                });
            });
        };
        /**
         * Ejecutar acción de notificación
         */
        GmailAutomationService_1.prototype.executeNotificationAction = function (action, userId, message, parsedEmail) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Aquí puedes enviar notificaciones (push, SMS, etc.)
                    this.logger.log("Enviando notificaci\u00F3n: Nuevo correo de ".concat(parsedEmail.from));
                    return [2 /*return*/, { notificationSent: true }];
                });
            });
        };
        /**
         * Funciones de ejemplo para acciones personalizadas
         */
        GmailAutomationService_1.prototype.processSupportEmail = function (userId, email) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("Procesando correo de soporte de ".concat(email.from, ": ").concat(email.subject));
                    // Aquí puedes integrar con tu sistema de tickets
                    // Por ejemplo, crear un ticket en tu base de datos
                    return [2 /*return*/, { ticketCreated: true, ticketId: "TICKET-".concat(Date.now()) }];
                });
            });
        };
        GmailAutomationService_1.prototype.extractInvoiceData = function (userId, email) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("Extrayendo datos de factura de ".concat(email.from));
                    // Aquí puedes usar IA para extraer datos de facturas
                    // Integrar con tu módulo de IA existente
                    return [2 /*return*/, { invoiceData: { amount: 0, vendor: email.from } }];
                });
            });
        };
        GmailAutomationService_1.prototype.sendAutoReply = function (userId, email) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("Enviando respuesta autom\u00E1tica a ".concat(email.from));
                    // Aquí puedes integrar con nodemailer o tu servicio de email
                    return [2 /*return*/, { autoReplySent: true }];
                });
            });
        };
        /**
         * Acción por defecto cuando no hay acciones configuradas
         */
        GmailAutomationService_1.prototype.executeDefaultAction = function (userId, message, parsedEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    try {
                        this.logger.log("[NUEVO CORREO] Usuario: ".concat(userId));
                        this.logger.log("De: ".concat(parsedEmail.from));
                        this.logger.log("Asunto: ".concat(parsedEmail.subject));
                        this.logger.log("Fecha: ".concat(parsedEmail.date));
                        this.logger.log("Contenido: ".concat((_a = parsedEmail.textContent) === null || _a === void 0 ? void 0 : _a.substring(0, 200), "..."));
                        this.logger.log("Adjuntos: ".concat(parsedEmail.attachments.length));
                        this.logger.log('---');
                        // Aquí puedes agregar tu lógica personalizada por defecto
                        // Por ejemplo: guardar en base de datos, enviar notificación, etc.
                        return [2 /*return*/, { action: 'default_log', success: true }];
                    }
                    catch (error) {
                        return [2 /*return*/, { action: 'default_log', success: false, error: error.message }];
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * Asegurar que el token sea válido, refrescar si es necesario
         */
        GmailAutomationService_1.prototype.ensureValidToken = function (config) {
            return __awaiter(this, void 0, void 0, function () {
                var error_6, newToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 6]);
                            // Probar el token actual
                            return [4 /*yield*/, this.gmailService.getProfile(config.accessToken)];
                        case 1:
                            // Probar el token actual
                            _a.sent();
                            return [2 /*return*/, config.accessToken];
                        case 2:
                            error_6 = _a.sent();
                            if (!(error_6.status === 401)) return [3 /*break*/, 5];
                            // Token expirado, refrescar
                            this.logger.log("Refrescando token para usuario ".concat(config.userId));
                            return [4 /*yield*/, this.gmailService.refreshAccessToken({
                                    clientId: process.env.GMAIL_CLIENT_ID,
                                    clientSecret: process.env.GMAIL_CLIENT_SECRET,
                                    redirectUri: process.env.GMAIL_REDIRECT_URI,
                                    refreshToken: config.refreshToken
                                })];
                        case 3:
                            newToken = _a.sent();
                            config.accessToken = newToken;
                            this.activeConfigs.set(config.userId, config);
                            return [4 /*yield*/, this.saveConfiguration(config)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, newToken];
                        case 5: throw error_6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Métodos de persistencia (implementar según tu base de datos)
         */
        GmailAutomationService_1.prototype.loadConfigurations = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Cargar configuraciones desde base de datos
                    this.logger.log('Cargando configuraciones de usuarios...');
                    return [2 /*return*/];
                });
            });
        };
        GmailAutomationService_1.prototype.saveConfiguration = function (config) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        };
        GmailAutomationService_1.prototype.removeConfiguration = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        };
        GmailAutomationService_1.prototype.saveProcessedEmail = function (processed) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        };
        GmailAutomationService_1.prototype.refreshUserToken = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        };
        return GmailAutomationService_1;
    }());
    __setFunctionName(_classThis, "GmailAutomationService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GmailAutomationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GmailAutomationService = _classThis;
}();
exports.GmailAutomationService = GmailAutomationService;
