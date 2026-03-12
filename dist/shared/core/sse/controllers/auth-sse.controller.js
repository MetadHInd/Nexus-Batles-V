"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthSSEController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSSEController = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const swagger_1 = require("@nestjs/swagger");
const base_sse_controller_1 = require("./base-sse.controller");
const sse_connection_manager_service_1 = require("../services/sse-connection-manager.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let AuthSSEController = AuthSSEController_1 = class AuthSSEController extends base_sse_controller_1.BaseSSEController {
    logger = new common_1.Logger(AuthSSEController_1.name);
    constructor(connectionManager) {
        super(connectionManager);
    }
    streamAuthenticatedEvents(req) {
        const user = req.user;
        if (!user) {
            this.logger.error('❌ User not found in request after JwtAuthGuard');
            throw new Error('Authentication failed');
        }
        const managerId = user.id?.toString() || user.sub?.toString();
        const userEmail = user.email || 'unknown';
        this.logger.log(`🔐 Authenticated SSE Connection: userId=${managerId}, email=${userEmail}`);
        const metadata = {
            userId: managerId,
            email: userEmail,
            role: user.role || 'unknown',
            isAuthenticated: true,
            authenticatedAt: new Date().toISOString(),
        };
        return this.createSSEStream(req, managerId, 'app', metadata);
    }
};
exports.AuthSSEController = AuthSSEController;
__decorate([
    (0, common_1.Sse)('stream'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Conexión SSE autenticada para eventos en tiempo real',
        description: `
Establece una conexión SSE (Server-Sent Events) autenticada para recibir 
eventos en tiempo real del servidor.

**Cómo conectarse desde el frontend:**

\`\`\`javascript
// Opción 1: EventSource nativo (navegador)
const eventSource = new EventSource('/api/sse/auth/stream', {
  withCredentials: true  // Envía cookies automáticamente
});

eventSource.addEventListener('connected', (e) => {
  console.log('Conectado:', JSON.parse(e.data));
});

eventSource.addEventListener('heartbeat', (e) => {
  console.log('Heartbeat:', JSON.parse(e.data));
});

eventSource.addEventListener('notification', (e) => {
  const notification = JSON.parse(e.data);
  // Mostrar notificación al usuario
});

eventSource.onerror = (error) => {
  console.error('Error SSE:', error);
};
\`\`\`

**Eventos que recibirás:**
- \`connected\`: Confirmación de conexión establecida
- \`heartbeat\`: Pulso cada 5 segundos (mantiene conexión viva)
- \`notification\`: Notificaciones del sistema
- \`session_terminated\`: Tu sesión fue cerrada (otro login, cambio de contraseña, etc.)
- Eventos personalizados según tu aplicación

**Características:**
- ✅ Sesión única: Si inicias sesión desde otro dispositivo, esta conexión se cerrará
- ✅ Autenticación JWT: Token validado en cada conexión
- ✅ Reconexión automática: El navegador reconecta si se pierde la conexión
    `,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Conexión SSE establecida exitosamente',
        content: {
            'text/event-stream': {
                schema: {
                    type: 'string',
                    example: `event: connected
data: {"clientId":"abc123","message":"Connected successfully","timestamp":"2026-02-03T10:00:00Z"}

event: heartbeat
data: {"timestamp":"2026-02-03T10:00:05Z","message":"Heartbeat"}
`,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token JWT inválido o faltante',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], AuthSSEController.prototype, "streamAuthenticatedEvents", null);
exports.AuthSSEController = AuthSSEController = AuthSSEController_1 = __decorate([
    (0, swagger_1.ApiTags)('SSE - Authenticated'),
    (0, common_1.Controller)('sse/auth'),
    __metadata("design:paramtypes", [sse_connection_manager_service_1.SSEConnectionManagerService])
], AuthSSEController);
//# sourceMappingURL=auth-sse.controller.js.map