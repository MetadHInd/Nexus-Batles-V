export interface SSEEventListener {
    eventName: string;
    handler: (payload: any) => void | Promise<void>;
    options?: {
        once?: boolean;
        priority?: number;
        validator?: (payload: any) => boolean;
    };
}
export interface SSEEventListenerRegistry {
    groupName: string;
    listeners: SSEEventListener[];
    enabled: boolean;
}
export interface SSEEventBridgeConfig {
    enableLogging?: boolean;
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
    enableMetrics?: boolean;
    eventPrefixes?: string[];
    ignoredEvents?: string[];
    maxListenersPerEvent?: number;
}
