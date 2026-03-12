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
exports.BranchAccessGuard = void 0;
var common_1 = require("@nestjs/common");
var branch_access_decorator_1 = require("../decorators/branch-access.decorator");
var BranchAccessGuard = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BranchAccessGuard = _classThis = /** @class */ (function () {
        function BranchAccessGuard_1(reflector) {
            this.reflector = reflector;
        }
        BranchAccessGuard_1.prototype.canActivate = function (context) {
            var config = this.reflector.getAllAndOverride(branch_access_decorator_1.BRANCH_ACCESS_KEY, [context.getHandler(), context.getClass()]);
            if (!config) {
                return true; // No hay restricción de branch
            }
            var request = context.switchToHttp().getRequest();
            var user = request.user;
            if (!(user === null || user === void 0 ? void 0 : user.profile)) {
                throw new common_1.ForbiddenException('Usuario no autenticado');
            }
            // Extraer branchId del request
            var branchId;
            if (config.paramName) {
                branchId = parseInt(request.params[config.paramName]);
            }
            else if (config.bodyField) {
                branchId = parseInt(request.body[config.bodyField]);
            }
            else {
                // Buscar en parámetros comunes
                branchId = parseInt(request.params.branchId ||
                    request.params.branch_id ||
                    request.body.branchId ||
                    request.body.branch_id);
            }
            if (isNaN(branchId)) {
                throw new common_1.BadRequestException('ID de sucursal inválido o faltante');
            }
            // Verificar acceso a la branch
            if (!user.profile.canAccessBranch(branchId)) {
                throw new common_1.ForbiddenException('No tiene acceso a esta sucursal');
            }
            // Verificar si requiere ser manager
            if (config.requireManager && !user.profile.canManageBranch(branchId)) {
                throw new common_1.ForbiddenException('Requiere permisos de administrador en esta sucursal');
            }
            // Agregar branchId al request para uso posterior
            request.currentBranchId = branchId;
            return true;
        };
        return BranchAccessGuard_1;
    }());
    __setFunctionName(_classThis, "BranchAccessGuard");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BranchAccessGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BranchAccessGuard = _classThis;
}();
exports.BranchAccessGuard = BranchAccessGuard;
