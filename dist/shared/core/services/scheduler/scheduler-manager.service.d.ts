import { OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
export interface ScheduledTask {
    name: string;
    cronExpression: string;
    callback: () => Promise<void> | void;
    maxExecutions?: number;
    executeImmediately?: boolean;
    enabled?: boolean;
}
export interface TaskStatus {
    name: string;
    cronExpression: string;
    isRunning: boolean;
    executionCount: number;
    maxExecutions?: number;
    lastExecution?: Date;
    nextExecution?: Date;
    errors: number;
    lastError?: string;
    enabled: boolean;
}
export interface ScheduledNotification {
    id: string;
    type: string;
    scheduledTime: Date;
    timezone: string;
    callback: () => Promise<void>;
    metadata?: any;
}
export interface NotificationQueueStatus {
    totalScheduled: number;
    byType: Record<string, number>;
    upcoming: ScheduledNotification[];
}
export declare class SchedulerManagerService implements OnModuleInit {
    private schedulerRegistry;
    private readonly logger;
    private tasks;
    private callbacks;
    private notifications;
    private notificationTimeouts;
    constructor(schedulerRegistry: SchedulerRegistry);
    onModuleInit(): Promise<void>;
    registerTask(task: ScheduledTask): void;
    private executeTask;
    triggerTask(name: string): Promise<void>;
    enableTask(name: string): void;
    disableTask(name: string): void;
    unregisterTask(name: string): void;
    getTaskStatus(name: string): TaskStatus | undefined;
    getAllTasksStatus(): TaskStatus[];
    resetTaskCount(name: string): void;
    updateMaxExecutions(name: string, maxExecutions?: number): void;
    scheduleNotification(notification: ScheduledNotification): void;
    private executeNotification;
    cancelNotification(id: string): void;
    getNotificationQueueStatus(): NotificationQueueStatus;
    getNotificationsByType(type: string): ScheduledNotification[];
    clearAllNotifications(): void;
    clearNotificationsByType(type: string): void;
}
