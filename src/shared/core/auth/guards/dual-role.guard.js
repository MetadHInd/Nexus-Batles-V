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
exports.DualRoleGuard = exports.PROTECT_AIA_KEY = exports.DUAL_ROLES_KEY = void 0;
var common_1 = require("@nestjs/common");
var roles_enum_1 = require("../constants/roles.enum");
exports.DUAL_ROLES_KEY = 'dualRoles';
exports.PROTECT_AIA_KEY = 'protectAIA';
var DualRoleGuard = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DualRoleGuard = _classThis = /** @class */ (function () {
        function DualRoleGuard_1(reflector, userRoleService) {
            this.reflector = reflector;
            this.userRoleService = userRoleService;
            this.logger = new common_1.Logger(DualRoleGuard.name);
        }
        DualRoleGuard_1.prototype.canActivate = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var dualRoleConfig, protectAIA, request, user, authorizationRole, localRole, isSuperAdmin, isGlobalAdmin, isAssistant, hasAuthRole, hasLocalRole;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            dualRoleConfig = this.reflector.getAllAndOverride(exports.DUAL_ROLES_KEY, [context.getHandler(), context.getClass()]);
                            protectAIA = this.reflector.getAllAndOverride(exports.PROTECT_AIA_KEY, [context.getHandler(), context.getClass()]);
                            // Si no hay configuración específica, permitir acceso
                            if (!dualRoleConfig && !protectAIA) {
                                return [2 /*return*/, true];
                            }
                            request = context.switchToHttp().getRequest();
                            user = request.user;
                            if (!user) {
                                this.logger.warn('Usuario no autenticado intentando acceder a recurso protegido');
                                throw new common_1.ForbiddenException('Usuario no autenticado');
                            }
                            authorizationRole = user.authorizationRole || user.role || user.roleId;
                            localRole = ((_b = (_a = user.profile) === null || _a === void 0 ? void 0 : _a.role) === null || _b === void 0 ? void 0 : _b.id) || user.localRole;
                            this.logger.debug("Usuario ".concat(user.userId, ": AuthRole=").concat(authorizationRole, ", LocalRole=").concat(localRole));
                            isSuperAdmin = authorizationRole === roles_enum_1.AuthorizationRole.SUPER_ADMIN;
                            isGlobalAdmin = authorizationRole === roles_enum_1.AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN;
                            isAssistant = authorizationRole === roles_enum_1.AuthorizationRole.ASSISTANT;
                            // Los SUPER_ADMIN, ciertos roles globales y ASSISTANT pueden hacer todo
                            if (isSuperAdmin || isGlobalAdmin || isAssistant) {
                                this.logger.debug("Usuario ".concat(user.userId, " tiene acceso global (AuthRole: ").concat(authorizationRole, ")"));
                                return [2 /*return*/, true];
                            }
                            // Si hay configuración de roles duales, verificar
                            if (dualRoleConfig) {
                                hasAuthRole = !dualRoleConfig.authorizationRoles ||
                                    dualRoleConfig.authorizationRoles.includes(authorizationRole);
                                hasLocalRole = !dualRoleConfig.localRoles ||
                                    dualRoleConfig.localRoles.includes(localRole);
                                if (!hasAuthRole || !hasLocalRole) {
                                    this.logger.warn("Usuario ".concat(user.userId, " sin permisos suficientes. ") +
                                        "Requiere AuthRoles: ".concat((_c = dualRoleConfig.authorizationRoles) === null || _c === void 0 ? void 0 : _c.join(', '), " ") +
                                        "y LocalRoles: ".concat((_d = dualRoleConfig.localRoles) === null || _d === void 0 ? void 0 : _d.join(', ')));
                                    throw new common_1.ForbiddenException('Permisos insuficientes');
                                }
                            }
                            if (!protectAIA) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.checkAIAProtection(context, user, authorizationRole, localRole)];
                        case 1: return [2 /*return*/, _e.sent()];
                        case 2: return [2 /*return*/, true];
                    }
                });
            });
        };
        DualRoleGuard_1.prototype.checkAIAProtection = function (context, user, authorizationRole, localRole) {
            return __awaiter(this, void 0, void 0, function () {
                var request, targetUserId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            request = context.switchToHttp().getRequest();
                            targetUserId = this.extractTargetUserId(request);
                            if (!targetUserId) {
                                // Si no hay usuario objetivo, permitir (para endpoints de listado general)
                                return [2 /*return*/, true];
                            }
                            return [4 /*yield*/, this.checkIfTargetIsAIAAndProtect(targetUserId, user.userId, authorizationRole, localRole)];
                        case 1: 
                        // Verificar si el usuario objetivo es AIA
                        return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        DualRoleGuard_1.prototype.extractTargetUserId = function (request) {
            var _a, _b, _c;
            // Buscar en parámetros de la URL
            var paramUserId = parseInt(request.params.userId || request.params.id || request.params.sysUserId);
            if (!isNaN(paramUserId)) {
                return paramUserId;
            }
            // Buscar en el body
            var bodyUserId = parseInt(((_a = request.body) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = request.body) === null || _b === void 0 ? void 0 : _b.id) || ((_c = request.body) === null || _c === void 0 ? void 0 : _c.sysUserId));
            if (!isNaN(bodyUserId)) {
                return bodyUserId;
            }
            return null;
        };
        DualRoleGuard_1.prototype.checkIfTargetIsAIAAndProtect = function (targetUserId, currentUserId, authorizationRole, localRole) {
            return __awaiter(this, void 0, void 0, function () {
                var canModify, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.userRoleService.canUserModifyUser(currentUserId, targetUserId, authorizationRole)];
                        case 1:
                            canModify = _a.sent();
                            // Log de auditoría
                            this.userRoleService.logSecurityAction('MODIFY_USER_ATTEMPT', currentUserId, targetUserId, authorizationRole, localRole, canModify);
                            if (!canModify) {
                                throw new common_1.ForbiddenException('No tiene permisos para modificar este usuario');
                            }
                            return [2 /*return*/, true];
                        case 2:
                            error_1 = _a.sent();
                            this.logger.error("Error verificando protecci\u00F3n AIA: ".concat(error_1.message));
                            if (error_1 instanceof common_1.ForbiddenException) {
                                throw error_1;
                            }
                            throw new common_1.ForbiddenException('Error verificando permisos');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return DualRoleGuard_1;
    }());
    __setFunctionName(_classThis, "DualRoleGuard");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DualRoleGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DualRoleGuard = _classThis;
}();
exports.DualRoleGuard = DualRoleGuard;
