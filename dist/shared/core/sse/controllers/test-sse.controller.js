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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TestSSEController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSSEController = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const base_sse_controller_1 = require("./base-sse.controller");
const sse_connection_manager_service_1 = require("../services/sse-connection-manager.service");
const sse_rate_limit_guard_1 = require("../guards/sse-rate-limit.guard");
let TestSSEController = TestSSEController_1 = class TestSSEController extends base_sse_controller_1.BaseSSEController {
    rateLimitGuard;
    logger = new common_1.Logger(TestSSEController_1.name);
    constructor(connectionManager, rateLimitGuard) {
        super(connectionManager);
        this.rateLimitGuard = rateLimitGuard;
    }
    streamMinimal(req) {
        this.logger.log(`🔬 MINIMAL SSE Test - Creating basic interval stream`);
        return (0, rxjs_1.interval)(5000).pipe((0, operators_1.map)((index) => {
            this.logger.debug(`📡 Minimal emit: ${index}`);
            return {
                data: {
                    index,
                    timestamp: new Date().toISOString()
                }
            };
        }));
    }
    streamTestEvents(req) {
        const managerId = req.query.managerId || 'test_user';
        const tenantId = req.query.tenantId || 'test_tenant';
        this.logger.log(`🧪 TEST SSE Connection: manager=${managerId}, tenant=${tenantId}`);
        const ip = this.getClientIp(req);
        this.logger.log(`🔍 Client IP: ${ip}`);
        this.logger.log(`🎬 About to call createSSEStream...`);
        try {
            const stream = this.createSSEStream(req, managerId, tenantId, {
                metadata: {
                    isTest: true,
                    userAgent: req.headers['user-agent'],
                    ip: req.ip,
                },
            }, undefined, undefined);
            this.logger.log(`✅ createSSEStream returned Observable`);
            return stream;
        }
        catch (error) {
            this.logger.error(`💥 ERROR in createSSEStream:`, error);
            throw error;
        }
    }
    getClientIp(req) {
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded && typeof forwarded === 'string') {
            return forwarded.split(',')[0].trim();
        }
        const realIp = req.headers['x-real-ip'];
        if (realIp && typeof realIp === 'string') {
            return realIp;
        }
        return req.ip || req.socket.remoteAddress || 'unknown';
    }
    async sendTestEvent(body) {
        const { managerId, eventType, payload } = body;
        this.logger.log(`📤 Sending test event "${eventType}" to manager ${managerId}`);
        const result = this.connectionManager.sendToManager(managerId, eventType, payload);
        return {
            success: result.successCount > 0,
            sent: result.successCount,
            message: result.successCount > 0
                ? `Event sent to ${result.successCount} connection(s)`
                : `No active connections for manager ${managerId}`,
        };
    }
    async forceDisconnect(body) {
        const { managerId, reason = 'Forced disconnection via test API' } = body;
        this.logger.warn(`🔴 Force disconnecting manager ${managerId}. Reason: ${reason}`);
        const disconnected = this.connectionManager.disconnectManager(managerId, reason);
        return {
            success: true,
            disconnected,
            message: `Disconnected ${disconnected} session(s) for manager ${managerId}`,
        };
    }
    async getManagerSessions(req) {
        const managerId = req.params.managerId;
        const sessions = this.connectionManager.getManagerSessionsInfo(managerId);
        return {
            managerId,
            sessionsCount: sessions.length,
            sessions,
        };
    }
    async toggleSingleSessionMode(body) {
        const { enabled } = body;
        this.connectionManager.setSingleSessionMode(enabled);
        const currentState = this.connectionManager.isSingleSessionMode();
        this.logger.log(`🎮 Single Session Mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
        return {
            success: true,
            singleSessionMode: currentState,
            message: `Single session mode is now ${currentState ? 'ENABLED' : 'DISABLED'}`,
        };
    }
    async getStatus() {
        const metrics = this.connectionManager.getMetrics();
        const singleSessionMode = this.connectionManager.isSingleSessionMode();
        return {
            singleSessionMode,
            metrics,
            timestamp: new Date().toISOString(),
        };
    }
    async broadcast(body) {
        const { eventType, payload } = body;
        this.logger.log(`📡 Broadcasting event "${eventType}" to all clients`);
        const result = this.connectionManager.broadcast(eventType, payload);
        return {
            success: result.successCount > 0,
            sent: result.successCount,
            message: `Event broadcasted to ${result.successCount} connection(s)`,
        };
    }
};
exports.TestSSEController = TestSSEController;
__decorate([
    (0, common_1.Sse)('minimal'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], TestSSEController.prototype, "streamMinimal", null);
__decorate([
    (0, common_1.Sse)('stream'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], TestSSEController.prototype, "streamTestEvents", null);
__decorate([
    (0, common_1.Post)('send-event'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestSSEController.prototype, "sendTestEvent", null);
__decorate([
    (0, common_1.Post)('force-disconnect'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestSSEController.prototype, "forceDisconnect", null);
__decorate([
    (0, common_1.Get)('sessions/:managerId'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestSSEController.prototype, "getManagerSessions", null);
__decorate([
    (0, common_1.Post)('single-session-mode'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestSSEController.prototype, "toggleSingleSessionMode", null);
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestSSEController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)('broadcast'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestSSEController.prototype, "broadcast", null);
exports.TestSSEController = TestSSEController = TestSSEController_1 = __decorate([
    (0, common_1.Controller)('sse/test'),
    __metadata("design:paramtypes", [sse_connection_manager_service_1.SSEConnectionManagerService,
        sse_rate_limit_guard_1.SSERateLimitGuard])
], TestSSEController);
//# sourceMappingURL=test-sse.controller.js.map