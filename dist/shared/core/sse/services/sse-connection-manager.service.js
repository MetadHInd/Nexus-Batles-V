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
var SSEConnectionManagerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEConnectionManagerService = void 0;
const common_1 = require("@nestjs/common");
let SSEConnectionManagerService = SSEConnectionManagerService_1 = class SSEConnectionManagerService {
    logger = new common_1.Logger(SSEConnectionManagerService_1.name);
    connections = new Map();
    managerConnections = new Map();
    tenantConnections = new Map();
    heartbeatInterval = null;
    config = {
        heartbeatInterval: 5000,
        connectionTimeout: 300000,
        maxRetries: 5,
        retryInterval: 3000,
        maxPayloadSize: 65536,
        enableCompression: false,
        singleSessionPerManager: true,
    };
    eventsSentCounter = 0;
    bytesSentCounter = 0;
    startTime = Date.now();
    constructor() {
        this.logger.log('🚀 SSE Connection Manager initialized');
        this.startHeartbeat();
    }
    updateConfig(config) {
        Object.assign(this.config, config);
        this.logger.log('⚙️ SSE configuration updated');
    }
    onModuleDestroy() {
        this.logger.log('🛑 Shutting down SSE Connection Manager...');
        this.stopHeartbeat();
        this.disconnectAll();
    }
    addConnection(client) {
        if (this.config.singleSessionPerManager) {
            this.disconnectPreviousSessions(client.managerId, client.id);
        }
        if (this.connections.has(client.id)) {
            this.logger.warn(`Client ${client.id} already connected, replacing...`);
            this.removeConnection(client.id);
        }
        this.connections.set(client.id, client);
        if (!this.managerConnections.has(client.managerId)) {
            this.managerConnections.set(client.managerId, new Set());
        }
        this.managerConnections.get(client.managerId).add(client.id);
        if (!this.tenantConnections.has(client.tenantId)) {
            this.tenantConnections.set(client.tenantId, new Set());
        }
        this.tenantConnections.get(client.tenantId).add(client.id);
        this.logger.log(`✅ SSE Connected: ${client.id} | Manager: ${client.managerId} | Tenant: ${client.tenantId}`);
        this.logger.debug(`Total connections: ${this.connections.size}`);
    }
    removeConnection(clientId, reason) {
        const client = this.connections.get(clientId);
        if (!client) {
            this.logger.debug(`Client ${clientId} not found for removal`);
            return;
        }
        this.managerConnections.get(client.managerId)?.delete(clientId);
        if (this.managerConnections.get(client.managerId)?.size === 0) {
            this.managerConnections.delete(client.managerId);
        }
        this.tenantConnections.get(client.tenantId)?.delete(clientId);
        if (this.tenantConnections.get(client.tenantId)?.size === 0) {
            this.tenantConnections.delete(client.tenantId);
        }
        this.connections.delete(clientId);
        try {
            if (client.response && !client.response.writableEnded) {
                client.response.end();
            }
        }
        catch (error) {
            this.logger.warn(`Error closing response for ${clientId}:`, error);
        }
        const logMessage = reason
            ? `❌ SSE Disconnected: ${clientId} (Reason: ${reason})`
            : `❌ SSE Disconnected: ${clientId}`;
        this.logger.log(logMessage);
        this.logger.debug(`Total connections: ${this.connections.size}`);
    }
    disconnectAll() {
        const clientIds = Array.from(this.connections.keys());
        clientIds.forEach((clientId) => this.removeConnection(clientId));
        this.logger.log(`Disconnected ${clientIds.length} client(s)`);
    }
    disconnectPreviousSessions(managerId, newClientId) {
        const existingClients = this.managerConnections.get(managerId);
        if (!existingClients || existingClients.size === 0) {
            return;
        }
        const clientsToDisconnect = Array.from(existingClients).filter((clientId) => clientId !== newClientId);
        if (clientsToDisconnect.length === 0) {
            return;
        }
        this.logger.warn(`🎮 Single Session Policy: Manager ${managerId} connecting from new device. Disconnecting ${clientsToDisconnect.length} previous session(s)...`);
        clientsToDisconnect.forEach((clientId) => {
            const client = this.connections.get(clientId);
            if (!client)
                return;
            try {
                const disconnectMessage = this.formatSSEMessage('session_terminated', {
                    reason: 'new_session_detected',
                    message: 'Tu sesión fue cerrada porque iniciaste sesión desde otro dispositivo',
                    timestamp: new Date().toISOString(),
                    reconnect: false,
                });
                if (client.response.writable) {
                    client.response.write(disconnectMessage);
                }
                setTimeout(() => {
                    this.removeConnection(clientId, 'New session from another device');
                }, 100);
            }
            catch (error) {
                this.logger.error(`Error notifying client ${clientId} of disconnection:`, error);
                this.removeConnection(clientId, 'New session from another device');
            }
        });
        this.logger.log(`✅ Previous sessions disconnected. New session established for manager ${managerId}`);
    }
    getClient(clientId) {
        return this.connections.get(clientId);
    }
    isConnected(clientId) {
        return this.connections.has(clientId);
    }
    getManagerConnections(managerId) {
        const clientIds = this.managerConnections.get(managerId);
        if (!clientIds)
            return [];
        return Array.from(clientIds)
            .map((id) => this.connections.get(id))
            .filter((client) => client !== undefined);
    }
    getTenantConnections(tenantId) {
        const clientIds = this.tenantConnections.get(tenantId);
        if (!clientIds)
            return [];
        return Array.from(clientIds)
            .map((id) => this.connections.get(id))
            .filter((client) => client !== undefined);
    }
    getAllConnections() {
        return Array.from(this.connections.values());
    }
    sendToClient(clientId, event, data, options) {
        const client = this.connections.get(clientId);
        if (!client) {
            this.logger.debug(`Client ${clientId} not found`);
            return false;
        }
        if (options?.filter && !options.filter(client)) {
            this.logger.debug(`Client ${clientId} filtered out`);
            return false;
        }
        if (options?.validate && !options.validate(data)) {
            this.logger.warn(`Invalid payload for client ${clientId}`);
            return false;
        }
        const transformedData = options?.transform ? options.transform(data) : data;
        try {
            if (client.metadata?.managedByObservable) {
                this.logger.debug(`Skipping direct write for ${clientId} (managed by Observable)`);
                return true;
            }
            if (!client.response.writable) {
                this.logger.warn(`Client ${clientId} stream not writable`);
                this.removeConnection(clientId);
                return false;
            }
            const formatted = this.formatSSEMessage(event, transformedData);
            if (formatted.length > this.config.maxPayloadSize) {
                this.logger.error(`Payload too large for ${clientId}: ${formatted.length} bytes`);
                return false;
            }
            const written = client.response.write(formatted);
            if (!written) {
                this.logger.warn(`Backpressure on client ${clientId}`);
            }
            this.eventsSentCounter++;
            this.bytesSentCounter += formatted.length;
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send to ${clientId}:`, error);
            this.removeConnection(clientId);
            return false;
        }
    }
    sendToManager(managerId, event, data, options) {
        const clients = this.getManagerConnections(managerId);
        if (clients.length === 0) {
            this.logger.debug(`No clients connected for manager ${managerId}`);
            return {
                successCount: 0,
                failureCount: 0,
                failedClientIds: [],
                timestamp: new Date(),
            };
        }
        return this.sendToMultiple(clients, event, data, options);
    }
    sendToTenant(tenantId, event, data, options) {
        const clients = this.getTenantConnections(tenantId);
        if (clients.length === 0) {
            this.logger.debug(`No clients connected for tenant ${tenantId}`);
            return {
                successCount: 0,
                failureCount: 0,
                failedClientIds: [],
                timestamp: new Date(),
            };
        }
        return this.sendToMultiple(clients, event, data, options);
    }
    broadcast(event, data, options) {
        const clients = this.getAllConnections();
        if (clients.length === 0) {
            this.logger.debug('No clients connected for broadcast');
            return {
                successCount: 0,
                failureCount: 0,
                failedClientIds: [],
                timestamp: new Date(),
            };
        }
        return this.sendToMultiple(clients, event, data, options);
    }
    sendToMultiple(clients, event, data, options) {
        let successCount = 0;
        const failedClientIds = [];
        clients.forEach((client) => {
            if (this.sendToClient(client.id, event, data, options)) {
                successCount++;
            }
            else {
                failedClientIds.push(client.id);
            }
        });
        const result = {
            successCount,
            failureCount: failedClientIds.length,
            failedClientIds,
            timestamp: new Date(),
        };
        if (failedClientIds.length > 0) {
            this.logger.warn(`Failed to send to ${failedClientIds.length}/${clients.length} clients`);
        }
        return result;
    }
    formatSSEMessage(event, data) {
        const id = Date.now().toString();
        const timestamp = new Date().toISOString();
        const payload = typeof data === 'object' && data !== null
            ? { ...data, timestamp }
            : { value: data, timestamp };
        return [
            `id: ${id}`,
            `event: ${event}`,
            `data: ${JSON.stringify(payload)}`,
            '\n',
        ].join('\n');
    }
    startHeartbeat() {
        if (this.heartbeatInterval) {
            this.logger.warn('Heartbeat already started');
            return;
        }
        this.heartbeatInterval = setInterval(() => {
            this.performHeartbeat();
        }, this.config.heartbeatInterval);
        this.logger.log(`💓 Heartbeat started (interval: ${this.config.heartbeatInterval}ms)`);
    }
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
            this.logger.log('💓 Heartbeat stopped');
        }
    }
    performHeartbeat() {
        const now = Date.now();
        let timedOutCount = 0;
        let heartbeatsSent = 0;
        this.connections.forEach((client, clientId) => {
            const timeSinceLastBeat = now - client.lastHeartbeat.getTime();
            if (timeSinceLastBeat > this.config.connectionTimeout) {
                this.logger.warn(`Client ${clientId} timed out (${timeSinceLastBeat}ms since last heartbeat)`);
                this.removeConnection(clientId);
                timedOutCount++;
                return;
            }
            const sent = this.sendToClient(clientId, 'heartbeat', {
                serverTime: now,
            });
            if (sent) {
                client.lastHeartbeat = new Date();
                heartbeatsSent++;
            }
        });
        if (this.connections.size > 0) {
            this.logger.debug(`💓 Heartbeat: ${heartbeatsSent} sent, ${timedOutCount} timed out`);
        }
    }
    getStats() {
        const connectionsByManager = Array.from(this.managerConnections.entries()).map(([managerId, clients]) => ({
            managerId,
            connections: clients.size,
        }));
        const connectionsByTenant = Array.from(this.tenantConnections.entries()).map(([tenantId, clients]) => ({
            tenantId,
            connections: clients.size,
        }));
        return {
            totalConnections: this.connections.size,
            totalManagers: this.managerConnections.size,
            connectionsByManager,
            connectionsByTenant,
            timestamp: new Date(),
        };
    }
    getMetrics() {
        const stats = this.getStats();
        const uptime = Date.now() - this.startTime;
        return {
            ...stats,
            uptime: {
                milliseconds: uptime,
                seconds: Math.floor(uptime / 1000),
                formatted: this.formatUptime(uptime),
            },
            throughput: {
                eventsSent: this.eventsSentCounter,
                bytesSent: this.bytesSentCounter,
                eventsPerSecond: this.eventsSentCounter / (uptime / 1000) || 0,
                bytesPerSecond: this.bytesSentCounter / (uptime / 1000) || 0,
            },
            config: this.config,
        };
    }
    formatUptime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0)
            return `${days}d ${hours % 24}h ${minutes % 60}m`;
        if (hours > 0)
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        if (minutes > 0)
            return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
    resetMetrics() {
        this.eventsSentCounter = 0;
        this.bytesSentCounter = 0;
        this.logger.log('📊 Metrics reset');
    }
    setSingleSessionMode(enabled) {
        this.config.singleSessionPerManager = enabled;
        this.logger.log(`🎮 Single Session Mode: ${enabled ? 'ENABLED' : 'DISABLED'}`);
    }
    isSingleSessionMode() {
        return this.config.singleSessionPerManager;
    }
    disconnectManager(managerId, reason = 'Forced disconnection') {
        const clients = this.getManagerConnections(managerId);
        if (clients.length === 0) {
            this.logger.debug(`No active sessions for manager ${managerId}`);
            return 0;
        }
        this.logger.warn(`🔴 Force disconnect: ${clients.length} session(s) for manager ${managerId}. Reason: ${reason}`);
        clients.forEach((client) => {
            try {
                const disconnectMessage = this.formatSSEMessage('session_terminated', {
                    reason: 'forced_disconnection',
                    message: reason,
                    timestamp: new Date().toISOString(),
                    reconnect: false,
                });
                if (client.response.writable) {
                    client.response.write(disconnectMessage);
                }
                setTimeout(() => {
                    this.removeConnection(client.id, reason);
                }, 100);
            }
            catch (error) {
                this.logger.error(`Error disconnecting client ${client.id}:`, error);
                this.removeConnection(client.id, reason);
            }
        });
        return clients.length;
    }
    getManagerSessionsInfo(managerId) {
        const clients = this.getManagerConnections(managerId);
        return clients.map((client) => ({
            clientId: client.id,
            connectedAt: client.connectedAt,
            lastHeartbeat: client.lastHeartbeat,
            metadata: client.metadata,
        }));
    }
};
exports.SSEConnectionManagerService = SSEConnectionManagerService;
exports.SSEConnectionManagerService = SSEConnectionManagerService = SSEConnectionManagerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SSEConnectionManagerService);
//# sourceMappingURL=sse-connection-manager.service.js.map