"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSSEController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var base_sse_controller_1 = require("./base-sse.controller");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
/**
 * Controller SSE para usuarios autenticados
 *
 * Este controller maneja las conexiones SSE de usuarios que han
 * iniciado sesión. Requiere JWT válido en el header Authorization.
 *
 * El frontend debe conectarse automáticamente después del login usando:
 *
 * ```typescript
 * const eventSource = new EventSource(
 *   `${API_URL}/sse/auth/stream`,
 *   {
 *     headers: {
 *       'Authorization': `Bearer ${token}`
 *     }
 *   }
 * );
 * ```
 *
 * Endpoints:
 * - GET /sse/auth/stream - Conexión SSE autenticada
 */
var AuthSSEController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('SSE - Authenticated'), (0, common_1.Controller)('sse/auth')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_sse_controller_1.BaseSSEController;
    var _instanceExtraInitializers = [];
    var _streamAuthenticatedEvents_decorators;
    var AuthSSEController = _classThis = /** @class */ (function (_super) {
        __extends(AuthSSEController_1, _super);
        function AuthSSEController_1(connectionManager) {
            var _this = _super.call(this, connectionManager) || this;
            _this.logger = (__runInitializers(_this, _instanceExtraInitializers), new common_1.Logger(AuthSSEController.name));
            return _this;
        }
        /**
         * Stream SSE autenticado
         * GET /sse/auth/stream
         *
         * Requiere: JWT token válido en Authorization header
         *
         * El usuario se conecta automáticamente después del login.
         * La conexión se mantiene abierta y recibe:
         * - Evento 'connected' al conectarse
         * - Eventos 'heartbeat' cada 5 segundos
         * - Eventos personalizados del sistema
         * - Notificaciones en tiempo real
         */
        AuthSSEController_1.prototype.streamAuthenticatedEvents = function (req) {
            var _a, _b;
            // Extraer información del usuario autenticado (inyectada por JwtAuthGuard)
            var user = req.user;
            if (!user) {
                this.logger.error('❌ User not found in request after JwtAuthGuard');
                throw new Error('Authentication failed');
            }
            var managerId = ((_a = user.id) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = user.sub) === null || _b === void 0 ? void 0 : _b.toString());
            var userEmail = user.email || 'unknown';
            this.logger.log("\uD83D\uDD10 Authenticated SSE Connection: userId=".concat(managerId, ", email=").concat(userEmail));
            // Metadata adicional del usuario autenticado
            var metadata = {
                userId: managerId,
                email: userEmail,
                role: user.role || 'unknown',
                isAuthenticated: true,
                authenticatedAt: new Date().toISOString(),
            };
            // Usar el método base para crear el stream
            return this.createSSEStream(req, managerId, 'app', // tenantId por defecto
            metadata);
        };
        return AuthSSEController_1;
    }(_classSuper));
    __setFunctionName(_classThis, "AuthSSEController");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _streamAuthenticatedEvents_decorators = [(0, common_1.Sse)('stream'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({
                summary: 'Conexión SSE autenticada para eventos en tiempo real',
                description: "\nEstablece una conexi\u00F3n SSE (Server-Sent Events) autenticada para recibir \neventos en tiempo real del servidor.\n\n**C\u00F3mo conectarse desde el frontend:**\n\n```javascript\n// Opci\u00F3n 1: EventSource nativo (navegador)\nconst eventSource = new EventSource('/api/sse/auth/stream', {\n  withCredentials: true  // Env\u00EDa cookies autom\u00E1ticamente\n});\n\neventSource.addEventListener('connected', (e) => {\n  console.log('Conectado:', JSON.parse(e.data));\n});\n\neventSource.addEventListener('heartbeat', (e) => {\n  console.log('Heartbeat:', JSON.parse(e.data));\n});\n\neventSource.addEventListener('notification', (e) => {\n  const notification = JSON.parse(e.data);\n  // Mostrar notificaci\u00F3n al usuario\n});\n\neventSource.onerror = (error) => {\n  console.error('Error SSE:', error);\n};\n```\n\n**Eventos que recibir\u00E1s:**\n- `connected`: Confirmaci\u00F3n de conexi\u00F3n establecida\n- `heartbeat`: Pulso cada 5 segundos (mantiene conexi\u00F3n viva)\n- `notification`: Notificaciones del sistema\n- `session_terminated`: Tu sesi\u00F3n fue cerrada (otro login, cambio de contrase\u00F1a, etc.)\n- Eventos personalizados seg\u00FAn tu aplicaci\u00F3n\n\n**Caracter\u00EDsticas:**\n- \u2705 Sesi\u00F3n \u00FAnica: Si inicias sesi\u00F3n desde otro dispositivo, esta conexi\u00F3n se cerrar\u00E1\n- \u2705 Autenticaci\u00F3n JWT: Token validado en cada conexi\u00F3n\n- \u2705 Reconexi\u00F3n autom\u00E1tica: El navegador reconecta si se pierde la conexi\u00F3n\n    ",
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Conexión SSE establecida exitosamente',
                content: {
                    'text/event-stream': {
                        schema: {
                            type: 'string',
                            example: "event: connected\ndata: {\"clientId\":\"abc123\",\"message\":\"Connected successfully\",\"timestamp\":\"2026-02-03T10:00:00Z\"}\n\nevent: heartbeat\ndata: {\"timestamp\":\"2026-02-03T10:00:05Z\",\"message\":\"Heartbeat\"}\n",
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'No autorizado - Token JWT inválido o faltante',
            })];
        __esDecorate(_classThis, null, _streamAuthenticatedEvents_decorators, { kind: "method", name: "streamAuthenticatedEvents", static: false, private: false, access: { has: function (obj) { return "streamAuthenticatedEvents" in obj; }, get: function (obj) { return obj.streamAuthenticatedEvents; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthSSEController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthSSEController = _classThis;
}();
exports.AuthSSEController = AuthSSEController;
