import { Controller, Get } from '@nestjs/common';
import { SSEMetricsService } from '../services/sse-metrics.service';
import { SSEConnectionManagerService } from '../services/sse-connection-manager.service';
import { SSEEventBridgeService } from '../services/sse-event-bridge.service';
import { SSERateLimitGuard } from '../guards/sse-rate-limit.guard';

/**
 * Controller de métricas y monitoreo SSE
 * 
 * Endpoints:
 * - GET /sse/metrics - Métricas completas del sistema
 * - GET /sse/health - Health check
 * - GET /sse/health/ready - Readiness probe (Kubernetes)
 * - GET /sse/health/live - Liveness probe (Kubernetes)
 * - GET /sse/stats - Estadísticas para dashboard
 * - GET /sse/connections - Lista de conexiones activas
 * - GET /sse/events - Estado del Event Bridge
 */
@Controller('sse')
export class SSEMetricsController {
  constructor(
    private readonly metricsService: SSEMetricsService,
    private readonly connectionManager: SSEConnectionManagerService,
    private readonly eventBridge: SSEEventBridgeService,
    private readonly rateLimitGuard: SSERateLimitGuard,
  ) {}

  /**
   * GET /sse/metrics
   * Obtiene todas las métricas del sistema SSE
   */
  @Get('metrics')
  getMetrics() {
    return this.metricsService.getMetrics();
  }

  /**
   * GET /sse/health
   * Health check general
   */
  @Get('health')
  healthCheck() {
    return this.metricsService.healthCheck();
  }

  /**
   * GET /sse/health/ready
   * Readiness probe para Kubernetes
   */
  @Get('health/ready')
  readinessCheck() {
    return this.metricsService.readinessCheck();
  }

  /**
   * GET /sse/health/live
   * Liveness probe para Kubernetes
   */
  @Get('health/live')
  livenessCheck() {
    return this.metricsService.livenessCheck();
  }

  /**
   * GET /sse/stats
   * Estadísticas detalladas para dashboard
   */
  @Get('stats')
  getDashboardStats() {
    return this.metricsService.getDashboardStats();
  }

  /**
   * GET /sse/connections
   * Lista de conexiones activas
   */
  @Get('connections')
  getConnections() {
    const stats = this.connectionManager.getStats();
    const allConnections = this.connectionManager.getAllConnections();

    return {
      summary: {
        total: stats.totalConnections,
        managers: stats.totalManagers,
        tenants: stats.connectionsByTenant?.length || 0,
      },
      connections: allConnections.map((client) => ({
        id: client.id,
        managerId: client.managerId,
        tenantId: client.tenantId,
        connectedAt: client.connectedAt,
        lastHeartbeat: client.lastHeartbeat,
        metadata: client.metadata,
      })),
      byManager: stats.connectionsByManager,
      byTenant: stats.connectionsByTenant,
    };
  }

  /**
   * GET /sse/events
   * Estado del Event Bridge
   */
  @Get('events')
  getEventBridgeInfo() {
    const metrics = this.eventBridge.getMetrics();
    const groups = this.eventBridge.listGroups();

    return {
      metrics,
      groups: groups.map((groupName) => ({
        name: groupName,
        info: this.eventBridge.getGroupInfo(groupName),
      })),
      config: this.eventBridge.getConfig(),
    };
  }

  /**
   * GET /sse/rate-limit
   * Estadísticas de rate limiting
   */
  @Get('rate-limit')
  getRateLimitStats() {
    return this.rateLimitGuard.getStats();
  }

  /**
   * GET /sse/metrics/prometheus
   * Métricas en formato Prometheus
   */
  @Get('metrics/prometheus')
  getPrometheusMetrics() {
    return this.metricsService.exportPrometheusMetrics();
  }
}
