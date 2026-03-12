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
exports.AuthorizationClientService = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("axios");
/**
 * Cliente HTTP para comunicarse con el servicio de Authorization
 * Se usa para crear usuarios y verificar existencia
 */
var AuthorizationClientService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthorizationClientService = _classThis = /** @class */ (function () {
        function AuthorizationClientService_1() {
            this.logger = new common_1.Logger(AuthorizationClientService.name);
            this.baseUrl = process.env.AUTH_URL || 'http://localhost:5000';
            this.client = axios_1.default.create({
                baseURL: this.baseUrl,
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            this.logger.log("Authorization Client initialized with URL: ".concat(this.baseUrl));
        }
        /**
         * Crear usuario en Authorization desde Core
         * @param data Datos del usuario
         * @param authToken Token JWT del usuario que está creando
         * @returns Usuario creado
         */
        AuthorizationClientService_1.prototype.createUser = function (data, authToken) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.logger.log("Creating user in Authorization: ".concat(data.email));
                            return [4 /*yield*/, this.client.post('/users/create-from-core', data, {
                                    headers: {
                                        Authorization: "Bearer ".concat(authToken),
                                    },
                                })];
                        case 1:
                            response = _a.sent();
                            this.logger.log("User created in Authorization: ".concat(response.data.uuid));
                            return [2 /*return*/, response.data];
                        case 2:
                            error_1 = _a.sent();
                            this.handleError(error_1, 'createUser');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Verificar si un email existe en Authorization
         * @param email Email a verificar
         * @param authToken Token JWT
         * @returns true si existe, false si no
         */
        AuthorizationClientService_1.prototype.existsByEmail = function (email, authToken) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_2;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            this.logger.log("Checking if email exists in Authorization: ".concat(email));
                            return [4 /*yield*/, this.client.get("/users/exists/email/".concat(encodeURIComponent(email)), {
                                    headers: {
                                        Authorization: "Bearer ".concat(authToken),
                                    },
                                })];
                        case 1:
                            response = _c.sent();
                            this.logger.log("existsByEmail response: ".concat(JSON.stringify(response.data)));
                            return [2 /*return*/, ((_a = response.data) === null || _a === void 0 ? void 0 : _a.exists) === true];
                        case 2:
                            error_2 = _c.sent();
                            // Si es 404, el endpoint no existe o el usuario no existe
                            if (((_b = error_2.response) === null || _b === void 0 ? void 0 : _b.status) === 404) {
                                this.logger.log("existsByEmail: 404 response, returning false");
                                return [2 /*return*/, false];
                            }
                            this.logger.error("existsByEmail error: ".concat(error_2.message));
                            // En caso de error, asumimos que no existe para permitir la creación
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Verificar si un UUID existe en Authorization
         * @param uuid UUID a verificar
         * @param authToken Token JWT
         * @returns true si existe, false si no
         */
        AuthorizationClientService_1.prototype.existsByUuid = function (uuid, authToken) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_3;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.client.get("/users/exists/uuid/".concat(uuid), {
                                    headers: {
                                        Authorization: "Bearer ".concat(authToken),
                                    },
                                })];
                        case 1:
                            response = _b.sent();
                            return [2 /*return*/, response.data.exists];
                        case 2:
                            error_3 = _b.sent();
                            // Si es 404, el endpoint no existe, asumimos que no existe el usuario
                            if (((_a = error_3.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                                return [2 /*return*/, false];
                            }
                            this.handleError(error_3, 'existsByUuid');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Asignar un tenant a un usuario existente en Authorization
         * @param email Email del usuario
         * @param tenantId UUID del tenant
         * @param roleInTenant Rol en el tenant (opcional, default: employee)
         * @param authToken Token JWT
         * @returns true si se asignó correctamente
         */
        AuthorizationClientService_1.prototype.assignTenant = function (email_1, tenantId_1) {
            return __awaiter(this, arguments, void 0, function (email, tenantId, roleInTenant, authToken) {
                var error_4;
                var _a;
                if (roleInTenant === void 0) { roleInTenant = 'employee'; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            this.logger.log("Assigning tenant ".concat(tenantId, " to user ").concat(email));
                            return [4 /*yield*/, this.client.post('/users/assign-tenant', {
                                    email: email,
                                    tenantId: tenantId,
                                    role_in_tenant: roleInTenant,
                                }, {
                                    headers: {
                                        Authorization: "Bearer ".concat(authToken),
                                    },
                                })];
                        case 1:
                            _b.sent();
                            this.logger.log("Tenant ".concat(tenantId, " assigned to user ").concat(email));
                            return [2 /*return*/, true];
                        case 2:
                            error_4 = _b.sent();
                            // Si es 409, ya está asignado - no es error
                            if (((_a = error_4.response) === null || _a === void 0 ? void 0 : _a.status) === common_1.HttpStatus.CONFLICT) {
                                this.logger.log("User ".concat(email, " already has tenant ").concat(tenantId, " assigned"));
                                return [2 /*return*/, true];
                            }
                            this.handleError(error_4, 'assignTenant');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Manejo centralizado de errores
         */
        AuthorizationClientService_1.prototype.handleError = function (error, method) {
            var _a, _b, _c;
            if (axios_1.default.isAxiosError(error)) {
                var axiosError = error;
                var status_1 = ((_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.status) || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
                var message = ((_c = (_b = axiosError.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || axiosError.message;
                this.logger.error("Authorization Client Error [".concat(method, "]: ").concat(status_1, " - ").concat(message), axiosError.stack);
                // Propagar errores específicos
                if (status_1 === common_1.HttpStatus.CONFLICT) {
                    throw new common_1.HttpException("El usuario ya existe en Authorization: ".concat(message), common_1.HttpStatus.CONFLICT);
                }
                if (status_1 === common_1.HttpStatus.FORBIDDEN) {
                    throw new common_1.HttpException("No tienes permiso para crear usuarios: ".concat(message), common_1.HttpStatus.FORBIDDEN);
                }
                if (status_1 === common_1.HttpStatus.UNAUTHORIZED) {
                    throw new common_1.HttpException("Token inv\u00E1lido o expirado: ".concat(message), common_1.HttpStatus.UNAUTHORIZED);
                }
                throw new common_1.HttpException("Error comunic\u00E1ndose con Authorization: ".concat(message), status_1);
            }
            this.logger.error("Unexpected error in ".concat(method, ":"), error);
            throw new common_1.HttpException('Error interno al comunicarse con Authorization', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        };
        return AuthorizationClientService_1;
    }());
    __setFunctionName(_classThis, "AuthorizationClientService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthorizationClientService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthorizationClientService = _classThis;
}();
exports.AuthorizationClientService = AuthorizationClientService;
