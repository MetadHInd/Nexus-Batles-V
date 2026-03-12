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
exports.SwaggerAuthMiddleware = void 0;
var common_1 = require("@nestjs/common");
var service_cache_1 = require("../core/services/service-cache/service-cache");
var roles_enum_1 = require("../core/auth/constants/roles.enum");
var SwaggerAuthMiddleware = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SwaggerAuthMiddleware = _classThis = /** @class */ (function () {
        function SwaggerAuthMiddleware_1() {
        }
        SwaggerAuthMiddleware_1.prototype.use = function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var token, payload, userId, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Permitir acceso a archivos estáticos de Swagger
                            if (req.path.includes('/swagger-ui') ||
                                req.path.includes('.css') ||
                                req.path.includes('.js')) {
                                return [2 /*return*/, next()];
                            }
                            if (!(req.path === '/api-docs' || req.path === '/api-docs/')) return [3 /*break*/, 4];
                            token = this.extractTokenFromRequest(req);
                            console.log("\uD83D\uDD0D Swagger Auth: Verificando token ", token);
                            if (!token) {
                                console.log("\uD83D\uDD12 Swagger Auth: Acceso denegado a ".concat(req.path, " - Token no encontrado"));
                                return [2 /*return*/, this.redirectToLogin(res)];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, service_cache_1.ServiceCache.Authorization.TokenService.validateToken(token)];
                        case 2:
                            payload = _a.sent();
                            console.log("\uD83D\uDD0D Swagger Auth: Token encontrado en ".concat(req.path, ":"), payload);
                            userId = payload.usersub || payload.sub;
                            if (!payload ||
                                !userId ||
                                (payload.role !== roles_enum_1.Role.ADMIN &&
                                    payload.role !== roles_enum_1.Role.ADMIN_AUTHORIZED_ORIGIN &&
                                    payload.role !== roles_enum_1.Role.SUPER_ADMIN)) {
                                console.log("\uD83D\uDD12 Swagger Auth: Token inv\u00E1lido o sin permisos de administrador para ".concat(req.path));
                                console.log("\uD83D\uDD12 Usuario: ".concat(userId || 'N/A', ", Rol: ").concat((payload === null || payload === void 0 ? void 0 : payload.role) || 'N/A'));
                                return [2 /*return*/, this.redirectToLogin(res)];
                            }
                            console.log("\u2705 Swagger Auth: Acceso autorizado a ".concat(req.path, " para admin ").concat(payload, " con rol ").concat(payload.role));
                            // Token válido y rol de administrador, permitir acceso
                            return [2 /*return*/, next()];
                        case 3:
                            error_1 = _a.sent();
                            console.log("\uD83D\uDD12 Swagger Auth: Token expirado/inv\u00E1lido para ".concat(req.path, ":"), error_1.message);
                            // Token inválido o expirado
                            return [2 /*return*/, this.redirectToLogin(res)];
                        case 4:
                            // Para otras rutas, continuar normalmente
                            next();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SwaggerAuthMiddleware_1.prototype.extractTokenFromRequest = function (req) {
            // Buscar token en diferentes lugares
            var _a, _b, _c;
            // 1. Header Authorization
            var authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                return authHeader.substring(7);
            }
            // 2. Cookie
            var cookieToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a['access_token']) ||
                ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b['token']) ||
                ((_c = req.cookies) === null || _c === void 0 ? void 0 : _c['authToken']);
            if (cookieToken) {
                console.log('Cookie token:', cookieToken);
                return cookieToken;
            }
            // 3. Query parameter (para casos especiales)
            var queryToken = req.query.token;
            if (queryToken) {
                return queryToken;
            }
            return null;
        };
        SwaggerAuthMiddleware_1.prototype.redirectToLogin = function (res) {
            // Redireccionar directamente a Login.html
            console.log('🔄 Swagger Auth: Redirigiendo a Login.html');
            res.redirect(302, '/Login.html');
        };
        return SwaggerAuthMiddleware_1;
    }());
    __setFunctionName(_classThis, "SwaggerAuthMiddleware");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SwaggerAuthMiddleware = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SwaggerAuthMiddleware = _classThis;
}();
exports.SwaggerAuthMiddleware = SwaggerAuthMiddleware;
