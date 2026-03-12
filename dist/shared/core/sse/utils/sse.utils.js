"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSE_CONSTANTS = exports.SSELogger = void 0;
exports.generateSessionId = generateSessionId;
exports.generateClientId = generateClientId;
exports.validatePayload = validatePayload;
exports.sanitizePayload = sanitizePayload;
exports.truncatePayload = truncatePayload;
exports.delay = delay;
exports.withTimeout = withTimeout;
exports.retryWithBackoff = retryWithBackoff;
exports.formatBytes = formatBytes;
exports.formatDuration = formatDuration;
exports.calculateThroughput = calculateThroughput;
exports.isValidUUID = isValidUUID;
exports.isEmpty = isEmpty;
exports.isValidSSEEvent = isValidSSEEvent;
exports.createSSESnapshot = createSSESnapshot;
exports.prettyPrint = prettyPrint;
function generateSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `sess_${timestamp}_${random}`;
}
function generateClientId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `client_${timestamp}_${random}`;
}
function validatePayload(payload, requiredFields) {
    if (!payload || typeof payload !== 'object') {
        return false;
    }
    return requiredFields.every((field) => payload[field] !== undefined && payload[field] !== null);
}
function sanitizePayload(payload, sensitiveFields = ['password', 'token', 'secret', 'apiKey']) {
    const sanitized = { ...payload };
    sensitiveFields.forEach((field) => {
        if (field in sanitized) {
            delete sanitized[field];
        }
    });
    return sanitized;
}
function truncatePayload(payload, maxLength = 1000) {
    if (typeof payload === 'string') {
        return payload.length > maxLength
            ? payload.substring(0, maxLength) + '...[truncated]'
            : payload;
    }
    if (Array.isArray(payload)) {
        return payload.map((item) => truncatePayload(item, maxLength));
    }
    if (typeof payload === 'object' && payload !== null) {
        const truncated = {};
        Object.keys(payload).forEach((key) => {
            truncated[key] = truncatePayload(payload[key], maxLength);
        });
        return truncated;
    }
    return payload;
}
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function withTimeout(promise, timeoutMs, errorMessage = 'Operation timed out') {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
    });
    return Promise.race([promise, timeoutPromise]);
}
async function retryWithBackoff(fn, options = {}) {
    const { maxRetries = 3, initialDelayMs = 1000, maxDelayMs = 30000, backoffMultiplier = 2, } = options;
    let lastError;
    let delayMs = initialDelayMs;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (attempt === maxRetries) {
                throw lastError;
            }
            await delay(delayMs);
            delayMs = Math.min(delayMs * backoffMultiplier, maxDelayMs);
        }
    }
    throw lastError;
}
function formatBytes(bytes) {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0)
        return `${days}d ${hours % 24}h`;
    if (hours > 0)
        return `${hours}h ${minutes % 60}m`;
    if (minutes > 0)
        return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}
function calculateThroughput(eventCount, durationMs) {
    if (durationMs === 0)
        return 0;
    return (eventCount / (durationMs / 1000));
}
class SSELogger {
    context;
    constructor(context) {
        this.context = context;
    }
    info(message, ...args) {
        console.log(`[SSE:${this.context}] ℹ️  ${message}`, ...args);
    }
    success(message, ...args) {
        console.log(`[SSE:${this.context}] ✅ ${message}`, ...args);
    }
    warn(message, ...args) {
        console.warn(`[SSE:${this.context}] ⚠️  ${message}`, ...args);
    }
    error(message, error) {
        console.error(`[SSE:${this.context}] ❌ ${message}`, error);
    }
    debug(message, ...args) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(`[SSE:${this.context}] 🔍 ${message}`, ...args);
        }
    }
}
exports.SSELogger = SSELogger;
function isValidUUID(str) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}
function isEmpty(obj) {
    if (obj === null || obj === undefined)
        return true;
    if (typeof obj === 'object')
        return Object.keys(obj).length === 0;
    if (Array.isArray(obj))
        return obj.length === 0;
    return false;
}
function isValidSSEEvent(event) {
    return (event &&
        typeof event === 'object' &&
        typeof event.event === 'string' &&
        event.data !== undefined);
}
function createSSESnapshot(connectionManager) {
    return {
        timestamp: new Date().toISOString(),
        connections: {
            total: connectionManager.getAllConnections().length,
            stats: connectionManager.getStats(),
            metrics: connectionManager.getMetrics(),
        },
        memory: process.memoryUsage(),
        uptime: process.uptime(),
    };
}
function prettyPrint(obj, indent = 2) {
    return JSON.stringify(obj, null, indent);
}
exports.SSE_CONSTANTS = {
    DEFAULT_HEARTBEAT_INTERVAL: 30000,
    DEFAULT_CONNECTION_TIMEOUT: 300000,
    DEFAULT_RECONNECT_INTERVAL: 3000,
    MAX_PAYLOAD_SIZE: 65536,
    MAX_EVENT_NAME_LENGTH: 100,
    MAX_CONNECTIONS_PER_IP: 3,
    MAX_GLOBAL_CONNECTIONS: 10000,
    RATE_LIMIT_WINDOW_MS: 60000,
    RATE_LIMIT_MAX_ATTEMPTS: 5,
    SYSTEM_EVENTS: {
        CONNECTED: 'connected',
        DISCONNECTED: 'disconnected',
        HEARTBEAT: 'heartbeat',
        ERROR: 'error',
        RECONNECT: 'reconnect',
    },
    HEADERS: {
        CONTENT_TYPE: 'text/event-stream',
        CACHE_CONTROL: 'no-cache, no-transform',
        CONNECTION: 'keep-alive',
        X_ACCEL_BUFFERING: 'no',
    },
};
//# sourceMappingURL=sse.utils.js.map