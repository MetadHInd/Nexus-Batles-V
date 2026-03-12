import { Injectable, Logger } from '@nestjs/common';
import { SSEConnectionManagerService } from './sse-connection-manager.service';
import { SSEEventBridgeService } from './sse-event-bridge.service';

/**
 * Servicio de métricas y monitoreo para SSE
 * 
 * Proporciona:
 * - Estadísticas de conexiones en tiempo real
 * - Métricas de rendimiento (throughput, latencia)
 * - Health checks
 * - Información del sistema
 */
@Injectable()
export class SSEMetricsService {
  private readonly logger = new Logger(SSEMetricsService.name);
  private readonly startTime = Date.now();

  constructor(
    private readonly connectionManager: SSEConnectionManagerService,
    private readonly eventBridge: SSEEventBridgeService,
  ) {}

  /**
   * Obtiene todas las métricas del sistema SSE
   */
  public getMetrics() {
    return {
      timestamp: new Date().toISOString(),
      uptime: this.getUptime(),
      connections: this.getConnectionMetrics(),
      events: this.getEventMetrics(),
      health: this.getHealthStatus(),
      system: this.getSystemMetrics(),
    };
  }

  /**
   * Métricas de conexiones
   */
  private getConnectionMetrics() {
    const stats = this.connectionManager.getStats();
    const managerMetrics = this.connectionManager.getMetrics();

    return {
      active: stats.totalConnections,
      managers: stats.totalManagers,
      tenants: stats.connectionsByTenant?.length || 0,
      byManager: stats.connectionsByManager.slice(0, 10), // Top 10
      byTenant: stats.connectionsByTenant?.slice(0, 10), // Top 10
      throughput: {
        eventsSent: managerMetrics.throughput.eventsSent,
        bytesSent: managerMetrics.throughput.bytesSent,
        eventsPerSecond: Math.round(managerMetrics.throughput.eventsPerSecond * 100) / 100,
        bytesPerSecond: Math.round(managerMetrics.throughput.bytesPerSecond * 100) / 100,
      },
    };
  }

  /**
   * Métricas de eventos del Event Bridge
   */
  private getEventMetrics() {
    const bridgeMetrics = this.eventBridge.getMetrics();

    return {
      processed: bridgeMetrics.eventsProcessed,
      byType: bridgeMetrics.eventsByType,
      activeGroups: bridgeMetrics.activeGroups,
      totalGroups: bridgeMetrics.totalGroups,
    };
  }

  /**
   * Estado de salud del sistema SSE
   */
  public getHealthStatus() {
    const stats = this.connectionManager.getStats();
    const uptime = Date.now() - this.startTime;
    const memory = process.memoryUsage();

    // Determinar status general
    let status: 'healthy' | 'warning' | 'critical' | 'idle' = 'idle';
    const issues: string[] = [];

    if (stats.totalConnections === 0) {
      status = 'idle';
    } else if (stats.totalConnections < 1000) {
      status = 'healthy';
    } else if (stats.totalConnections < 5000) {
      status = 'warning';
      issues.push('High connection count');
    } else {
      status = 'critical';
      issues.push('Very high connection count');
    }

    // Verificar uso de memoria
    const heapUsedMB = memory.heapUsed / 1024 / 1024;
    const heapTotalMB = memory.heapTotal / 1024 / 1024;
    const heapUsagePercent = (heapUsedMB / heapTotalMB) * 100;

    if (heapUsagePercent > 90) {
      status = 'critical';
      issues.push('Critical memory usage');
    } else if (heapUsagePercent > 75) {
      if (status !== 'critical') status = 'warning';
      issues.push('High memory usage');
    }

    return {
      status,
      issues: issues.length > 0 ? issues : undefined,
      checks: {
        connections: stats.totalConnections > 0 ? 'pass' : 'idle',
        memory: heapUsagePercent < 75 ? 'pass' : heapUsagePercent < 90 ? 'warn' : 'fail',
        uptime: uptime > 60000 ? 'pass' : 'starting', // Al menos 1 minuto
      },
    };
  }

  /**
   * Métricas del sistema (Node.js)
   */
  private getSystemMetrics() {
    const memory = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      memory: {
        heapUsed: this.formatBytes(memory.heapUsed),
        heapTotal: this.formatBytes(memory.heapTotal),
        heapUsedPercent: Math.round((memory.heapUsed / memory.heapTotal) * 100),
        external: this.formatBytes(memory.external),
        rss: this.formatBytes(memory.rss),
      },
      cpu: {
        user: Math.round(cpuUsage.user / 1000), // microsegundos -> ms
        system: Math.round(cpuUsage.system / 1000),
      },
      process: {
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    };
  }

  /**
   * Obtiene uptime del servicio SSE
   */
  private getUptime() {
    const uptimeMs = Date.now() - this.startTime;
    const uptimeSeconds = Math.floor(uptimeMs / 1000);

    return {
      milliseconds: uptimeMs,
      seconds: uptimeSeconds,
      formatted: this.formatUptime(uptimeMs),
    };
  }

  /**
   * Health check simple (para endpoints /health)
   */
  public healthCheck() {
    const health = this.getHealthStatus();

    return {
      status: health.status === 'healthy' || health.status === 'idle' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      details: health,
    };
  }

  /**
   * Readiness check (para Kubernetes/Docker)
   */
  public readinessCheck() {
    const health = this.getHealthStatus();
    const isReady = health.status !== 'critical';

    return {
      ready: isReady,
      timestamp: new Date().toISOString(),
      checks: health.checks,
    };
  }

  /**
   * Liveness check (para Kubernetes/Docker)
   */
  public livenessCheck() {
    const uptime = Date.now() - this.startTime;

    return {
      alive: true,
      uptime: uptime,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Estadísticas detalladas para dashboard
   */
  public getDashboardStats() {
    const metrics = this.getMetrics();

    return {
      ...metrics,
      summary: {
        activeConnections: metrics.connections.active,
        activeManagers: metrics.connections.managers,
        eventsPerSecond: metrics.connections.throughput.eventsPerSecond,
        healthStatus: metrics.health.status,
        uptime: metrics.uptime.formatted,
      },
      recommendations: this.getRecommendations(metrics),
    };
  }

  /**
   * Genera recomendaciones basadas en métricas
   */
  private getRecommendations(metrics: any): string[] {
    const recommendations: string[] = [];

    // Alto número de conexiones
    if (metrics.connections.active > 5000) {
      recommendations.push('Consider horizontal scaling (add more server instances)');
    }

    // Alto uso de memoria
    if (metrics.system.memory.heapUsedPercent > 75) {
      recommendations.push('Memory usage is high. Consider increasing Node.js heap size or optimizing memory usage');
    }

    // Baja tasa de eventos
    if (metrics.connections.active > 100 && metrics.connections.throughput.eventsPerSecond < 1) {
      recommendations.push('Low event throughput detected. Check if event bridge is properly configured');
    }

    // Muchos grupos de eventos inactivos
    const inactiveGroups = metrics.events.totalGroups - metrics.events.activeGroups.length;
    if (inactiveGroups > 0) {
      recommendations.push(`${inactiveGroups} event listener group(s) are disabled. Consider enabling or removing them`);
    }

    return recommendations;
  }

  // ═══════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Formatea bytes a string legible
   */
  private formatBytes(bytes: number): string {
    const mb = bytes / 1024 / 1024;
    if (mb < 1) return `${(bytes / 1024).toFixed(2)} KB`;
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    return `${(mb / 1024).toFixed(2)} GB`;
  }

  /**
   * Formatea uptime a string legible
   */
  private formatUptime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  /**
   * Exporta métricas en formato Prometheus
   * Útil para integración con sistemas de monitoreo
   */
  public exportPrometheusMetrics(): string {
    const metrics = this.getMetrics();
    const lines: string[] = [];

    // Conexiones
    lines.push(`# HELP sse_connections_active Number of active SSE connections`);
    lines.push(`# TYPE sse_connections_active gauge`);
    lines.push(`sse_connections_active ${metrics.connections.active}`);

    lines.push(`# HELP sse_managers_active Number of managers with active connections`);
    lines.push(`# TYPE sse_managers_active gauge`);
    lines.push(`sse_managers_active ${metrics.connections.managers}`);

    // Eventos
    lines.push(`# HELP sse_events_processed_total Total events processed`);
    lines.push(`# TYPE sse_events_processed_total counter`);
    lines.push(`sse_events_processed_total ${metrics.events.processed}`);

    lines.push(`# HELP sse_events_per_second Events per second`);
    lines.push(`# TYPE sse_events_per_second gauge`);
    lines.push(`sse_events_per_second ${metrics.connections.throughput.eventsPerSecond}`);

    // Memoria
    lines.push(`# HELP sse_memory_heap_used_bytes Heap memory used`);
    lines.push(`# TYPE sse_memory_heap_used_bytes gauge`);
    lines.push(`sse_memory_heap_used_bytes ${process.memoryUsage().heapUsed}`);

    return lines.join('\n');
  }
}
