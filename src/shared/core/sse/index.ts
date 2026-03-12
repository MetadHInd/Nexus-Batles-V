/**
 * SSE (Server-Sent Events) Module - Index
 * 
 * Exporta todos los componentes del sistema SSE para facilitar imports.
 */

// Module
export { SSEModule } from './sse.module';

// Services
export { SSEConnectionManagerService } from './services/sse-connection-manager.service';
export { SSEEventBridgeService } from './services/sse-event-bridge.service';
export { SSEMetricsService } from './services/sse-metrics.service';

// Controllers
export { BaseSSEController } from './controllers/base-sse.controller';
export { SSEMetricsController } from './controllers/sse-metrics.controller';
export { AuthSSEController } from './controllers/auth-sse.controller';

// Guards
export { SSEAuthGuard } from './guards/sse-auth.guard';
export { SSERateLimitGuard } from './guards/sse-rate-limit.guard';

// Decorators
export {
  SSESecure,
  SSEAuth,
  SSERateLimit,
} from './decorators/sse-security.decorator';

export {
  ManagerId,
  TenantId,
  SessionId,
  SSEUser,
  ClientMetadata,
} from './decorators/sse-params.decorator';

// Interfaces
export type {
  SSEClient,
  SSEClientMetadata,
  SSEConnectionOptions,
  SSEConnectionStats,
} from './interfaces/sse-client.interface';

export type {
  SSEEvent,
  SSEEventFormatter,
  SSESendOptions,
  SSESendResult,
} from './interfaces/sse-event.interface';

export type {
  SSEEventListener,
  SSEEventListenerRegistry,
  SSEEventBridgeConfig,
} from './interfaces/sse-event-listener.interface';
