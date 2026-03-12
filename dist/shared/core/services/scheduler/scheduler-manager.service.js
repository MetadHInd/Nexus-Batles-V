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
var SchedulerManagerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerManagerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
let SchedulerManagerService = SchedulerManagerService_1 = class SchedulerManagerService {
    schedulerRegistry;
    logger = new common_1.Logger(SchedulerManagerService_1.name);
    tasks = new Map();
    callbacks = new Map();
    notifications = new Map();
    notificationTimeouts = new Map();
    constructor(schedulerRegistry) {
        this.schedulerRegistry = schedulerRegistry;
    }
    async onModuleInit() {
        this.logger.log('✅ SchedulerManager initialized');
    }
    registerTask(task) {
        if (this.tasks.has(task.name)) {
            this.logger.warn(`⚠️ Task ${task.name} already exists, updating...`);
            this.unregisterTask(task.name);
        }
        this.callbacks.set(task.name, task.callback);
        const status = {
            name: task.name,
            cronExpression: task.cronExpression,
            isRunning: false,
            executionCount: 0,
            maxExecutions: task.maxExecutions,
            errors: 0,
            enabled: task.enabled !== false,
        };
        this.tasks.set(task.name, status);
        const job = new cron_1.CronJob(task.cronExpression, async () => {
            await this.executeTask(task.name);
        });
        this.schedulerRegistry.addCronJob(task.name, job);
        if (status.enabled) {
            job.start();
            this.logger.log(`✅ Task registered and started: ${task.name} (${task.cronExpression})`);
        }
        else {
            this.logger.log(`📋 Task registered (disabled): ${task.name} (${task.cronExpression})`);
        }
        if (task.executeImmediately && status.enabled) {
            this.logger.log(`🚀 Executing task immediately: ${task.name}`);
            setImmediate(() => this.executeTask(task.name));
        }
    }
    async executeTask(name) {
        const status = this.tasks.get(name);
        const callback = this.callbacks.get(name);
        if (!status || !callback) {
            this.logger.error(`❌ Task ${name} not found`);
            return;
        }
        if (!status.enabled) {
            this.logger.debug(`⏭️ Task ${name} is disabled, skipping`);
            return;
        }
        if (status.maxExecutions && status.executionCount >= status.maxExecutions) {
            this.logger.log(`🏁 Task ${name} reached max executions (${status.maxExecutions}), stopping`);
            this.disableTask(name);
            return;
        }
        status.isRunning = true;
        status.lastExecution = new Date();
        try {
            this.logger.log(`🏃 Executing task: ${name} (execution #${status.executionCount + 1})`);
            await callback();
            status.executionCount++;
            this.logger.log(`✅ Task ${name} completed successfully (total: ${status.executionCount})`);
        }
        catch (error) {
            status.errors++;
            status.lastError = error.message;
            this.logger.error(`❌ Task ${name} failed: ${error.message}`, error.stack);
        }
        finally {
            status.isRunning = false;
        }
    }
    async triggerTask(name) {
        const callback = this.callbacks.get(name);
        if (!callback) {
            throw new Error(`Task ${name} not found`);
        }
        this.logger.log(`🔧 Manual trigger: ${name}`);
        await callback();
    }
    enableTask(name) {
        const status = this.tasks.get(name);
        if (!status) {
            throw new Error(`Task ${name} not found`);
        }
        status.enabled = true;
        const job = this.schedulerRegistry.getCronJob(name);
        job.start();
        this.logger.log(`▶️ Task enabled: ${name}`);
    }
    disableTask(name) {
        const status = this.tasks.get(name);
        if (!status) {
            throw new Error(`Task ${name} not found`);
        }
        status.enabled = false;
        const job = this.schedulerRegistry.getCronJob(name);
        job.stop();
        this.logger.log(`⏸️ Task disabled: ${name}`);
    }
    unregisterTask(name) {
        if (!this.tasks.has(name)) {
            throw new Error(`Task ${name} not found`);
        }
        this.schedulerRegistry.deleteCronJob(name);
        this.tasks.delete(name);
        this.callbacks.delete(name);
        this.logger.log(`🗑️ Task unregistered: ${name}`);
    }
    getTaskStatus(name) {
        const status = this.tasks.get(name);
        if (!status)
            return undefined;
        try {
            const job = this.schedulerRegistry.getCronJob(name);
            return {
                ...status,
                nextExecution: job.nextDate()?.toJSDate(),
            };
        }
        catch {
            return status;
        }
    }
    getAllTasksStatus() {
        const allStatus = [];
        for (const [name] of this.tasks) {
            const status = this.getTaskStatus(name);
            if (status) {
                allStatus.push(status);
            }
        }
        return allStatus;
    }
    resetTaskCount(name) {
        const status = this.tasks.get(name);
        if (!status) {
            throw new Error(`Task ${name} not found`);
        }
        status.executionCount = 0;
        status.errors = 0;
        status.lastError = undefined;
        this.logger.log(`🔄 Task count reset: ${name}`);
    }
    updateMaxExecutions(name, maxExecutions) {
        const status = this.tasks.get(name);
        if (!status) {
            throw new Error(`Task ${name} not found`);
        }
        status.maxExecutions = maxExecutions;
        this.logger.log(`🔧 Task ${name} max executions updated: ${maxExecutions || 'infinite'}`);
    }
    scheduleNotification(notification) {
        const now = new Date();
        const scheduledTime = new Date(notification.scheduledTime);
        const delay = scheduledTime.getTime() - now.getTime();
        if (delay < 0) {
            this.logger.warn(`⚠️ Notification ${notification.id} scheduled in the past, executing immediately`);
            setImmediate(() => this.executeNotification(notification.id));
            return;
        }
        this.notifications.set(notification.id, notification);
        const timeout = setTimeout(async () => {
            await this.executeNotification(notification.id);
        }, delay);
        this.notificationTimeouts.set(notification.id, timeout);
        this.logger.log(`📬 Notification scheduled: ${notification.id} (${notification.type}) ` +
            `at ${scheduledTime.toISOString()} (${notification.timezone})`);
    }
    async executeNotification(id) {
        const notification = this.notifications.get(id);
        if (!notification) {
            this.logger.warn(`⚠️ Notification ${id} not found`);
            return;
        }
        try {
            this.logger.log(`📤 Executing notification: ${id} (${notification.type})`);
            await notification.callback();
            this.logger.log(`✅ Notification ${id} executed successfully`);
        }
        catch (error) {
            this.logger.error(`❌ Notification ${id} failed: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            this.notifications.delete(id);
            this.notificationTimeouts.delete(id);
        }
    }
    cancelNotification(id) {
        const timeout = this.notificationTimeouts.get(id);
        if (timeout) {
            clearTimeout(timeout);
            this.notificationTimeouts.delete(id);
            this.notifications.delete(id);
            this.logger.log(`🗑️ Notification cancelled: ${id}`);
        }
    }
    getNotificationQueueStatus() {
        const byType = {};
        const upcoming = [];
        for (const [, notification] of this.notifications) {
            byType[notification.type] = (byType[notification.type] || 0) + 1;
            upcoming.push(notification);
        }
        upcoming.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
        return {
            totalScheduled: this.notifications.size,
            byType,
            upcoming: upcoming.slice(0, 50),
        };
    }
    getNotificationsByType(type) {
        const notifications = [];
        for (const [, notification] of this.notifications) {
            if (notification.type === type) {
                notifications.push(notification);
            }
        }
        return notifications.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
    }
    clearAllNotifications() {
        for (const [id] of this.notifications) {
            this.cancelNotification(id);
        }
        this.logger.log(`🧹 All notifications cleared`);
    }
    clearNotificationsByType(type) {
        const toCancel = [];
        for (const [id, notification] of this.notifications) {
            if (notification.type === type) {
                toCancel.push(id);
            }
        }
        toCancel.forEach(id => this.cancelNotification(id));
        this.logger.log(`🧹 Cleared ${toCancel.length} notifications of type: ${type}`);
    }
};
exports.SchedulerManagerService = SchedulerManagerService;
exports.SchedulerManagerService = SchedulerManagerService = SchedulerManagerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [schedule_1.SchedulerRegistry])
], SchedulerManagerService);
//# sourceMappingURL=scheduler-manager.service.js.map