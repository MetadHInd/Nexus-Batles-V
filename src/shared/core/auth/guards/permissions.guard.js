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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
// src/shared/core/auth/guards/permissions.guard.ts
var common_1 = require("@nestjs/common");
var permissions_decorator_1 = require("../decorators/permissions.decorator");
/**
 * Guard para verificar permisos específicos desde el JWT
 * Debe usarse junto con JwtAuthGuard
 *
 * Valida que el usuario tenga al menos uno de los permisos requeridos
 * Los permisos se obtienen del JWT (campo 'permissions' o 'permissionsArray')
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, PermissionsGuard)
 * @RequirePermissions('CREATE_ORDER', 'UPDATE_ORDER')
 * async createOrder() { ... }
 * ```
 */
var PermissionsGuard = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PermissionsGuard = _classThis = /** @class */ (function () {
        function PermissionsGuard_1(reflector) {
            this.reflector = reflector;
            this.logger = new common_1.Logger(PermissionsGuard.name);
        }
        PermissionsGuard_1.prototype.canActivate = function (context) {
            var _this = this;
            // Obtener permisos requeridos desde el decorador
            var requiredPermissions = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
            // Si no hay permisos requeridos, permitir acceso
            if (!requiredPermissions || requiredPermissions.length === 0) {
                return true;
            }
            var request = context.switchToHttp().getRequest();
            var user = request.user;
            if (!user) {
                this.logger.warn('⚠️ Usuario no autenticado intentando acceder a ruta protegida');
                throw new common_1.ForbiddenException('Usuario no autenticado');
            }
            // 1️⃣ Super Admin bypass - acceso total sin verificar permisos
            if (this.isSuperAdmin(user)) {
                this.logger.debug("\u2705 Super Admin bypass: ".concat(user.email || user.username));
                return true;
            }
            // 2️⃣ Obtener permisos del usuario desde el JWT
            // Los permisos pueden estar en 'permissions' o 'permissionsArray'
            var userPermissions = [];
            // Debug: Ver qué tipo de dato tenemos
            this.logger.debug("\uD83D\uDD0D Tipo de permissions: ".concat(typeof user.permissions, ", ") +
                "es array: ".concat(Array.isArray(user.permissions), ", ") +
                "valor: ".concat(JSON.stringify(user.permissions)));
            if (Array.isArray(user.permissions)) {
                userPermissions = user.permissions;
            }
            else if (Array.isArray(user.permissionsArray)) {
                userPermissions = user.permissionsArray;
            }
            else {
                // Si existe pero no es array, intentar convertir
                var perms = user.permissions || user.permissionsArray;
                if (perms && typeof perms === 'object') {
                    // Podría ser un objeto, intentar obtener los valores
                    userPermissions = Object.values(perms).filter(function (v) { return typeof v === 'string'; });
                }
            }
            if (userPermissions.length === 0) {
                this.logger.warn("\u274C Usuario ".concat(user.email || user.username, " no tiene permisos en el JWT"));
                throw new common_1.ForbiddenException("Permisos insuficientes. Se requiere alguno de: ".concat(requiredPermissions.join(', ')));
            }
            // 3️⃣ Verificar wildcard - acceso total
            if (userPermissions.includes('*') || userPermissions.includes('WILDCARD')) {
                this.logger.debug("\u2705 Wildcard permission: ".concat(user.email || user.username));
                return true;
            }
            // 4️⃣ Verificar si el usuario tiene al menos uno de los permisos requeridos
            var hasPermission = requiredPermissions.some(function (requiredPermission) {
                // Verificación directa
                if (userPermissions.includes(requiredPermission)) {
                    return true;
                }
                // Verificación con wildcard a nivel de recurso
                // Ej: "ORDER:*" cubre "CREATE_ORDER", "UPDATE_ORDER", "DELETE_ORDER"
                var resourcePrefix = _this.extractResourcePrefix(requiredPermission);
                if (resourcePrefix && userPermissions.includes("".concat(resourcePrefix, ":*"))) {
                    return true;
                }
                return false;
            });
            if (!hasPermission) {
                this.logger.warn("\u274C Acceso denegado para ".concat(user.email || user.username, ". ") +
                    "Requiere: [".concat(requiredPermissions.join(', '), "], ") +
                    "Tiene: [".concat(userPermissions.join(', '), "]"));
                throw new common_1.ForbiddenException("Permisos insuficientes. Se requiere alguno de: ".concat(requiredPermissions.join(', ')));
            }
            this.logger.debug("\u2705 Acceso permitido para ".concat(user.email || user.username, " con permisos: [").concat(userPermissions.join(', '), "]"));
            return true;
        };
        /**
         * Verificar si el usuario es Super Admin
         */
        PermissionsGuard_1.prototype.isSuperAdmin = function (user) {
            var _a;
            // Verificar por rol de autorización (AuthorizationRole.SUPER_ADMIN = 5)
            if (user.authorizationRole === 5 || user.isSuperAdmin === true) {
                return true;
            }
            // Verificar por nombre de rol
            var roleNames = [
                user.authorizationRoleName,
                user.roleName,
                (_a = user.role) === null || _a === void 0 ? void 0 : _a.name,
            ].filter(Boolean);
            return roleNames.some(function (name) {
                return name === 'SUPER_ADMIN' ||
                    name === 'super_admin' ||
                    name === 'SuperAdmin';
            });
        };
        /**
         * Extraer prefijo de recurso de un código de permiso
         * Ej: "CREATE_ORDER" -> "ORDER"
         *     "UPDATE_USER_PROFILE" -> "USER_PROFILE"
         */
        PermissionsGuard_1.prototype.extractResourcePrefix = function (permission) {
            // Buscar patrones comunes: CREATE_, UPDATE_, DELETE_, VIEW_, READ_
            var match = permission.match(/^(CREATE|UPDATE|DELETE|VIEW|READ|MANAGE)_(.+)$/);
            if (match && match[2]) {
                return match[2]; // Retorna "ORDER", "USER_PROFILE", etc.
            }
            return null;
        };
        return PermissionsGuard_1;
    }());
    __setFunctionName(_classThis, "PermissionsGuard");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PermissionsGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PermissionsGuard = _classThis;
}();
exports.PermissionsGuard = PermissionsGuard;
