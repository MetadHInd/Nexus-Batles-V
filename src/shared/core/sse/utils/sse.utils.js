"use strict";
/**
 * Utilidades y Helpers para SSE
 *
 * Funciones útiles que puedes usar en tu implementación
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
// ═══════════════════════════════════════════════════════════════
// GENERADORES DE IDs
// ═══════════════════════════════════════════════════════════════
/**
 * Genera un ID único para sesiones SSE
 */
function generateSessionId() {
    var timestamp = Date.now();
    var random = Math.random().toString(36).substring(2, 11);
    return "sess_".concat(timestamp, "_").concat(random);
}
/**
 * Genera un ID único para clientes SSE
 */
function generateClientId() {
    var timestamp = Date.now();
    var random = Math.random().toString(36).substring(2, 11);
    return "client_".concat(timestamp, "_").concat(random);
}
// ═══════════════════════════════════════════════════════════════
// VALIDADORES DE PAYLOADS
// ═══════════════════════════════════════════════════════════════
/**
 * Valida que un payload tenga los campos requeridos
 */
function validatePayload(payload, requiredFields) {
    if (!payload || typeof payload !== 'object') {
        return false;
    }
    return requiredFields.every(function (field) { return payload[field] !== undefined && payload[field] !== null; });
}
/**
 * Ejemplo de uso:
 *
 * const isValid = validatePayload(payload, ['managerId', 'sessionId']);
 * if (!isValid) {
 *   throw new Error('Invalid payload');
 * }
 */
// ═══════════════════════════════════════════════════════════════
// TRANSFORMADORES DE DATOS
// ═══════════════════════════════════════════════════════════════
/**
 * Sanitiza un objeto removiendo campos sensibles
 */
function sanitizePayload(payload, sensitiveFields) {
    if (sensitiveFields === void 0) { sensitiveFields = ['password', 'token', 'secret', 'apiKey']; }
    var sanitized = __assign({}, payload);
    sensitiveFields.forEach(function (field) {
        if (field in sanitized) {
            delete sanitized[field];
        }
    });
    return sanitized;
}
/**
 * Trunca strings largos en un payload
 */
function truncatePayload(payload, maxLength) {
    if (maxLength === void 0) { maxLength = 1000; }
    if (typeof payload === 'string') {
        return payload.length > maxLength
            ? payload.substring(0, maxLength) + '...[truncated]'
            : payload;
    }
    if (Array.isArray(payload)) {
        return payload.map(function (item) { return truncatePayload(item, maxLength); });
    }
    if (typeof payload === 'object' && payload !== null) {
        var truncated_1 = {};
        Object.keys(payload).forEach(function (key) {
            truncated_1[key] = truncatePayload(payload[key], maxLength);
        });
        return truncated_1;
    }
    return payload;
}
// ═══════════════════════════════════════════════════════════════
// HELPERS DE TIMING
// ═══════════════════════════════════════════════════════════════
/**
 * Crea un delay con Promise
 */
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
/**
 * Ejecuta una función con timeout
 */
function withTimeout(promise_1, timeoutMs_1) {
    return __awaiter(this, arguments, void 0, function (promise, timeoutMs, errorMessage) {
        var timeoutPromise;
        if (errorMessage === void 0) { errorMessage = 'Operation timed out'; }
        return __generator(this, function (_a) {
            timeoutPromise = new Promise(function (_, reject) {
                setTimeout(function () { return reject(new Error(errorMessage)); }, timeoutMs);
            });
            return [2 /*return*/, Promise.race([promise, timeoutPromise])];
        });
    });
}
/**
 * Retry con backoff exponencial
 */
function retryWithBackoff(fn_1) {
    return __awaiter(this, arguments, void 0, function (fn, options) {
        var _a, maxRetries, _b, initialDelayMs, _c, maxDelayMs, _d, backoffMultiplier, lastError, delayMs, attempt, error_1;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = options.maxRetries, maxRetries = _a === void 0 ? 3 : _a, _b = options.initialDelayMs, initialDelayMs = _b === void 0 ? 1000 : _b, _c = options.maxDelayMs, maxDelayMs = _c === void 0 ? 30000 : _c, _d = options.backoffMultiplier, backoffMultiplier = _d === void 0 ? 2 : _d;
                    delayMs = initialDelayMs;
                    attempt = 0;
                    _e.label = 1;
                case 1:
                    if (!(attempt <= maxRetries)) return [3 /*break*/, 7];
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, fn()];
                case 3: return [2 /*return*/, _e.sent()];
                case 4:
                    error_1 = _e.sent();
                    lastError = error_1 instanceof Error ? error_1 : new Error(String(error_1));
                    if (attempt === maxRetries) {
                        throw lastError;
                    }
                    return [4 /*yield*/, delay(delayMs)];
                case 5:
                    _e.sent();
                    delayMs = Math.min(delayMs * backoffMultiplier, maxDelayMs);
                    return [3 /*break*/, 6];
                case 6:
                    attempt++;
                    return [3 /*break*/, 1];
                case 7: throw lastError;
            }
        });
    });
}
// ═══════════════════════════════════════════════════════════════
// HELPERS DE MÉTRICAS
// ═══════════════════════════════════════════════════════════════
/**
 * Formatea bytes a string legible
 */
function formatBytes(bytes) {
    if (bytes === 0)
        return '0 B';
    var k = 1024;
    var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return "".concat((bytes / Math.pow(k, i)).toFixed(2), " ").concat(sizes[i]);
}
/**
 * Formatea duración en ms a string legible
 */
function formatDuration(ms) {
    var seconds = Math.floor(ms / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    if (days > 0)
        return "".concat(days, "d ").concat(hours % 24, "h");
    if (hours > 0)
        return "".concat(hours, "h ").concat(minutes % 60, "m");
    if (minutes > 0)
        return "".concat(minutes, "m ").concat(seconds % 60, "s");
    return "".concat(seconds, "s");
}
/**
 * Calcula throughput (eventos/segundo)
 */
function calculateThroughput(eventCount, durationMs) {
    if (durationMs === 0)
        return 0;
    return (eventCount / (durationMs / 1000));
}
// ═══════════════════════════════════════════════════════════════
// HELPERS DE LOGGING
// ═══════════════════════════════════════════════════════════════
/**
 * Logger personalizado para SSE con colores
 */
var SSELogger = /** @class */ (function () {
    function SSELogger(context) {
        this.context = context;
    }
    SSELogger.prototype.info = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spreadArray(["[SSE:".concat(this.context, "] \u2139\uFE0F  ").concat(message)], args, false));
    };
    SSELogger.prototype.success = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spreadArray(["[SSE:".concat(this.context, "] \u2705 ").concat(message)], args, false));
    };
    SSELogger.prototype.warn = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.warn.apply(console, __spreadArray(["[SSE:".concat(this.context, "] \u26A0\uFE0F  ").concat(message)], args, false));
    };
    SSELogger.prototype.error = function (message, error) {
        console.error("[SSE:".concat(this.context, "] \u274C ").concat(message), error);
    };
    SSELogger.prototype.debug = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (process.env.NODE_ENV === 'development') {
            console.debug.apply(console, __spreadArray(["[SSE:".concat(this.context, "] \uD83D\uDD0D ").concat(message)], args, false));
        }
    };
    return SSELogger;
}());
exports.SSELogger = SSELogger;
// ═══════════════════════════════════════════════════════════════
// HELPERS DE VALIDACIÓN
// ═══════════════════════════════════════════════════════════════
/**
 * Verifica si una string es un UUID válido
 */
function isValidUUID(str) {
    var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}
/**
 * Verifica si un objeto está vacío
 */
function isEmpty(obj) {
    if (obj === null || obj === undefined)
        return true;
    if (typeof obj === 'object')
        return Object.keys(obj).length === 0;
    if (Array.isArray(obj))
        return obj.length === 0;
    return false;
}
/**
 * Verifica si un evento SSE tiene estructura válida
 */
function isValidSSEEvent(event) {
    return (event &&
        typeof event === 'object' &&
        typeof event.event === 'string' &&
        event.data !== undefined);
}
// ═══════════════════════════════════════════════════════════════
// HELPERS DE DEBUGGING
// ═══════════════════════════════════════════════════════════════
/**
 * Crea un snapshot del estado SSE para debugging
 */
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
/**
 * Pretty print de un objeto
 */
function prettyPrint(obj, indent) {
    if (indent === void 0) { indent = 2; }
    return JSON.stringify(obj, null, indent);
}
// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════
/**
 * Constantes útiles para SSE
 */
exports.SSE_CONSTANTS = {
    // Timeouts
    DEFAULT_HEARTBEAT_INTERVAL: 30000, // 30 segundos
    DEFAULT_CONNECTION_TIMEOUT: 300000, // 5 minutos
    DEFAULT_RECONNECT_INTERVAL: 3000, // 3 segundos
    // Límites
    MAX_PAYLOAD_SIZE: 65536, // 64KB
    MAX_EVENT_NAME_LENGTH: 100,
    MAX_CONNECTIONS_PER_IP: 3,
    MAX_GLOBAL_CONNECTIONS: 10000,
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: 60000, // 1 minuto
    RATE_LIMIT_MAX_ATTEMPTS: 5,
    // Eventos del sistema
    SYSTEM_EVENTS: {
        CONNECTED: 'connected',
        DISCONNECTED: 'disconnected',
        HEARTBEAT: 'heartbeat',
        ERROR: 'error',
        RECONNECT: 'reconnect',
    },
    // HTTP Headers
    HEADERS: {
        CONTENT_TYPE: 'text/event-stream',
        CACHE_CONTROL: 'no-cache, no-transform',
        CONNECTION: 'keep-alive',
        X_ACCEL_BUFFERING: 'no',
    },
};
