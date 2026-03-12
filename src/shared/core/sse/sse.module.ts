import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SSEConnectionManagerService } from './services/sse-connection-manager.service';
import { SSEEventBridgeService } from './services/sse-event-bridge.service';
import { SSEMetricsService } from './services/sse-metrics.service';
import { SSEAuthGuard } from './guards/sse-auth.guard';
import { SSERateLimitGuard } from './guards/sse-rate-limit.guard';
import { SSEMetricsController } from './controllers/sse-metrics.controller';
import { TestSSEController } from './controllers/test-sse.controller';
import { AuthSSEController } from './controllers/auth-sse.controller';
import { EventBusService } from '../services/service-cache/event-bus.service';

/**
 * Módulo SSE (Server-Sent Events)
 * 
 * Proporciona infraestructura completa para comunicación unidireccional
 * en tiempo real del servidor hacia el cliente.
 * 
 * Características:
 * - Gestión de conexiones SSE
 * - Event Bridge para conectar EventBus con SSE
 * - Guards de seguridad (autenticación y rate limiting)
 * - Métricas y monitoreo
 * - Base extensible para implementar endpoints SSE específicos
 * 
 * Uso:
 * 1. Importar este módulo en tu feature module
 * 2. Extender BaseSSEController para crear tus endpoints SSE
 * 3. Registrar listeners de eventos en SSEEventBridgeService
 * 
 * @example
 * ```typescript
 * @Module({
 *   imports: [SSEModule],
 *   controllers: [MySSEController],
 * })
 * export class MyFeatureModule {}
 * ```
 */
@Global()
@Module({
  imports: [
    // JWT para autenticación de endpoints SSE
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '15m' }, // Tokens cortos para SSE
    }),
  ],
  providers: [
    // Core Services
    SSEConnectionManagerService,
    SSEEventBridgeService,
    SSEMetricsService,

    // Guards
    SSEAuthGuard,
    SSERateLimitGuard,

    // EventBus (singleton existente)
    {
      provide: EventBusService,
      useFactory: () => EventBusService.getInstance(),
    },
  ],
  controllers: [
    SSEMetricsController, // Endpoint de métricas
    TestSSEController, // ⚠️ Controller de prueba (remover en producción)
    AuthSSEController, // Controller autenticado para usuarios
  ],
  exports: [
    // Exportar para uso en otros módulos
    SSEConnectionManagerService,
    SSEEventBridgeService,
    SSEMetricsService,
    SSEAuthGuard,
    SSERateLimitGuard,
  ],
})
export class SSEModule {}
