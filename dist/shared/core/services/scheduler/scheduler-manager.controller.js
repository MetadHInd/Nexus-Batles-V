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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerManagerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const scheduler_manager_service_1 = require("./scheduler-manager.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let SchedulerManagerController = class SchedulerManagerController {
    schedulerManager;
    constructor(schedulerManager) {
        this.schedulerManager = schedulerManager;
    }
    getAllTasks() {
        return {
            tasks: this.schedulerManager.getAllTasksStatus(),
            total: this.schedulerManager.getAllTasksStatus().length,
        };
    }
    getTaskStatus(name) {
        const status = this.schedulerManager.getTaskStatus(name);
        if (!status) {
            return { error: 'Task not found', name };
        }
        return status;
    }
    async triggerTask(name) {
        await this.schedulerManager.triggerTask(name);
        return {
            message: `Task ${name} triggered successfully`,
            triggeredAt: new Date(),
        };
    }
    enableTask(name) {
        this.schedulerManager.enableTask(name);
        return {
            message: `Task ${name} enabled`,
            status: this.schedulerManager.getTaskStatus(name),
        };
    }
    disableTask(name) {
        this.schedulerManager.disableTask(name);
        return {
            message: `Task ${name} disabled`,
            status: this.schedulerManager.getTaskStatus(name),
        };
    }
    resetTask(name) {
        this.schedulerManager.resetTaskCount(name);
        return {
            message: `Task ${name} count reset`,
            status: this.schedulerManager.getTaskStatus(name),
        };
    }
    updateMaxExecutions(name, body) {
        this.schedulerManager.updateMaxExecutions(name, body.maxExecutions);
        return {
            message: `Task ${name} max executions updated`,
            maxExecutions: body.maxExecutions || 'infinite',
            status: this.schedulerManager.getTaskStatus(name),
        };
    }
};
exports.SchedulerManagerController = SchedulerManagerController;
__decorate([
    (0, common_1.Get)('tasks'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all registered scheduled tasks' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all tasks with status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SchedulerManagerController.prototype, "getAllTasks", null);
__decorate([
    (0, common_1.Get)('tasks/:name'),
    (0, swagger_1.ApiOperation)({ summary: 'Get status of a specific task' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task status' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchedulerManagerController.prototype, "getTaskStatus", null);
__decorate([
    (0, common_1.Post)('tasks/:name/trigger'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually trigger a task execution' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task triggered successfully' }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchedulerManagerController.prototype, "triggerTask", null);
__decorate([
    (0, common_1.Post)('tasks/:name/enable'),
    (0, swagger_1.ApiOperation)({ summary: 'Enable a task' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task enabled' }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchedulerManagerController.prototype, "enableTask", null);
__decorate([
    (0, common_1.Post)('tasks/:name/disable'),
    (0, swagger_1.ApiOperation)({ summary: 'Disable a task' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task disabled' }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchedulerManagerController.prototype, "disableTask", null);
__decorate([
    (0, common_1.Post)('tasks/:name/reset'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset task execution count' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task count reset' }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchedulerManagerController.prototype, "resetTask", null);
__decorate([
    (0, common_1.Post)('tasks/:name/max-executions'),
    (0, swagger_1.ApiOperation)({ summary: 'Update max executions for a task' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Max executions updated' }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SchedulerManagerController.prototype, "updateMaxExecutions", null);
exports.SchedulerManagerController = SchedulerManagerController = __decorate([
    (0, swagger_1.ApiTags)('Scheduler Manager'),
    (0, common_1.Controller)('api/scheduler'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [scheduler_manager_service_1.SchedulerManagerService])
], SchedulerManagerController);
//# sourceMappingURL=scheduler-manager.controller.js.map