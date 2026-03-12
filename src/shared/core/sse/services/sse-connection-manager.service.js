"use strict";
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
exports.SSEConnectionManagerService = void 0;
var common_1 = require("@nestjs/common");
/**
 * Servicio principal de gestión de conexiones SSE
 *
 * Responsabilidades:
 * - Registrar y gestionar conexiones de clientes
 * - Enviar eventos a clientes específicos o grupos
 * - Mantener heartbeat para conexiones activas
 * - Limpiar conexiones inactivas
 * - Proporcionar estadísticas de conexiones
 */
var SSEConnectionManagerService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SSEConnectionManagerService = _classThis = /** @class */ (function () {
        // ═══════════════════════════════════════════════════════════════
        // CONFIGURACIÓN Y LIFECYCLE
        // ═══════════════════════════════════════════════════════════════
        function SSEConnectionManagerService_1() {
            this.logger = new common_1.Logger(SSEConnectionManagerService.name);
            // ═══════════════════════════════════════════════════════════════
            // ESTRUCTURAS DE DATOS
            // ═══════════════════════════════════════════════════════════════
            /** Map principal de conexiones: clientId -> SSEClient */
            this.connections = new Map();
            /** Índice por managerId: managerId -> Set<clientId> */
            this.managerConnections = new Map();
            /** Índice por tenantId: tenantId -> Set<clientId> */
            this.tenantConnections = new Map();
            /** Interval de heartbeat */
            this.heartbeatInterval = null;
            /** Configuración de conexiones */
            this.config = {
                heartbeatInterval: 5000, // 5 segundos
                connectionTimeout: 300000, // 5 minutos
                maxRetries: 5,
                retryInterval: 3000, // 3 segundos
                maxPayloadSize: 65536, // 64KB
                enableCompression: false,
                singleSessionPerManager: true, // Sesión única por manager (como videojuegos)
            };
            /** Contador de eventos enviados (para métricas) */
            this.eventsSentCounter = 0;
            /** Contador de bytes enviados (para métricas) */
            this.bytesSentCounter = 0;
            /** Timestamp de inicio del servicio */
            this.startTime = Date.now();
            this.logger.log('🚀 SSE Connection Manager initialized');
            this.startHeartbeat();
        }
        /**
         * Actualiza la configuración de conexiones
         */
        SSEConnectionManagerService_1.prototype.updateConfig = function (config) {
            Object.assign(this.config, config);
            this.logger.log('⚙️ SSE configuration updated');
        };
        /**
         * Cleanup al destruir el módulo
         */
        SSEConnectionManagerService_1.prototype.onModuleDestroy = function () {
            this.logger.log('🛑 Shutting down SSE Connection Manager...');
            this.stopHeartbeat();
            this.disconnectAll();
        };
        // ═══════════════════════════════════════════════════════════════
        // GESTIÓN DE CONEXIONES
        // ═══════════════════════════════════════════════════════════════
        /**
         * Registra una nueva conexión SSE
         */
        SSEConnectionManagerService_1.prototype.addConnection = function (client) {
            // 🎮 SINGLE SESSION POLICY: Desconectar sesiones anteriores del mismo manager
            if (this.config.singleSessionPerManager) {
                this.disconnectPreviousSessions(client.managerId, client.id);
            }
            // Validar que no exista ya
            if (this.connections.has(client.id)) {
                this.logger.warn("Client ".concat(client.id, " already connected, replacing..."));
                this.removeConnection(client.id);
            }
            // Agregar a map principal
            this.connections.set(client.id, client);
            // Indexar por managerId
            if (!this.managerConnections.has(client.managerId)) {
                this.managerConnections.set(client.managerId, new Set());
            }
            this.managerConnections.get(client.managerId).add(client.id);
            // Indexar por tenantId
            if (!this.tenantConnections.has(client.tenantId)) {
                this.tenantConnections.set(client.tenantId, new Set());
            }
            this.tenantConnections.get(client.tenantId).add(client.id);
            this.logger.log("\u2705 SSE Connected: ".concat(client.id, " | Manager: ").concat(client.managerId, " | Tenant: ").concat(client.tenantId));
            this.logger.debug("Total connections: ".concat(this.connections.size));
        };
        /**
         * Remueve una conexión SSE
         */
        SSEConnectionManagerService_1.prototype.removeConnection = function (clientId, reason) {
            var _a, _b, _c, _d;
            var client = this.connections.get(clientId);
            if (!client) {
                this.logger.debug("Client ".concat(clientId, " not found for removal"));
                return;
            }
            // Remover de índice de manager
            (_a = this.managerConnections.get(client.managerId)) === null || _a === void 0 ? void 0 : _a.delete(clientId);
            if (((_b = this.managerConnections.get(client.managerId)) === null || _b === void 0 ? void 0 : _b.size) === 0) {
                this.managerConnections.delete(client.managerId);
            }
            // Remover de índice de tenant
            (_c = this.tenantConnections.get(client.tenantId)) === null || _c === void 0 ? void 0 : _c.delete(clientId);
            if (((_d = this.tenantConnections.get(client.tenantId)) === null || _d === void 0 ? void 0 : _d.size) === 0) {
                this.tenantConnections.delete(client.tenantId);
            }
            // Remover de map principal
            this.connections.delete(clientId);
            // Cerrar stream si aún está abierto
            try {
                if (client.response && !client.response.writableEnded) {
                    client.response.end();
                }
            }
            catch (error) {
                this.logger.warn("Error closing response for ".concat(clientId, ":"), error);
            }
            var logMessage = reason
                ? "\u274C SSE Disconnected: ".concat(clientId, " (Reason: ").concat(reason, ")")
                : "\u274C SSE Disconnected: ".concat(clientId);
            this.logger.log(logMessage);
            this.logger.debug("Total connections: ".concat(this.connections.size));
        };
        /**
         * Desconecta todos los clientes
         */
        SSEConnectionManagerService_1.prototype.disconnectAll = function () {
            var _this = this;
            var clientIds = Array.from(this.connections.keys());
            clientIds.forEach(function (clientId) { return _this.removeConnection(clientId); });
            this.logger.log("Disconnected ".concat(clientIds.length, " client(s)"));
        };
        /**
         * 🎮 SINGLE SESSION POLICY
         * Desconecta sesiones anteriores de un manager (excepto la nueva)
         * Comportamiento tipo videojuego/streaming: solo una sesión activa por cuenta
         */
        SSEConnectionManagerService_1.prototype.disconnectPreviousSessions = function (managerId, newClientId) {
            var _this = this;
            var existingClients = this.managerConnections.get(managerId);
            if (!existingClients || existingClients.size === 0) {
                return; // No hay sesiones previas
            }
            // Obtener clientes existentes (excepto el nuevo que se está conectando)
            var clientsToDisconnect = Array.from(existingClients).filter(function (clientId) { return clientId !== newClientId; });
            if (clientsToDisconnect.length === 0) {
                return;
            }
            this.logger.warn("\uD83C\uDFAE Single Session Policy: Manager ".concat(managerId, " connecting from new device. Disconnecting ").concat(clientsToDisconnect.length, " previous session(s)..."));
            // Notificar a cada cliente anterior que será desconectado
            clientsToDisconnect.forEach(function (clientId) {
                var client = _this.connections.get(clientId);
                if (!client)
                    return;
                try {
                    // Enviar evento de desconexión antes de cerrar
                    var disconnectMessage = _this.formatSSEMessage('session_terminated', {
                        reason: 'new_session_detected',
                        message: 'Tu sesión fue cerrada porque iniciaste sesión desde otro dispositivo',
                        timestamp: new Date().toISOString(),
                        reconnect: false, // No intentar reconectar automáticamente
                    });
                    // Intentar enviar el mensaje (si el stream aún está abierto)
                    if (client.response.writable) {
                        client.response.write(disconnectMessage);
                    }
                    // Esperar un momento para que el mensaje llegue
                    setTimeout(function () {
                        _this.removeConnection(clientId, 'New session from another device');
                    }, 100);
                }
                catch (error) {
                    _this.logger.error("Error notifying client ".concat(clientId, " of disconnection:"), error);
                    // Desconectar de todos modos
                    _this.removeConnection(clientId, 'New session from another device');
                }
            });
            this.logger.log("\u2705 Previous sessions disconnected. New session established for manager ".concat(managerId));
        };
        /**
         * Obtiene un cliente por ID
         */
        SSEConnectionManagerService_1.prototype.getClient = function (clientId) {
            return this.connections.get(clientId);
        };
        /**
         * Verifica si un cliente está conectado
         */
        SSEConnectionManagerService_1.prototype.isConnected = function (clientId) {
            return this.connections.has(clientId);
        };
        // ═══════════════════════════════════════════════════════════════
        // CONSULTAS Y BÚSQUEDAS
        // ═══════════════════════════════════════════════════════════════
        /**
         * Obtiene todos los clientes de un manager
         */
        SSEConnectionManagerService_1.prototype.getManagerConnections = function (managerId) {
            var _this = this;
            var clientIds = this.managerConnections.get(managerId);
            if (!clientIds)
                return [];
            return Array.from(clientIds)
                .map(function (id) { return _this.connections.get(id); })
                .filter(function (client) { return client !== undefined; });
        };
        /**
         * Obtiene todos los clientes de un tenant
         */
        SSEConnectionManagerService_1.prototype.getTenantConnections = function (tenantId) {
            var _this = this;
            var clientIds = this.tenantConnections.get(tenantId);
            if (!clientIds)
                return [];
            return Array.from(clientIds)
                .map(function (id) { return _this.connections.get(id); })
                .filter(function (client) { return client !== undefined; });
        };
        /**
         * Obtiene todos los clientes conectados
         */
        SSEConnectionManagerService_1.prototype.getAllConnections = function () {
            return Array.from(this.connections.values());
        };
        // ═══════════════════════════════════════════════════════════════
        // ENVÍO DE EVENTOS
        // ═══════════════════════════════════════════════════════════════
        /**
         * Envía un evento a un cliente específico
         */
        SSEConnectionManagerService_1.prototype.sendToClient = function (clientId, event, data, options) {
            var _a;
            var client = this.connections.get(clientId);
            if (!client) {
                this.logger.debug("Client ".concat(clientId, " not found"));
                return false;
            }
            // Aplicar filtro si existe
            if ((options === null || options === void 0 ? void 0 : options.filter) && !options.filter(client)) {
                this.logger.debug("Client ".concat(clientId, " filtered out"));
                return false;
            }
            // Validar payload
            if ((options === null || options === void 0 ? void 0 : options.validate) && !options.validate(data)) {
                this.logger.warn("Invalid payload for client ".concat(clientId));
                return false;
            }
            // Transformar payload si es necesario
            var transformedData = (options === null || options === void 0 ? void 0 : options.transform) ? options.transform(data) : data;
            try {
                // IMPORTANTE: Si el cliente tiene metadata.managedByObservable,
                // NO escribir directamente al response (conflicto con @Sse())
                if ((_a = client.metadata) === null || _a === void 0 ? void 0 : _a.managedByObservable) {
                    this.logger.debug("Skipping direct write for ".concat(clientId, " (managed by Observable)"));
                    return true; // Retornar true para no causar errores
                }
                // Verificar si el stream puede escribir
                if (!client.response.writable) {
                    this.logger.warn("Client ".concat(clientId, " stream not writable"));
                    this.removeConnection(clientId);
                    return false;
                }
                // Formatear mensaje SSE
                var formatted = this.formatSSEMessage(event, transformedData);
                // Validar tamaño de payload
                if (formatted.length > this.config.maxPayloadSize) {
                    this.logger.error("Payload too large for ".concat(clientId, ": ").concat(formatted.length, " bytes"));
                    return false;
                }
                // Escribir al stream
                var written = client.response.write(formatted);
                if (!written) {
                    this.logger.warn("Backpressure on client ".concat(clientId));
                }
                // Actualizar métricas
                this.eventsSentCounter++;
                this.bytesSentCounter += formatted.length;
                return true;
            }
            catch (error) {
                this.logger.error("Failed to send to ".concat(clientId, ":"), error);
                this.removeConnection(clientId);
                return false;
            }
        };
        /**
         * Envía un evento a todos los clientes de un manager
         */
        SSEConnectionManagerService_1.prototype.sendToManager = function (managerId, event, data, options) {
            var clients = this.getManagerConnections(managerId);
            if (clients.length === 0) {
                this.logger.debug("No clients connected for manager ".concat(managerId));
                return {
                    successCount: 0,
                    failureCount: 0,
                    failedClientIds: [],
                    timestamp: new Date(),
                };
            }
            return this.sendToMultiple(clients, event, data, options);
        };
        /**
         * Envía un evento a todos los clientes de un tenant
         */
        SSEConnectionManagerService_1.prototype.sendToTenant = function (tenantId, event, data, options) {
            var clients = this.getTenantConnections(tenantId);
            if (clients.length === 0) {
                this.logger.debug("No clients connected for tenant ".concat(tenantId));
                return {
                    successCount: 0,
                    failureCount: 0,
                    failedClientIds: [],
                    timestamp: new Date(),
                };
            }
            return this.sendToMultiple(clients, event, data, options);
        };
        /**
         * Broadcast: envía un evento a todos los clientes
         */
        SSEConnectionManagerService_1.prototype.broadcast = function (event, data, options) {
            var clients = this.getAllConnections();
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
        };
        /**
         * Envía un evento a múltiples clientes
         */
        SSEConnectionManagerService_1.prototype.sendToMultiple = function (clients, event, data, options) {
            var _this = this;
            var successCount = 0;
            var failedClientIds = [];
            clients.forEach(function (client) {
                if (_this.sendToClient(client.id, event, data, options)) {
                    successCount++;
                }
                else {
                    failedClientIds.push(client.id);
                }
            });
            var result = {
                successCount: successCount,
                failureCount: failedClientIds.length,
                failedClientIds: failedClientIds,
                timestamp: new Date(),
            };
            if (failedClientIds.length > 0) {
                this.logger.warn("Failed to send to ".concat(failedClientIds.length, "/").concat(clients.length, " clients"));
            }
            return result;
        };
        // ═══════════════════════════════════════════════════════════════
        // FORMATEO DE MENSAJES SSE
        // ═══════════════════════════════════════════════════════════════
        /**
         * Formatea un mensaje al estándar SSE
         */
        SSEConnectionManagerService_1.prototype.formatSSEMessage = function (event, data) {
            var id = Date.now().toString();
            var timestamp = new Date().toISOString();
            // Agregar timestamp al payload si no existe
            var payload = typeof data === 'object' && data !== null
                ? __assign(__assign({}, data), { timestamp: timestamp }) : { value: data, timestamp: timestamp };
            // Formato estándar SSE
            return [
                "id: ".concat(id),
                "event: ".concat(event),
                "data: ".concat(JSON.stringify(payload)),
                '\n', // Doble newline indica fin de mensaje
            ].join('\n');
        };
        // ═══════════════════════════════════════════════════════════════
        // HEARTBEAT Y MANTENIMIENTO
        // ═══════════════════════════════════════════════════════════════
        /**
         * Inicia el sistema de heartbeat
         */
        SSEConnectionManagerService_1.prototype.startHeartbeat = function () {
            var _this = this;
            if (this.heartbeatInterval) {
                this.logger.warn('Heartbeat already started');
                return;
            }
            this.heartbeatInterval = setInterval(function () {
                _this.performHeartbeat();
            }, this.config.heartbeatInterval);
            this.logger.log("\uD83D\uDC93 Heartbeat started (interval: ".concat(this.config.heartbeatInterval, "ms)"));
        };
        /**
         * Detiene el sistema de heartbeat
         */
        SSEConnectionManagerService_1.prototype.stopHeartbeat = function () {
            if (this.heartbeatInterval) {
                clearInterval(this.heartbeatInterval);
                this.heartbeatInterval = null;
                this.logger.log('💓 Heartbeat stopped');
            }
        };
        /**
         * Ejecuta un ciclo de heartbeat
         */
        SSEConnectionManagerService_1.prototype.performHeartbeat = function () {
            var _this = this;
            var now = Date.now();
            var timedOutCount = 0;
            var heartbeatsSent = 0;
            this.connections.forEach(function (client, clientId) {
                var timeSinceLastBeat = now - client.lastHeartbeat.getTime();
                // Verificar timeout
                if (timeSinceLastBeat > _this.config.connectionTimeout) {
                    _this.logger.warn("Client ".concat(clientId, " timed out (").concat(timeSinceLastBeat, "ms since last heartbeat)"));
                    _this.removeConnection(clientId);
                    timedOutCount++;
                    return;
                }
                // Enviar heartbeat
                var sent = _this.sendToClient(clientId, 'heartbeat', {
                    serverTime: now,
                });
                if (sent) {
                    client.lastHeartbeat = new Date();
                    heartbeatsSent++;
                }
            });
            // Log solo si hay actividad
            if (this.connections.size > 0) {
                this.logger.debug("\uD83D\uDC93 Heartbeat: ".concat(heartbeatsSent, " sent, ").concat(timedOutCount, " timed out"));
            }
        };
        // ═══════════════════════════════════════════════════════════════
        // ESTADÍSTICAS Y MÉTRICAS
        // ═══════════════════════════════════════════════════════════════
        /**
         * Obtiene estadísticas de conexiones
         */
        SSEConnectionManagerService_1.prototype.getStats = function () {
            var connectionsByManager = Array.from(this.managerConnections.entries()).map(function (_a) {
                var managerId = _a[0], clients = _a[1];
                return ({
                    managerId: managerId,
                    connections: clients.size,
                });
            });
            var connectionsByTenant = Array.from(this.tenantConnections.entries()).map(function (_a) {
                var tenantId = _a[0], clients = _a[1];
                return ({
                    tenantId: tenantId,
                    connections: clients.size,
                });
            });
            return {
                totalConnections: this.connections.size,
                totalManagers: this.managerConnections.size,
                connectionsByManager: connectionsByManager,
                connectionsByTenant: connectionsByTenant,
                timestamp: new Date(),
            };
        };
        /**
         * Obtiene métricas detalladas
         */
        SSEConnectionManagerService_1.prototype.getMetrics = function () {
            var stats = this.getStats();
            var uptime = Date.now() - this.startTime;
            return __assign(__assign({}, stats), { uptime: {
                    milliseconds: uptime,
                    seconds: Math.floor(uptime / 1000),
                    formatted: this.formatUptime(uptime),
                }, throughput: {
                    eventsSent: this.eventsSentCounter,
                    bytesSent: this.bytesSentCounter,
                    eventsPerSecond: this.eventsSentCounter / (uptime / 1000) || 0,
                    bytesPerSecond: this.bytesSentCounter / (uptime / 1000) || 0,
                }, config: this.config });
        };
        /**
         * Formatea uptime a string legible
         */
        SSEConnectionManagerService_1.prototype.formatUptime = function (ms) {
            var seconds = Math.floor(ms / 1000);
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            var days = Math.floor(hours / 24);
            if (days > 0)
                return "".concat(days, "d ").concat(hours % 24, "h ").concat(minutes % 60, "m");
            if (hours > 0)
                return "".concat(hours, "h ").concat(minutes % 60, "m ").concat(seconds % 60, "s");
            if (minutes > 0)
                return "".concat(minutes, "m ").concat(seconds % 60, "s");
            return "".concat(seconds, "s");
        };
        /**
         * Resetea contadores de métricas
         */
        SSEConnectionManagerService_1.prototype.resetMetrics = function () {
            this.eventsSentCounter = 0;
            this.bytesSentCounter = 0;
            this.logger.log('📊 Metrics reset');
        };
        // ═══════════════════════════════════════════════════════════════
        // GESTIÓN DE SESIÓN ÚNICA
        // ═══════════════════════════════════════════════════════════════
        /**
         * Habilita/Deshabilita el modo de sesión única
         */
        SSEConnectionManagerService_1.prototype.setSingleSessionMode = function (enabled) {
            this.config.singleSessionPerManager = enabled;
            this.logger.log("\uD83C\uDFAE Single Session Mode: ".concat(enabled ? 'ENABLED' : 'DISABLED'));
        };
        /**
         * Obtiene el estado del modo sesión única
         */
        SSEConnectionManagerService_1.prototype.isSingleSessionMode = function () {
            return this.config.singleSessionPerManager;
        };
        /**
         * Desconecta manualmente todas las sesiones de un manager
         * Útil para forzar cierre de sesión (ej: cambio de contraseña, ban, etc.)
         */
        SSEConnectionManagerService_1.prototype.disconnectManager = function (managerId, reason) {
            var _this = this;
            if (reason === void 0) { reason = 'Forced disconnection'; }
            var clients = this.getManagerConnections(managerId);
            if (clients.length === 0) {
                this.logger.debug("No active sessions for manager ".concat(managerId));
                return 0;
            }
            this.logger.warn("\uD83D\uDD34 Force disconnect: ".concat(clients.length, " session(s) for manager ").concat(managerId, ". Reason: ").concat(reason));
            // Notificar a cada cliente
            clients.forEach(function (client) {
                try {
                    // Enviar evento de desconexión forzada
                    var disconnectMessage = _this.formatSSEMessage('session_terminated', {
                        reason: 'forced_disconnection',
                        message: reason,
                        timestamp: new Date().toISOString(),
                        reconnect: false,
                    });
                    if (client.response.writable) {
                        client.response.write(disconnectMessage);
                    }
                    setTimeout(function () {
                        _this.removeConnection(client.id, reason);
                    }, 100);
                }
                catch (error) {
                    _this.logger.error("Error disconnecting client ".concat(client.id, ":"), error);
                    _this.removeConnection(client.id, reason);
                }
            });
            return clients.length;
        };
        /**
         * Obtiene información de sesiones activas de un manager
         */
        SSEConnectionManagerService_1.prototype.getManagerSessionsInfo = function (managerId) {
            var clients = this.getManagerConnections(managerId);
            return clients.map(function (client) { return ({
                clientId: client.id,
                connectedAt: client.connectedAt,
                lastHeartbeat: client.lastHeartbeat,
                metadata: client.metadata,
            }); });
        };
        return SSEConnectionManagerService_1;
    }());
    __setFunctionName(_classThis, "SSEConnectionManagerService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SSEConnectionManagerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SSEConnectionManagerService = _classThis;
}();
exports.SSEConnectionManagerService = SSEConnectionManagerService;
