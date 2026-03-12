import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventBusService } from '../../services/service-cache/event-bus.service';
import { SSEConnectionManagerService } from './sse-connection-manager.service';
import { SSEEventListener, SSEEventListenerRegistry, SSEEventBridgeConfig } from '../interfaces/sse-event-listener.interface';
export declare class SSEEventBridgeService implements OnModuleInit, OnModuleDestroy {
    private readonly eventBus;
    private readonly connectionManager;
    private readonly logger;
    private readonly listenerRegistries;
    private config;
    private eventsProcessed;
    private eventsByType;
    constructor(eventBus: EventBusService, connectionManager: SSEConnectionManagerService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    updateConfig(config: Partial<SSEEventBridgeConfig>): void;
    getConfig(): Required<SSEEventBridgeConfig>;
    registerEventListeners(groupName: string, listeners: SSEEventListener[], enabled?: boolean): void;
    private registerListenerInternal;
    registerListener(eventName: string, handler: (payload: any) => void | Promise<void>, options?: SSEEventListener['options']): void;
    enableGroup(groupName: string): void;
    disableGroup(groupName: string): void;
    unregisterGroup(groupName: string): void;
    private unregisterAllListeners;
    sendToManagerFromPayload(eventName: string, payload: any & {
        managerId: string;
    }): void;
    sendToTenantFromPayload(eventName: string, payload: any & {
        tenantId: string;
    }): void;
    broadcastFromPayload(eventName: string, payload: any): void;
    listGroups(): string[];
    getGroupInfo(groupName: string): SSEEventListenerRegistry | undefined;
    getMetrics(): {
        eventsProcessed: number;
        eventsByType: {
            [k: string]: number;
        };
        activeGroups: {
            name: string;
            listeners: number;
        }[];
        totalGroups: number;
    };
    resetMetrics(): void;
}
