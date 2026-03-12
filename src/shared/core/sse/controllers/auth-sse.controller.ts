import {
  Controller,
  Sse,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { BaseSSEController } from './base-sse.controller';
import { SSEConnectionManagerService } from '../services/sse-connection-manager.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

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
@ApiTags('SSE - Authenticated')
@Controller('sse/auth')
export class AuthSSEController extends BaseSSEController {
  protected readonly logger = new Logger(AuthSSEController.name);

  constructor(connectionManager: SSEConnectionManagerService) {
    super(connectionManager);
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
  @Sse('stream')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT inválido o faltante',
  })
  streamAuthenticatedEvents(@Req() req: Request): Observable<MessageEvent> {
    // Extraer información del usuario autenticado (inyectada por JwtAuthGuard)
    const user = (req as any).user;
    
    if (!user) {
      this.logger.error('❌ User not found in request after JwtAuthGuard');
      throw new Error('Authentication failed');
    }

    const managerId = user.id?.toString() || user.sub?.toString();
    const userEmail = user.email || 'unknown';

    this.logger.log(
      `🔐 Authenticated SSE Connection: userId=${managerId}, email=${userEmail}`,
    );

    // Metadata adicional del usuario autenticado
    const metadata = {
      userId: managerId,
      email: userEmail,
      role: user.role || 'unknown',
      isAuthenticated: true,
      authenticatedAt: new Date().toISOString(),
    };

    // Usar el método base para crear el stream
    return this.createSSEStream(
      req,
      managerId,
      'app', // tenantId por defecto
      metadata,
    );
  }
}
