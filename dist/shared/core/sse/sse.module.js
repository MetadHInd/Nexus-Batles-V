"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const sse_connection_manager_service_1 = require("./services/sse-connection-manager.service");
const sse_event_bridge_service_1 = require("./services/sse-event-bridge.service");
const sse_metrics_service_1 = require("./services/sse-metrics.service");
const sse_auth_guard_1 = require("./guards/sse-auth.guard");
const sse_rate_limit_guard_1 = require("./guards/sse-rate-limit.guard");
const sse_metrics_controller_1 = require("./controllers/sse-metrics.controller");
const test_sse_controller_1 = require("./controllers/test-sse.controller");
const auth_sse_controller_1 = require("./controllers/auth-sse.controller");
const event_bus_service_1 = require("../services/service-cache/event-bus.service");
let SSEModule = class SSEModule {
};
exports.SSEModule = SSEModule;
exports.SSEModule = SSEModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-secret-key',
                signOptions: { expiresIn: '15m' },
            }),
        ],
        providers: [
            sse_connection_manager_service_1.SSEConnectionManagerService,
            sse_event_bridge_service_1.SSEEventBridgeService,
            sse_metrics_service_1.SSEMetricsService,
            sse_auth_guard_1.SSEAuthGuard,
            sse_rate_limit_guard_1.SSERateLimitGuard,
            {
                provide: event_bus_service_1.EventBusService,
                useFactory: () => event_bus_service_1.EventBusService.getInstance(),
            },
        ],
        controllers: [
            sse_metrics_controller_1.SSEMetricsController,
            test_sse_controller_1.TestSSEController,
            auth_sse_controller_1.AuthSSEController,
        ],
        exports: [
            sse_connection_manager_service_1.SSEConnectionManagerService,
            sse_event_bridge_service_1.SSEEventBridgeService,
            sse_metrics_service_1.SSEMetricsService,
            sse_auth_guard_1.SSEAuthGuard,
            sse_rate_limit_guard_1.SSERateLimitGuard,
        ],
    })
], SSEModule);
//# sourceMappingURL=sse.module.js.map