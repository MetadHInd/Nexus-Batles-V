/**
 * EJEMPLO COMPLETO: Implementación de SSE para GALATEA
 * 
 * Este archivo muestra cómo integrar el sistema SSE con tu feature module.
 * Copia y adapta este patrón para tus propios casos de uso.
 */

// ═══════════════════════════════════════════════════════════════
// 1. CONTROLLER SSE
// ═══════════════════════════════════════════════════════════════

import { Controller, Sse, Req } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { BaseSSEController } from '@/shared/core/sse/controllers/base-sse.controller';
import { SSEConnectionManagerService } from '@/shared/core/sse/services/sse-connection-manager.service';
import { 
  SSESecure, 
  ManagerId, 
  TenantId, 
  SessionId 
} from '@/shared/core/sse/decorators';

@Controller('sse/galatea')
export class GalateaSSEController extends BaseSSEController {
  constructor(connectionManager: SSEConnectionManagerService) {
    super(connectionManager);
  }

  /**
   * Endpoint principal de SSE para GALATEA
   * 
   * URL: GET /sse/galatea/stream?token=JWT&managerId=mgr_123
   * 
   * El cliente se conecta una vez y recibe todos los eventos en tiempo real.
   */
  @Sse('stream')
  @SSESecure() // Aplica autenticación JWT + rate limiting
  streamGalateaEvents(
    @Req() req: Request,
    @ManagerId() managerId: string,
    @TenantId() tenantId: string,
    @SessionId() sessionId?: string,
  ): Observable<MessageEvent> {
    // Validar parámetros requeridos
    if (!managerId || !tenantId) {
      throw new Error('managerId and tenantId are required');
    }

    // Metadata adicional del cliente
    const metadata = {
      sessionId,
      connectedFrom: 'galatea',
      // Puedes agregar más metadata aquí
    };

    // Crear stream SSE
    return this.createSSEStream(req, managerId, tenantId, metadata);
  }

  /**
   * Endpoint alternativo sin autenticación (para testing/desarrollo)
   * ⚠️ DESACTIVAR EN PRODUCCIÓN
   */
  @Sse('stream/public')
  streamPublic(
    @Req() req: Request,
    @ManagerId() managerId: string,
  ): Observable<MessageEvent> {
    return this.createSSEStream(req, managerId, 'public-tenant');
  }
}

// ═══════════════════════════════════════════════════════════════
// 2. MODULE CONFIGURATION
// ═══════════════════════════════════════════════════════════════

import { Module, OnModuleInit } from '@nestjs/common';
import { SSEModule } from '@/shared/core/sse/sse.module';
import { SSEEventBridgeService } from '@/shared/core/sse/services/sse-event-bridge.service';

@Module({
  imports: [SSEModule],
  controllers: [GalateaSSEController],
  providers: [
    // Tus servicios aquí
  ],
})
export class GalateaModule implements OnModuleInit {
  constructor(private readonly eventBridge: SSEEventBridgeService) {}

  /**
   * Se ejecuta al inicializar el módulo
   * Aquí registramos los listeners de eventos
   */
  onModuleInit() {
    this.registerSSEEventListeners();
  }

  /**
   * Registra todos los listeners de eventos GALATEA
   */
  private registerSSEEventListeners(): void {
    this.eventBridge.registerEventListeners('GALATEA', [
      // ────────────────────────────────────────────────────────
      // GALATEA_PROGRESS: Progreso de procesamiento
      // ────────────────────────────────────────────────────────
      {
        eventName: 'GALATEA_PROGRESS',
        handler: (payload) => {
          // Validación opcional
          if (!payload.managerId) {
            console.warn('GALATEA_PROGRESS: Missing managerId');
            return;
          }

          // Enviar a todos los clientes del manager
          this.eventBridge.sendToManagerFromPayload(
            'GALATEA_PROGRESS',
            payload,
          );
        },
        options: {
          validator: (payload) => {
            // Validar estructura del payload
            return payload.managerId && payload.stage && payload.progress >= 0;
          },
        },
      },

      // ────────────────────────────────────────────────────────
      // GALATEA_RESPONSE: Respuesta final de GALATEA
      // ────────────────────────────────────────────────────────
      {
        eventName: 'GALATEA_RESPONSE',
        handler: (payload) => {
          this.eventBridge.sendToManagerFromPayload(
            'GALATEA_RESPONSE',
            payload,
          );
        },
      },

      // ────────────────────────────────────────────────────────
      // GALATEA_ERROR: Errores de procesamiento
      // ────────────────────────────────────────────────────────
      {
        eventName: 'GALATEA_ERROR',
        handler: (payload) => {
          this.eventBridge.sendToManagerFromPayload(
            'GALATEA_ERROR',
            payload,
          );
        },
      },

      // ────────────────────────────────────────────────────────
      // GALATEA_TOOL_EXECUTING: Una herramienta está ejecutándose
      // ────────────────────────────────────────────────────────
      {
        eventName: 'GALATEA_TOOL_EXECUTING',
        handler: (payload) => {
          this.eventBridge.sendToManagerFromPayload(
            'GALATEA_TOOL_EXECUTING',
            payload,
          );
        },
      },

      // ────────────────────────────────────────────────────────
      // GALATEA_TOOL_COMPLETED: Una herramienta completó
      // ────────────────────────────────────────────────────────
      {
        eventName: 'GALATEA_TOOL_COMPLETED',
        handler: (payload) => {
          this.eventBridge.sendToManagerFromPayload(
            'GALATEA_TOOL_COMPLETED',
            payload,
          );
        },
      },

      // Puedes agregar más eventos aquí fácilmente
    ]);

    console.log('✅ GALATEA SSE Event Listeners registered');
  }
}

// ═══════════════════════════════════════════════════════════════
// 3. SERVICE - EMITIENDO EVENTOS
// ═══════════════════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { EventBusService } from '@/shared/core/services/service-cache/event-bus.service';

@Injectable()
export class GalateaService {
  constructor(private readonly eventBus: EventBusService) {}

  /**
   * Ejemplo: Procesar una consulta y emitir eventos de progreso
   */
  async processQuery(managerId: string, query: string): Promise<string> {
    const sessionId = this.generateSessionId();

    try {
      // 1️⃣ Inicio: Emitir evento de progreso
      this.eventBus.emit('GALATEA_PROGRESS', {
        sessionId,
        managerId,
        stage: 'analyzing',
        message: '🤖 Analizando tu consulta...',
        progress: 10,
        timestamp: new Date().toISOString(),
      });

      // Simular análisis
      await this.delay(1000);

      // 2️⃣ Consultando datos
      this.eventBus.emit('GALATEA_PROGRESS', {
        sessionId,
        managerId,
        stage: 'querying',
        message: '📊 Consultando información...',
        progress: 40,
        timestamp: new Date().toISOString(),
      });

      // Simular consulta
      await this.delay(2000);

      // 3️⃣ Ejecutar herramienta
      this.eventBus.emit('GALATEA_TOOL_EXECUTING', {
        sessionId,
        managerId,
        toolName: 'search_database',
        toolDescription: 'Buscando en la base de datos',
        timestamp: new Date().toISOString(),
      });

      const toolResult = await this.executeTool('search_database', query);

      this.eventBus.emit('GALATEA_TOOL_COMPLETED', {
        sessionId,
        managerId,
        toolName: 'search_database',
        success: true,
        executionTime: 1500,
        timestamp: new Date().toISOString(),
      });

      // 4️⃣ Generar respuesta
      this.eventBus.emit('GALATEA_PROGRESS', {
        sessionId,
        managerId,
        stage: 'generating',
        message: '💡 Generando respuesta...',
        progress: 90,
        timestamp: new Date().toISOString(),
      });

      const response = await this.generateResponse(query, toolResult);

      // 5️⃣ Respuesta final
      this.eventBus.emit('GALATEA_RESPONSE', {
        sessionId,
        managerId,
        response,
        timestamp: new Date().toISOString(),
        metadata: {
          toolsUsed: ['search_database'],
          executionTime: 4500,
          tokensUsed: 150,
        },
      });

      return response;

    } catch (error) {
      // ❌ Error: Emitir evento de error
      this.eventBus.emit('GALATEA_ERROR', {
        sessionId,
        managerId,
        error: error.message,
        code: 'PROCESSING_ERROR',
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async executeTool(toolName: string, input: any): Promise<any> {
    // Implementación de tu herramienta
    return { result: 'data' };
  }

  private async generateResponse(query: string, toolResult: any): Promise<string> {
    // Generar respuesta con IA
    return 'Aquí está tu respuesta...';
  }
}

// ═══════════════════════════════════════════════════════════════
// 4. USAGE - CÓMO USAR DESDE UN CONTROLLER REST
// ═══════════════════════════════════════════════════════════════

import { Controller, Post, Body } from '@nestjs/common';

@Controller('api/galatea')
export class GalateaApiController {
  constructor(private readonly galateaService: GalateaService) {}

  /**
   * POST /api/galatea/query
   * 
   * El cliente hace un POST normal, y los eventos de progreso
   * se envían automáticamente por SSE.
   */
  @Post('query')
  async query(
    @Body() body: { managerId: string; query: string },
  ) {
    // Este método emitirá eventos que llegarán por SSE
    const response = await this.galateaService.processQuery(
      body.managerId,
      body.query,
    );

    return {
      success: true,
      response,
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// 5. TESTING
// ═══════════════════════════════════════════════════════════════

/**
 * Testing con curl
 * 
 * 1. Conectar SSE:
 * curl -N -H "Authorization: Bearer YOUR_JWT" \
 *   "http://localhost:3000/sse/galatea/stream?managerId=mgr_123"
 * 
 * 2. En otra terminal, enviar query:
 * curl -X POST http://localhost:3000/api/galatea/query \
 *   -H "Content-Type: application/json" \
 *   -d '{"managerId":"mgr_123","query":"¿Cuántos usuarios hay?"}'
 * 
 * 3. Verás los eventos SSE en la primera terminal:
 * event: GALATEA_PROGRESS
 * data: {"stage":"analyzing","progress":10,...}
 * 
 * event: GALATEA_PROGRESS
 * data: {"stage":"querying","progress":40,...}
 * 
 * event: GALATEA_RESPONSE
 * data: {"response":"Hay 1,234 usuarios",...}
 */

export const TESTING_NOTES = `
Para testing rápido:

1. Verificar que SSE está funcionando:
   GET http://localhost:3000/sse/health

2. Ver métricas:
   GET http://localhost:3000/sse/metrics

3. Ver conexiones activas:
   GET http://localhost:3000/sse/connections

4. Conectar con Postman:
   - Usar EventSource mode
   - GET /sse/galatea/stream?token=JWT&managerId=mgr_123

5. Testing de carga con k6:
   import http from 'k6/http';
   export default function () {
     http.get('http://localhost:3000/sse/galatea/stream?token=...');
   }
`;
