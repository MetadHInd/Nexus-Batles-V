"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HierarchyValidator = void 0;
var common_1 = require("@nestjs/common");
var service_cache_1 = require("../core/services/service-cache/service-cache");
/**
 * Utilidad para validar jerarquías de roles
 *
 * Esta utilidad valida que un usuario tenga suficiente jerarquía para realizar
 * operaciones sobre otros usuarios o roles.
 */
var HierarchyValidator = /** @class */ (function () {
    function HierarchyValidator() {
    }
    /**
     * Valida que el usuario actual tenga mayor jerarquía que el rol objetivo
     *
     * @param currentUserRoleId - ID del rol del usuario que realiza la acción
     * @param targetRoleId - ID del rol objetivo sobre el que se quiere actuar
     * @param operationDescription - Descripción de la operación (para logs)
     * @throws ForbiddenException si no tiene suficiente jerarquía
     */
    HierarchyValidator.validateRoleHierarchy = function (currentUserRoleId_1, targetRoleId_1) {
        return __awaiter(this, arguments, void 0, function (currentUserRoleId, targetRoleId, operationDescription) {
            var currentHierarchy, targetHierarchy, targetRole;
            if (operationDescription === void 0) { operationDescription = 'esta operación'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRoleHierarchy(currentUserRoleId)];
                    case 1:
                        currentHierarchy = _a.sent();
                        return [4 /*yield*/, this.getRoleHierarchy(targetRoleId)];
                    case 2:
                        targetHierarchy = _a.sent();
                        if (currentHierarchy === null) {
                            this.logger.warn("\u26A0\uFE0F No se pudo determinar jerarqu\u00EDa del rol ".concat(currentUserRoleId));
                            throw new common_1.ForbiddenException('No se pudo determinar tu nivel de jerarquía');
                        }
                        if (targetHierarchy === null) {
                            this.logger.warn("\u26A0\uFE0F No se pudo determinar jerarqu\u00EDa del rol objetivo ".concat(targetRoleId));
                            throw new common_1.ForbiddenException('No se pudo determinar la jerarquía del rol objetivo');
                        }
                        if (!(currentHierarchy <= targetHierarchy)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getRoleDescription(targetRoleId)];
                    case 3:
                        targetRole = _a.sent();
                        this.logger.warn("\uD83D\uDEAB Usuario con rol ".concat(currentUserRoleId, " (jerarqu\u00EDa: ").concat(currentHierarchy, ") ") +
                            "intent\u00F3 realizar ".concat(operationDescription, " sobre rol '").concat(targetRole, "' (jerarqu\u00EDa: ").concat(targetHierarchy, ")"));
                        throw new common_1.ForbiddenException("No tienes suficiente jerarqu\u00EDa para realizar ".concat(operationDescription, ". ") +
                            "Tu nivel: ".concat(currentHierarchy, ", Nivel objetivo: ").concat(targetHierarchy, ". ") +
                            "Solo puedes actuar sobre roles con nivel menor a ".concat(currentHierarchy));
                    case 4:
                        this.logger.debug("\u2705 Usuario con rol ".concat(currentUserRoleId, " (jerarqu\u00EDa: ").concat(currentHierarchy, ") ") +
                            "autorizado para ".concat(operationDescription, " sobre rol ").concat(targetRoleId, " (jerarqu\u00EDa: ").concat(targetHierarchy, ")"));
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Valida que el usuario actual tenga mayor jerarquía que el usuario objetivo
     *
     * @param currentUserRoleId - ID del rol del usuario que realiza la acción
     * @param targetUserId - ID del usuario objetivo sobre el que se quiere actuar
     * @param operationDescription - Descripción de la operación (para logs)
     * @throws ForbiddenException si no tiene suficiente jerarquía
     */
    HierarchyValidator.validateUserHierarchy = function (currentUserRoleId_1, targetUserId_1) {
        return __awaiter(this, arguments, void 0, function (currentUserRoleId, targetUserId, operationDescription) {
            var targetUser;
            if (operationDescription === void 0) { operationDescription = 'esta operación'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.findUnique({
                            where: { idsysUser: targetUserId },
                            select: {
                                userName: true,
                                role: true,
                            },
                        })];
                    case 1:
                        targetUser = _a.sent();
                        if (!targetUser || !targetUser.role) {
                            this.logger.warn("\u26A0\uFE0F Usuario objetivo ".concat(targetUserId, " no encontrado o sin rol asignado"));
                            throw new common_1.ForbiddenException('Usuario objetivo no encontrado o sin rol asignado');
                        }
                        return [4 /*yield*/, this.validateRoleHierarchy(currentUserRoleId, targetUser.role, "".concat(operationDescription, " sobre el usuario ").concat(targetUser.userName || targetUserId))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Valida que el rol a crear/asignar no tenga mayor o igual jerarquía que el usuario actual
     *
     * @param currentUserRoleId - ID del rol del usuario que realiza la acción
     * @param roleToAssign - ID del rol que se quiere crear/asignar
     * @param operationDescription - Descripción de la operación (para logs)
     * @throws ForbiddenException si intenta crear/asignar un rol de mayor o igual jerarquía
     */
    HierarchyValidator.validateRoleCreationOrAssignment = function (currentUserRoleId_1, roleToAssign_1) {
        return __awaiter(this, arguments, void 0, function (currentUserRoleId, roleToAssign, operationDescription) {
            if (operationDescription === void 0) { operationDescription = 'crear/asignar este rol'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.validateRoleHierarchy(currentUserRoleId, roleToAssign, operationDescription)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtiene el nivel de jerarquía de un rol
     *
     * @param roleId - ID del rol
     * @returns Nivel de jerarquía o null si no se encuentra
     */
    HierarchyValidator.getRoleHierarchy = function (roleId) {
        return __awaiter(this, void 0, void 0, function () {
            var role, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findUnique({
                                where: { idrole: roleId },
                                select: { hierarchy_level: true },
                            })];
                    case 1:
                        role = _b.sent();
                        return [2 /*return*/, (_a = role === null || role === void 0 ? void 0 : role.hierarchy_level) !== null && _a !== void 0 ? _a : null];
                    case 2:
                        error_1 = _b.sent();
                        this.logger.error("\u274C Error al obtener jerarqu\u00EDa del rol ".concat(roleId, ":"), error_1);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtiene la descripción de un rol
     *
     * @param roleId - ID del rol
     * @returns Descripción del rol o 'Desconocido'
     */
    HierarchyValidator.getRoleDescription = function (roleId) {
        return __awaiter(this, void 0, void 0, function () {
            var role, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.role.findUnique({
                                where: { idrole: roleId },
                                select: { description: true },
                            })];
                    case 1:
                        role = _a.sent();
                        return [2 /*return*/, (role === null || role === void 0 ? void 0 : role.description) || 'Desconocido'];
                    case 2:
                        error_2 = _a.sent();
                        this.logger.error("\u274C Error al obtener descripci\u00F3n del rol ".concat(roleId, ":"), error_2);
                        return [2 /*return*/, 'Desconocido'];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    HierarchyValidator.logger = new common_1.Logger(HierarchyValidator.name);
    return HierarchyValidator;
}());
exports.HierarchyValidator = HierarchyValidator;
