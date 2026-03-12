"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSERateLimitGuard = void 0;
var common_1 = require("@nestjs/common");
/**
 * Guard de Rate Limiting para endpoints SSE
 *
 * Previene ataques de Connection Flooding donde un atacante
 * intenta abrir miles de conexiones SSE para agotar recursos.
 *
 * Estrategia:
 * - Limitar conexiones por IP
 * - Limitar intentos de conexión en ventana de tiempo
 * - Limitar conexiones globales
 *
 * Configuración recomendada:
 * - Max 5 conexiones por IP por minuto
 * - Max 3 conexiones simultáneas por IP
 * - Max 10,000 conexiones globales
 */
var SSERateLimitGuard = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SSERateLimitGuard = _classThis = /** @class */ (function () {
        function SSERateLimitGuard_1() {
            this.logger = new common_1.Logger(SSERateLimitGuard.name);
            /** Map de intentos de conexión por IP: IP -> timestamps[] */
            this.connectionAttempts = new Map();
            /** Map de conexiones activas por IP: IP -> count */
            this.activeConnections = new Map();
            /** Configuración de rate limiting */
            this.config = {
                /** Máximo de intentos de conexión en la ventana de tiempo */
                maxAttemptsPerWindow: 5,
                /** Ventana de tiempo en ms (default: 1 minuto) */
                windowMs: 60000,
                /** Máximo de conexiones simultáneas por IP */
                maxConcurrentPerIp: 1, // ✅ Solo 1 conexión activa por IP
                /** Máximo de conexiones globales (todas las IPs) */
                maxGlobalConnections: 10000,
                /** Habilitar whitelist de IPs (localhost, IPs internas, etc.) */
                enableWhitelist: false, // ⚠️ DESHABILITADO para testing - habilitar en producción
                /** IPs whitelisted */
                whitelist: ['127.0.0.1', '::1', '::ffff:127.0.0.1'],
            };
        }
        SSERateLimitGuard_1.prototype.canActivate = function (context) {
            var _this = this;
            var request = context.switchToHttp().getRequest();
            var ip = this.getClientIp(request);
            // Verificar whitelist
            if (this.config.enableWhitelist && this.config.whitelist.includes(ip)) {
                this.logger.debug("IP ".concat(ip, " whitelisted, skipping rate limit"));
                return true;
            }
            // 1. Verificar límite de conexiones globales
            var globalConnections = this.getTotalActiveConnections();
            if (globalConnections >= this.config.maxGlobalConnections) {
                this.logger.error("\uD83D\uDEAB Global connection limit reached: ".concat(globalConnections));
                throw new common_1.HttpException('Server at maximum capacity. Please try again later.', common_1.HttpStatus.SERVICE_UNAVAILABLE);
            }
            // 2. Verificar límite de conexiones concurrentes por IP
            var currentConnections = this.activeConnections.get(ip) || 0;
            if (currentConnections >= this.config.maxConcurrentPerIp) {
                this.logger.warn("\uD83D\uDEAB IP ".concat(ip, " exceeded concurrent connection limit: ").concat(currentConnections));
                throw new common_1.HttpException("Too many concurrent connections from your IP. Maximum: ".concat(this.config.maxConcurrentPerIp), common_1.HttpStatus.TOO_MANY_REQUESTS);
            }
            // 3. Verificar rate limit de intentos de conexión
            var now = Date.now();
            var attempts = this.connectionAttempts.get(ip) || [];
            // Limpiar intentos antiguos fuera de la ventana
            var recentAttempts = attempts.filter(function (timestamp) { return now - timestamp < _this.config.windowMs; });
            if (recentAttempts.length >= this.config.maxAttemptsPerWindow) {
                this.logger.warn("\uD83D\uDEAB IP ".concat(ip, " exceeded connection attempt limit: ").concat(recentAttempts.length, " attempts in ").concat(this.config.windowMs, "ms"));
                throw new common_1.HttpException("Too many connection attempts. Please wait ".concat(Math.ceil(this.config.windowMs / 1000), " seconds."), common_1.HttpStatus.TOO_MANY_REQUESTS);
            }
            // 4. Registrar intento actual
            recentAttempts.push(now);
            this.connectionAttempts.set(ip, recentAttempts);
            // 5. Incrementar contador de conexiones activas
            this.activeConnections.set(ip, currentConnections + 1);
            // IMPORTANTE: NO configurar cleanup aquí con request.on('close')
            // En SSE, el request se mantiene abierto y 'close' se dispara incorrectamente
            // El ConnectionManager se encargará de decrementar cuando la conexión realmente cierre
            this.logger.debug("\u2705 Rate limit passed for IP ".concat(ip, " (").concat(currentConnections + 1, "/").concat(this.config.maxConcurrentPerIp, " connections)"));
            return true;
        };
        /**
         * Extrae la IP real del cliente
         * Considera proxies y load balancers
         */
        SSERateLimitGuard_1.prototype.getClientIp = function (request) {
            // Intentar headers de proxy primero
            var forwarded = request.headers['x-forwarded-for'];
            if (forwarded && typeof forwarded === 'string') {
                return forwarded.split(',')[0].trim();
            }
            var realIp = request.headers['x-real-ip'];
            if (realIp && typeof realIp === 'string') {
                return realIp;
            }
            // Fallback a IP directa
            return request.ip || request.socket.remoteAddress || 'unknown';
        };
        /**
         * Decrementa el contador de conexiones activas para una IP
         * Llamado por el ConnectionManager cuando una conexión SSE realmente se cierra
         */
        SSERateLimitGuard_1.prototype.decrementConnection = function (ip) {
            var current = this.activeConnections.get(ip) || 0;
            if (current > 0) {
                this.activeConnections.set(ip, current - 1);
                this.logger.debug("Connection closed for IP ".concat(ip, " (").concat(current - 1, " remaining)"));
            }
            // Limpiar si no hay más conexiones
            if (current - 1 <= 0) {
                this.activeConnections.delete(ip);
            }
        };
        /**
         * Obtiene el total de conexiones activas
         */
        SSERateLimitGuard_1.prototype.getTotalActiveConnections = function () {
            var total = 0;
            this.activeConnections.forEach(function (count) {
                total += count;
            });
            return total;
        };
        /**
         * Actualiza la configuración de rate limiting
         */
        SSERateLimitGuard_1.prototype.updateConfig = function (config) {
            Object.assign(this.config, config);
            this.logger.log('⚙️ Rate limit configuration updated');
        };
        /**
         * Obtiene estadísticas de rate limiting
         */
        SSERateLimitGuard_1.prototype.getStats = function () {
            return {
                activeConnections: Object.fromEntries(this.activeConnections),
                totalActiveConnections: this.getTotalActiveConnections(),
                ipsWithAttempts: this.connectionAttempts.size,
                config: this.config,
            };
        };
        /**
         * Resetea rate limiting para una IP específica
         * Útil para desbloquear IPs manualmente
         */
        SSERateLimitGuard_1.prototype.resetIp = function (ip) {
            this.connectionAttempts.delete(ip);
            this.activeConnections.delete(ip);
            this.logger.log("\uD83D\uDD13 Rate limit reset for IP ".concat(ip));
        };
        /**
         * Limpia datos antiguos (ejecutar periódicamente)
         */
        SSERateLimitGuard_1.prototype.cleanup = function () {
            var _this = this;
            var now = Date.now();
            var cleaned = 0;
            // Limpiar intentos antiguos
            this.connectionAttempts.forEach(function (attempts, ip) {
                var recent = attempts.filter(function (timestamp) { return now - timestamp < _this.config.windowMs; });
                if (recent.length === 0) {
                    _this.connectionAttempts.delete(ip);
                    cleaned++;
                }
                else if (recent.length < attempts.length) {
                    _this.connectionAttempts.set(ip, recent);
                }
            });
            if (cleaned > 0) {
                this.logger.debug("\uD83E\uDDF9 Cleaned up ".concat(cleaned, " old rate limit entries"));
            }
        };
        return SSERateLimitGuard_1;
    }());
    __setFunctionName(_classThis, "SSERateLimitGuard");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SSERateLimitGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SSERateLimitGuard = _classThis;
}();
exports.SSERateLimitGuard = SSERateLimitGuard;
