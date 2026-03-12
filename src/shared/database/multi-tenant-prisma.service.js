"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.MultiTenantPrismaService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var extension_accelerate_1 = require("@prisma/extension-accelerate");
/**
 * 🏢 Multi-Tenant Prisma Service
 *
 * Maneja múltiples conexiones de Prisma, una por cada schema/restaurante.
 *
 * Características:
 * - Pool de conexiones por schema
 * - Lazy loading (crea conexiones bajo demanda)
 * - Reutiliza conexiones existentes
 * - Set search_path automático por schema
 * - Compatible con Prisma Accelerate
 */
var MultiTenantPrismaService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MultiTenantPrismaService = _classThis = /** @class */ (function () {
        function MultiTenantPrismaService_1(schemaContext) {
            this.schemaContext = schemaContext;
            this.logger = new common_1.Logger(MultiTenantPrismaService.name);
            /**
             * Map de schema → PrismaClient
             * Mantiene un cliente por cada schema activo
             */
            this.schemaClients = new Map();
            /**
             * Cliente default (para casos sin multi-tenancy)
             */
            this.defaultClient = null;
        }
        MultiTenantPrismaService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.logger.log('🏢 Inicializando Multi-Tenant Prisma Service...');
                            // Crear cliente default
                            _a = this;
                            return [4 /*yield*/, this.createPrismaClient('default')];
                        case 1:
                            // Crear cliente default
                            _a.defaultClient = _b.sent();
                            this.logger.log('✅ Multi-Tenant Prisma Service inicializado');
                            return [2 /*return*/];
                    }
                });
            });
        };
        MultiTenantPrismaService_1.prototype.onModuleDestroy = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _i, _a, _b, schema, client;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            this.logger.log('🔌 Desconectando todos los clientes Prisma...');
                            if (!this.defaultClient) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.disconnectClient(this.defaultClient, 'default')];
                        case 1:
                            _c.sent();
                            _c.label = 2;
                        case 2:
                            _i = 0, _a = this.schemaClients.entries();
                            _c.label = 3;
                        case 3:
                            if (!(_i < _a.length)) return [3 /*break*/, 6];
                            _b = _a[_i], schema = _b[0], client = _b[1];
                            return [4 /*yield*/, this.disconnectClient(client, schema)];
                        case 4:
                            _c.sent();
                            _c.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6:
                            this.logger.log('✅ Todos los clientes desconectados');
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Obtener el cliente Prisma correcto según el contexto
         *
         * - Si hay contexto de schema → devuelve cliente del schema
         * - Si NO hay contexto → lanza NotFoundException
         *
         * NOTA: Este método es síncrono para compatibilidad con getters
         */
        MultiTenantPrismaService_1.prototype.getClient = function () {
            var context = this.schemaContext.getContext();
            if (!context || !context.schemaName) {
                // No hay contexto → lanzar error
                this.logger.error('❌ No schema context found. Multi-tenant requests require restaurant context.');
                throw new common_1.NotFoundException('Restaurant context not found. Please provide a valid restaurantsub header.');
            }
            // Si el cliente ya existe, devolverlo (síncrono)
            if (this.schemaClients.has(context.schemaName)) {
                this.logger.debug("\u267B\uFE0F Reusing existing client for schema: ".concat(context.schemaName));
                return this.schemaClients.get(context.schemaName);
            }
            // Si no existe, necesitamos crearlo - pero esto requiere validación async
            // Lanzamos error indicando que el schema no ha sido inicializado
            this.logger.error("\u274C Schema client for '".concat(context.schemaName, "' not initialized yet."));
            throw new common_1.NotFoundException("Schema '".concat(context.schemaName, "' client not initialized. Please ensure the schema is properly configured."));
        };
        /**
         * Obtener cliente para un schema específico
         * Si no existe, lo crea y conecta
         * Si el schema no existe en la BD, lanza NotFoundException
         */
        MultiTenantPrismaService_1.prototype.getSchemaClient = function (schemaName) {
            return __awaiter(this, void 0, void 0, function () {
                var schemaExists, client;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Verificar si ya existe el cliente
                            if (this.schemaClients.has(schemaName)) {
                                this.logger.debug("\u267B\uFE0F Reusing existing client for schema: ".concat(schemaName));
                                return [2 /*return*/, this.schemaClients.get(schemaName)];
                            }
                            return [4 /*yield*/, this.validateSchemaExists(schemaName)];
                        case 1:
                            schemaExists = _a.sent();
                            if (!schemaExists) {
                                this.logger.error("\u274C Schema '".concat(schemaName, "' does not exist in database"));
                                throw new common_1.NotFoundException("Restaurant schema '".concat(schemaName, "' not found in database. Please verify the restaurant configuration."));
                            }
                            // No existe → crear nuevo cliente
                            this.logger.log("\uD83C\uDD95 Creating new Prisma client for schema: ".concat(schemaName));
                            client = this.createPrismaClient(schemaName);
                            // Guardar en el map
                            this.schemaClients.set(schemaName, client);
                            return [2 /*return*/, client];
                    }
                });
            });
        };
        /**
         * Validar que un schema existe en la base de datos
         */
        MultiTenantPrismaService_1.prototype.validateSchemaExists = function (schemaName) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.defaultClient.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        SELECT schema_name \n        FROM information_schema.schemata \n        WHERE schema_name = ", "\n      "], ["\n        SELECT schema_name \n        FROM information_schema.schemata \n        WHERE schema_name = ", "\n      "])), schemaName)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result.length > 0];
                        case 2:
                            error_1 = _a.sent();
                            this.logger.error("Error validating schema ".concat(schemaName, ":"), error_1);
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Crear un nuevo cliente Prisma con search_path configurado
         */
        MultiTenantPrismaService_1.prototype.createPrismaClient = function (schemaName) {
            this.logger.debug("Creating Prisma client for schema: ".concat(schemaName));
            // Obtener DATABASE_URL
            var databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_DEV;
            if (!databaseUrl) {
                throw new Error('DATABASE_URL not configured');
            }
            // 🔥 MODIFICAR LA URL PARA INCLUIR EL SCHEMA directamente
            var connectionString = databaseUrl;
            if (schemaName !== 'default' && schemaName !== 'public') {
                // Remover cualquier ?schema= existente
                connectionString = connectionString.split('?')[0];
                // Agregar el schema correcto
                connectionString = "".concat(connectionString, "?schema=").concat(schemaName);
                this.logger.debug("Using connection string with schema: ".concat(schemaName));
            }
            // Crear cliente con el connection string modificado
            var client = new client_1.PrismaClient({
                datasources: {
                    db: {
                        url: connectionString,
                    },
                },
                log: ['error', 'warn'],
            });
            // Aplicar Accelerate si es necesario
            if (this.isDatabaseUrlAccelerate(databaseUrl)) {
                return client.$extends((0, extension_accelerate_1.withAccelerate)());
            }
            return client;
        };
        /**
         * Configurar el search_path para un cliente específico
         */
        MultiTenantPrismaService_1.prototype.setupSchemaPath = function (client, schemaName) {
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.logger.debug("Setting search_path to: ".concat(schemaName));
                            // Ejecutar SET search_path en la conexión
                            return [4 /*yield*/, client.$executeRawUnsafe("SET search_path TO \"".concat(schemaName, "\", public;"))];
                        case 1:
                            // Ejecutar SET search_path en la conexión
                            _a.sent();
                            this.logger.debug("\u2705 Search path configured for schema: ".concat(schemaName));
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            this.logger.error("\u274C Error setting search_path for schema ".concat(schemaName, ":"), error_2);
                            throw error_2;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Desconectar un cliente
         */
        MultiTenantPrismaService_1.prototype.disconnectClient = function (client, schemaName) {
            return __awaiter(this, void 0, void 0, function () {
                var error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.logger.debug("Disconnecting client for schema: ".concat(schemaName));
                            return [4 /*yield*/, client.$disconnect()];
                        case 1:
                            _a.sent();
                            this.logger.debug("\u2705 Disconnected: ".concat(schemaName));
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            this.logger.error("\u274C Error disconnecting client ".concat(schemaName, ":"), error_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Verificar si la URL usa Prisma Accelerate
         */
        MultiTenantPrismaService_1.prototype.isDatabaseUrlAccelerate = function (url) {
            return url.includes('prisma+postgres://accelerate.prisma-data.net');
        };
        /**
         * Health check del cliente actual
         */
        MultiTenantPrismaService_1.prototype.healthCheck = function () {
            return __awaiter(this, void 0, void 0, function () {
                var client, context, schema, start, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            client = this.getClient();
                            context = this.schemaContext.getContext();
                            schema = (context === null || context === void 0 ? void 0 : context.schemaName) || 'default';
                            start = Date.now();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, client.$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["SELECT 1"], ["SELECT 1"])))];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, {
                                    status: 'healthy',
                                    latency: Date.now() - start,
                                    schema: schema,
                                    accelerate: this.isDatabaseUrlAccelerate(process.env.DATABASE_URL || ''),
                                }];
                        case 3:
                            error_4 = _a.sent();
                            return [2 /*return*/, {
                                    status: 'unhealthy',
                                    latency: Date.now() - start,
                                    schema: schema,
                                    error: error_4.message,
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Obtener estadísticas de conexiones activas
         */
        MultiTenantPrismaService_1.prototype.getConnectionStats = function () {
            return {
                totalSchemas: this.schemaClients.size,
                schemas: Array.from(this.schemaClients.keys()),
                hasDefault: !!this.defaultClient,
                currentContext: this.schemaContext.getContext(),
            };
        };
        return MultiTenantPrismaService_1;
    }());
    __setFunctionName(_classThis, "MultiTenantPrismaService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MultiTenantPrismaService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MultiTenantPrismaService = _classThis;
}();
exports.MultiTenantPrismaService = MultiTenantPrismaService;
var templateObject_1, templateObject_2;
