"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireBranchManager = exports.RequireBranchAccess = exports.BRANCH_ACCESS_KEY = void 0;
var common_1 = require("@nestjs/common");
exports.BRANCH_ACCESS_KEY = 'branchAccess';
/**
 * Decorador para controlar acceso a branches específicas
 * @param config Configuración del acceso a branch
 *
 * @example
 * // Requiere acceso a la branch (parámetro branchId)
 * @RequireBranchAccess()
 *
 * // Requiere ser manager de la branch
 * @RequireBranchAccess({ requireManager: true })
 *
 * // Usar parámetro personalizado
 * @RequireBranchAccess({ paramName: 'id' })
 *
 * // Usar campo del body
 * @RequireBranchAccess({ bodyField: 'branch_id' })
 */
var RequireBranchAccess = function (config) {
    if (config === void 0) { config = {}; }
    return (0, common_1.SetMetadata)(exports.BRANCH_ACCESS_KEY, config);
};
exports.RequireBranchAccess = RequireBranchAccess;
/**
 * Decorador específico para managers
 */
var RequireBranchManager = function (paramName) {
    return (0, exports.RequireBranchAccess)({ requireManager: true, paramName: paramName });
};
exports.RequireBranchManager = RequireBranchManager;
