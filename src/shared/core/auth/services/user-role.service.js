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
exports.UserRoleService = void 0;
var common_1 = require("@nestjs/common");
var service_cache_1 = require("../../services/service-cache/service-cache");
var roles_enum_1 = require("../constants/roles.enum");
var UserRoleService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UserRoleService = _classThis = /** @class */ (function () {
        function UserRoleService_1() {
            this.logger = new common_1.Logger(UserRoleService.name);
        }
        /**
         * Verificar si un usuario puede modificar usuarios AIA
         */
        UserRoleService_1.prototype.canModifyAIAUsers = function (authorizationRole) {
            var canModify = authorizationRole === roles_enum_1.AuthorizationRole.SUPER_ADMIN ||
                authorizationRole === roles_enum_1.AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN ||
                authorizationRole === roles_enum_1.AuthorizationRole.ASSISTANT;
            this.logger.debug("AuthRole ".concat(authorizationRole, " puede modificar AIA: ").concat(canModify));
            return canModify;
        };
        /**
         * Verificar si un usuario tiene acceso global (puede hacer todo)
         */
        UserRoleService_1.prototype.hasGlobalAccess = function (authorizationRole) {
            var hasAccess = authorizationRole === roles_enum_1.AuthorizationRole.SUPER_ADMIN ||
                authorizationRole === roles_enum_1.AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN ||
                authorizationRole === roles_enum_1.AuthorizationRole.ASSISTANT;
            this.logger.debug("AuthRole ".concat(authorizationRole, " tiene acceso global: ").concat(hasAccess));
            return hasAccess;
        };
        /**
         * Obtener información completa de roles de un usuario
         */
        UserRoleService_1.prototype.getUserRoleInfo = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var user, localRole, isAIA, error_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.findUnique({
                                    where: { idsysUser: userId },
                                    include: { role_sysUser_roleTorole: true },
                                })];
                        case 1:
                            user = _b.sent();
                            if (!user) {
                                return [2 /*return*/, {
                                        isAIA: false,
                                        canModifyAIA: false,
                                        hasGlobalAccess: false,
                                    }];
                            }
                            localRole = ((_a = user.role_sysUser_roleTorole) === null || _a === void 0 ? void 0 : _a.idrole) || user.role || 3;
                            isAIA = localRole === roles_enum_1.LocalRole.AIA;
                            // El authorizationRole debería venir del JWT, aquí no lo tenemos
                            // Este método es principalmente para verificar el rol local
                            return [2 /*return*/, {
                                    localRole: localRole,
                                    isAIA: isAIA,
                                    canModifyAIA: false, // Esto se determina con el authorizationRole del JWT
                                    hasGlobalAccess: false, // Esto se determina con el authorizationRole del JWT
                                }];
                        case 2:
                            error_1 = _b.sent();
                            this.logger.error("Error obteniendo informaci\u00F3n de roles para usuario ".concat(userId, ": ").concat(error_1.message));
                            return [2 /*return*/, {
                                    isAIA: false,
                                    canModifyAIA: false,
                                    hasGlobalAccess: false,
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Verificar permisos de modificación entre usuarios
         */
        UserRoleService_1.prototype.canUserModifyUser = function (currentUserId, targetUserId, currentAuthRole) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    try {
                        // Si es el mismo usuario, permitir auto-edición básica
                        if (currentUserId === targetUserId) {
                            return [2 /*return*/, true];
                        }
                        // Si tiene acceso global, puede modificar cualquiera
                        if (this.hasGlobalAccess(currentAuthRole)) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, true];
                    }
                    catch (error) {
                        this.logger.error("Error verificando permisos de modificaci\u00F3n entre usuarios ".concat(currentUserId, " -> ").concat(targetUserId, ": ").concat(error.message));
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * Logs para auditoría de acciones sensibles
         */
        UserRoleService_1.prototype.logSecurityAction = function (action, currentUserId, targetUserId, authRole, localRole, allowed) {
            this.logger.log("SECURITY: ".concat(action, " - Usuario: ").concat(currentUserId, " ") +
                "(AuthRole: ".concat(authRole, ", LocalRole: ").concat(localRole, ") ") +
                "".concat(targetUserId ? "-> Target: ".concat(targetUserId) : '', " ") +
                "Resultado: ".concat(allowed ? 'PERMITIDO' : 'DENEGADO'));
        };
        return UserRoleService_1;
    }());
    __setFunctionName(_classThis, "UserRoleService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserRoleService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserRoleService = _classThis;
}();
exports.UserRoleService = UserRoleService;
