"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirePermissions = exports.PERMISSIONS_KEY = void 0;
// src/shared/core/auth/decorators/permissions.decorator.ts
var common_1 = require("@nestjs/common");
/**
 * Clave para metadata de permisos requeridos
 */
exports.PERMISSIONS_KEY = 'permissions';
/**
 * Decorador para especificar los permisos requeridos para acceder a un endpoint
 *
 * @example
 * ```typescript
 * @RequirePermissions('CREATE_ORDER', 'UPDATE_ORDER')
 * @UseGuards(JwtAuthGuard, PermissionsGuard)
 * async createOrder() { ... }
 * ```
 *
 * El usuario debe tener AL MENOS UNO de los permisos especificados (OR logic)
 * Para requerir TODOS los permisos, usa el guard múltiples veces o crea una lógica custom
 */
var RequirePermissions = function () {
    var permissions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        permissions[_i] = arguments[_i];
    }
    return (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, permissions);
};
exports.RequirePermissions = RequirePermissions;
