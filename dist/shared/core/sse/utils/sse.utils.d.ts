export declare function generateSessionId(): string;
export declare function generateClientId(): string;
export declare function validatePayload<T extends Record<string, any>>(payload: any, requiredFields: (keyof T)[]): payload is T;
export declare function sanitizePayload<T extends Record<string, any>>(payload: T, sensitiveFields?: string[]): Partial<T>;
export declare function truncatePayload(payload: any, maxLength?: number): any;
export declare function delay(ms: number): Promise<void>;
export declare function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage?: string): Promise<T>;
export declare function retryWithBackoff<T>(fn: () => Promise<T>, options?: {
    maxRetries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    backoffMultiplier?: number;
}): Promise<T>;
export declare function formatBytes(bytes: number): string;
export declare function formatDuration(ms: number): string;
export declare function calculateThroughput(eventCount: number, durationMs: number): number;
export declare class SSELogger {
    private context;
    constructor(context: string);
    info(message: string, ...args: any[]): void;
    success(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, error?: Error | any): void;
    debug(message: string, ...args: any[]): void;
}
export declare function isValidUUID(str: string): boolean;
export declare function isEmpty(obj: any): boolean;
export declare function isValidSSEEvent(event: any): boolean;
export declare function createSSESnapshot(connectionManager: any): object;
export declare function prettyPrint(obj: any, indent?: number): string;
export declare const SSE_CONSTANTS: {
    readonly DEFAULT_HEARTBEAT_INTERVAL: 30000;
    readonly DEFAULT_CONNECTION_TIMEOUT: 300000;
    readonly DEFAULT_RECONNECT_INTERVAL: 3000;
    readonly MAX_PAYLOAD_SIZE: 65536;
    readonly MAX_EVENT_NAME_LENGTH: 100;
    readonly MAX_CONNECTIONS_PER_IP: 3;
    readonly MAX_GLOBAL_CONNECTIONS: 10000;
    readonly RATE_LIMIT_WINDOW_MS: 60000;
    readonly RATE_LIMIT_MAX_ATTEMPTS: 5;
    readonly SYSTEM_EVENTS: {
        readonly CONNECTED: "connected";
        readonly DISCONNECTED: "disconnected";
        readonly HEARTBEAT: "heartbeat";
        readonly ERROR: "error";
        readonly RECONNECT: "reconnect";
    };
    readonly HEADERS: {
        readonly CONTENT_TYPE: "text/event-stream";
        readonly CACHE_CONTROL: "no-cache, no-transform";
        readonly CONNECTION: "keep-alive";
        readonly X_ACCEL_BUFFERING: "no";
    };
};
export type SSEEventCallback = (eventType: string, data: any) => void;
export type SSEConnectionConfig = {
    url: string;
    token?: string;
    managerId?: string;
    tenantId?: string;
    reconnect?: boolean;
    maxReconnectAttempts?: number;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: Error) => void;
    onMessage?: SSEEventCallback;
};
export type SSEConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';
