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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSSEController = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const uuid_1 = require("uuid");
const sse_connection_manager_service_1 = require("../services/sse-connection-manager.service");
let BaseSSEController = class BaseSSEController {
    connectionManager;
    logger;
    constructor(connectionManager) {
        this.connectionManager = connectionManager;
        this.logger = new common_1.Logger(this.constructor.name);
    }
    createSSEStream(req, managerId, tenantId, metadata, clientIp, rateLimitGuard) {
        this.logger.log(`🚀 ENTERED createSSEStream method`);
        const clientId = (0, uuid_1.v4)();
        const response = req.res;
        this.logger.log(`🆔 Generated clientId: ${clientId}`);
        req.setTimeout(0);
        response.setTimeout(0);
        if (req.socket) {
            req.socket.setTimeout(0);
            req.socket.setKeepAlive(true, 30000);
        }
        this.logger.debug(`⚙️ Timeouts disabled for ${clientId}`);
        const client = {
            id: clientId,
            managerId,
            tenantId,
            response,
            connectedAt: new Date(),
            lastHeartbeat: new Date(),
            lastEventId: req.headers['last-event-id'],
            metadata: {
                userAgent: req.headers['user-agent'],
                ip: req.ip || req.socket.remoteAddress,
                managedByObservable: true,
                ...metadata,
            },
        };
        this.logger.log(`📝 Registering client ${clientId}...`);
        this.connectionManager.addConnection(client);
        this.logger.log(`✅ Client ${clientId} registered successfully`);
        this.logger.log(`🔄 Creating observable for client ${clientId}...`);
        const cleanup = () => {
            this.logger.log(`🧹 Cleaning up client ${clientId}...`);
            this.connectionManager.removeConnection(clientId);
        };
        this.logger.debug(`🎯 Creating SSE stream for ${clientId}`);
        const stream = (0, rxjs_1.interval)(5000).pipe((0, operators_1.startWith)(-1), (0, operators_1.map)((tick) => {
            this.logger.debug(`⏰ Tick ${tick} for ${clientId}`);
            const eventType = tick === -1 ? 'connected' : 'heartbeat';
            const payload = {
                tick,
                timestamp: new Date().toISOString(),
                clientId,
                message: tick === -1 ? 'Connected successfully' : 'Heartbeat'
            };
            return {
                type: eventType,
                data: payload
            };
        }));
        req.on('close', () => {
            this.logger.log(`🔌 Connection closed for ${clientId}`);
            if (clientIp && rateLimitGuard) {
                rateLimitGuard.decrementConnection(clientIp);
            }
            cleanup();
        });
        req.on('error', (error) => {
            this.logger.error(`❌ Connection error for ${clientId}:`, error);
            cleanup();
        });
        this.logger.debug(`✅ Stream created for ${clientId}`);
        return stream;
    }
    sendError(clientId, error, code, details) {
        this.connectionManager.sendToClient(clientId, 'error', {
            error,
            code,
            details,
        });
    }
    isClientConnected(clientId) {
        return this.connectionManager.isConnected(clientId);
    }
    getClientInfo(clientId) {
        return this.connectionManager.getClient(clientId);
    }
};
exports.BaseSSEController = BaseSSEController;
exports.BaseSSEController = BaseSSEController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [sse_connection_manager_service_1.SSEConnectionManagerService])
], BaseSSEController);
//# sourceMappingURL=base-sse.controller.js.map