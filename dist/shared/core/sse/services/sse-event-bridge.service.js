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
var SSEEventBridgeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEEventBridgeService = void 0;
const common_1 = require("@nestjs/common");
const event_bus_service_1 = require("../../services/service-cache/event-bus.service");
const sse_connection_manager_service_1 = require("./sse-connection-manager.service");
let SSEEventBridgeService = SSEEventBridgeService_1 = class SSEEventBridgeService {
    eventBus;
    connectionManager;
    logger = new common_1.Logger(SSEEventBridgeService_1.name);
    listenerRegistries = new Map();
    config = {
        enableLogging: true,
        logLevel: 'info',
        enableMetrics: true,
        eventPrefixes: [],
        ignoredEvents: [],
        maxListenersPerEvent: 10,
    };
    eventsProcessed = 0;
    eventsByType = new Map();
    constructor(eventBus, connectionManager) {
        this.eventBus = eventBus;
        this.connectionManager = connectionManager;
    }
    onModuleInit() {
        this.logger.log('🌉 Initializing SSE Event Bridge...');
        this.logger.log('✅ SSE Event Bridge ready');
        this.logger.log(`📋 Registered ${this.listenerRegistries.size} listener group(s)`);
    }
    onModuleDestroy() {
        this.logger.log('🛑 Shutting down SSE Event Bridge...');
        this.unregisterAllListeners();
    }
    updateConfig(config) {
        this.config = { ...this.config, ...config };
        this.logger.log('⚙️ Event Bridge configuration updated');
    }
    getConfig() {
        return { ...this.config };
    }
    registerEventListeners(groupName, listeners, enabled = true) {
        if (this.listenerRegistries.has(groupName)) {
            this.logger.warn(`Group "${groupName}" already registered, replacing...`);
            this.unregisterGroup(groupName);
        }
        const registry = {
            groupName,
            listeners,
            enabled,
        };
        if (enabled) {
            listeners.forEach((listener) => {
                this.registerListenerInternal(groupName, listener);
            });
        }
        this.listenerRegistries.set(groupName, registry);
        this.logger.log(`✅ Registered ${listeners.length} listener(s) for group "${groupName}"`);
    }
    registerListenerInternal(groupName, listener) {
        const { eventName, handler, options } = listener;
        if (this.config.ignoredEvents.includes(eventName)) {
            this.logger.debug(`Ignoring event "${eventName}" (in ignored list)`);
            return;
        }
        const wrappedHandler = async (payload) => {
            try {
                if (options?.validator) {
                    if (!options.validator(payload)) {
                        this.logger.warn(`Invalid payload for event "${eventName}", skipping SSE send`);
                        return;
                    }
                }
                await handler(payload);
                if (this.config.enableMetrics) {
                    this.eventsProcessed++;
                    this.eventsByType.set(eventName, (this.eventsByType.get(eventName) || 0) + 1);
                }
                if (this.config.enableLogging && this.config.logLevel === 'debug') {
                    this.logger.debug(`🔄 Event "${eventName}" processed by group "${groupName}"`);
                }
            }
            catch (error) {
                this.logger.error(`Error processing event "${eventName}" in group "${groupName}":`, error);
            }
        };
        this.eventBus.on(eventName, wrappedHandler);
        this.logger.debug(`📌 Listener registered: ${groupName}.${eventName}`);
    }
    registerListener(eventName, handler, options) {
        const listener = {
            eventName,
            handler,
            options,
        };
        this.registerListenerInternal('_adhoc', listener);
    }
    enableGroup(groupName) {
        const registry = this.listenerRegistries.get(groupName);
        if (!registry) {
            this.logger.warn(`Group "${groupName}" not found`);
            return;
        }
        if (registry.enabled) {
            this.logger.debug(`Group "${groupName}" already enabled`);
            return;
        }
        registry.listeners.forEach((listener) => {
            this.registerListenerInternal(groupName, listener);
        });
        registry.enabled = true;
        this.logger.log(`✅ Group "${groupName}" enabled`);
    }
    disableGroup(groupName) {
        const registry = this.listenerRegistries.get(groupName);
        if (!registry) {
            this.logger.warn(`Group "${groupName}" not found`);
            return;
        }
        if (!registry.enabled) {
            this.logger.debug(`Group "${groupName}" already disabled`);
            return;
        }
        registry.enabled = false;
        this.logger.log(`⏸️ Group "${groupName}" disabled`);
    }
    unregisterGroup(groupName) {
        const registry = this.listenerRegistries.get(groupName);
        if (!registry) {
            this.logger.warn(`Group "${groupName}" not found`);
            return;
        }
        registry.listeners.forEach((listener) => {
            this.eventBus.off(listener.eventName, listener.handler);
        });
        this.listenerRegistries.delete(groupName);
        this.logger.log(`🗑️ Group "${groupName}" unregistered`);
    }
    unregisterAllListeners() {
        const groups = Array.from(this.listenerRegistries.keys());
        groups.forEach((group) => this.unregisterGroup(group));
        this.logger.log(`Unregistered ${groups.length} group(s)`);
    }
    sendToManagerFromPayload(eventName, payload) {
        if (!payload.managerId) {
            this.logger.warn(`Payload missing managerId for event "${eventName}"`);
            return;
        }
        this.connectionManager.sendToManager(payload.managerId, eventName, payload);
    }
    sendToTenantFromPayload(eventName, payload) {
        if (!payload.tenantId) {
            this.logger.warn(`Payload missing tenantId for event "${eventName}"`);
            return;
        }
        this.connectionManager.sendToTenant(payload.tenantId, eventName, payload);
    }
    broadcastFromPayload(eventName, payload) {
        this.connectionManager.broadcast(eventName, payload);
    }
    listGroups() {
        return Array.from(this.listenerRegistries.keys());
    }
    getGroupInfo(groupName) {
        return this.listenerRegistries.get(groupName);
    }
    getMetrics() {
        return {
            eventsProcessed: this.eventsProcessed,
            eventsByType: Object.fromEntries(this.eventsByType),
            activeGroups: Array.from(this.listenerRegistries.values())
                .filter((r) => r.enabled)
                .map((r) => ({
                name: r.groupName,
                listeners: r.listeners.length,
            })),
            totalGroups: this.listenerRegistries.size,
        };
    }
    resetMetrics() {
        this.eventsProcessed = 0;
        this.eventsByType.clear();
        this.logger.log('📊 Bridge metrics reset');
    }
};
exports.SSEEventBridgeService = SSEEventBridgeService;
exports.SSEEventBridgeService = SSEEventBridgeService = SSEEventBridgeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_bus_service_1.EventBusService,
        sse_connection_manager_service_1.SSEConnectionManagerService])
], SSEEventBridgeService);
//# sourceMappingURL=sse-event-bridge.service.js.map