import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

export interface ScheduledTask {
  name: string;
  cronExpression: string;
  callback: () => Promise<void> | void;
  maxExecutions?: number; // undefined = infinite
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

/**
 * 🚀 Generic Scheduler Manager
 * 
 * Allows dynamic registration of scheduled tasks with:
 * - Custom cron expressions
 * - Limited or infinite executions
 * - Enable/disable on the fly
 * - Execution tracking and status
 * - Error handling
 * 
 * @example
 * // Register a task that runs every hour, 10 times max
 * schedulerManager.registerTask({
 *   name: 'hourly-cleanup',
 *   cronExpression: '0 * * * *', // Every hour at minute 0
 *   callback: async () => { await cleanupOldData(); },
 *   maxExecutions: 10,
 *   enabled: true
 * });
 * 
 * // Register infinite task
 * schedulerManager.registerTask({
 *   name: 'check-orders',
 *   cronExpression: '0 * * * *',
 *   callback: async () => { await checkOrders(); }
 * });
 */
@Injectable()
export class SchedulerManagerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerManagerService.name);
  private tasks: Map<string, TaskStatus> = new Map();
  private callbacks: Map<string, () => Promise<void> | void> = new Map();
  private notifications: Map<string, ScheduledNotification> = new Map();
  private notificationTimeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  async onModuleInit() {
    this.logger.log('✅ SchedulerManager initialized');
  }

  /**
   * Register a new scheduled task
   */
  registerTask(task: ScheduledTask): void {
    if (this.tasks.has(task.name)) {
      this.logger.warn(`⚠️ Task ${task.name} already exists, updating...`);
      this.unregisterTask(task.name);
    }

    // Store callback
    this.callbacks.set(task.name, task.callback);

    // Create task status
    const status: TaskStatus = {
      name: task.name,
      cronExpression: task.cronExpression,
      isRunning: false,
      executionCount: 0,
      maxExecutions: task.maxExecutions,
      errors: 0,
      enabled: task.enabled !== false,
    };

    this.tasks.set(task.name, status);

    // Create cron job
    const job = new CronJob(task.cronExpression, async () => {
      await this.executeTask(task.name);
    });

    // Register with NestJS scheduler registry
    this.schedulerRegistry.addCronJob(task.name, job);

    // Start if enabled
    if (status.enabled) {
      job.start();
      this.logger.log(`✅ Task registered and started: ${task.name} (${task.cronExpression})`);
    } else {
      this.logger.log(`📋 Task registered (disabled): ${task.name} (${task.cronExpression})`);
    }

    // Execute immediately if requested
    if (task.executeImmediately && status.enabled) {
      this.logger.log(`🚀 Executing task immediately: ${task.name}`);
      setImmediate(() => this.executeTask(task.name));
    }
  }

  /**
   * Execute a task (internal)
   */
  private async executeTask(name: string): Promise<void> {
    const status = this.tasks.get(name);
    const callback = this.callbacks.get(name);

    if (!status || !callback) {
      this.logger.error(`❌ Task ${name} not found`);
      return;
    }

    // Check if enabled
    if (!status.enabled) {
      this.logger.debug(`⏭️ Task ${name} is disabled, skipping`);
      return;
    }

    // Check max executions
    if (status.maxExecutions && status.executionCount >= status.maxExecutions) {
      this.logger.log(`🏁 Task ${name} reached max executions (${status.maxExecutions}), stopping`);
      this.disableTask(name);
      return;
    }

    // Mark as running
    status.isRunning = true;
    status.lastExecution = new Date();

    try {
      this.logger.log(`🏃 Executing task: ${name} (execution #${status.executionCount + 1})`);
      
      await callback();
      
      status.executionCount++;
      
      this.logger.log(`✅ Task ${name} completed successfully (total: ${status.executionCount})`);
      
    } catch (error) {
      status.errors++;
      status.lastError = error.message;
      this.logger.error(`❌ Task ${name} failed: ${error.message}`, error.stack);
      
    } finally {
      status.isRunning = false;
    }
  }

  /**
   * Manually trigger a task execution (ignores max executions check)
   */
  async triggerTask(name: string): Promise<void> {
    const callback = this.callbacks.get(name);
    if (!callback) {
      throw new Error(`Task ${name} not found`);
    }

    this.logger.log(`🔧 Manual trigger: ${name}`);
    await callback();
  }

  /**
   * Enable a task
   */
  enableTask(name: string): void {
    const status = this.tasks.get(name);
    if (!status) {
      throw new Error(`Task ${name} not found`);
    }

    status.enabled = true;
    const job = this.schedulerRegistry.getCronJob(name);
    job.start();
    
    this.logger.log(`▶️ Task enabled: ${name}`);
  }

  /**
   * Disable a task
   */
  disableTask(name: string): void {
    const status = this.tasks.get(name);
    if (!status) {
      throw new Error(`Task ${name} not found`);
    }

    status.enabled = false;
    const job = this.schedulerRegistry.getCronJob(name);
    job.stop();
    
    this.logger.log(`⏸️ Task disabled: ${name}`);
  }

  /**
   * Unregister a task completely
   */
  unregisterTask(name: string): void {
    if (!this.tasks.has(name)) {
      throw new Error(`Task ${name} not found`);
    }

    this.schedulerRegistry.deleteCronJob(name);
    this.tasks.delete(name);
    this.callbacks.delete(name);
    
    this.logger.log(`🗑️ Task unregistered: ${name}`);
  }

  /**
   * Get status of a specific task
   */
  getTaskStatus(name: string): TaskStatus | undefined {
    const status = this.tasks.get(name);
    if (!status) return undefined;

    try {
      const job = this.schedulerRegistry.getCronJob(name);
      return {
        ...status,
        nextExecution: job.nextDate()?.toJSDate(),
      };
    } catch {
      return status;
    }
  }

  /**
   * Get status of all tasks
   */
  getAllTasksStatus(): TaskStatus[] {
    const allStatus: TaskStatus[] = [];
    
    for (const [name] of this.tasks) {
      const status = this.getTaskStatus(name);
      if (status) {
        allStatus.push(status);
      }
    }
    
    return allStatus;
  }

  /**
   * Reset execution count for a task
   */
  resetTaskCount(name: string): void {
    const status = this.tasks.get(name);
    if (!status) {
      throw new Error(`Task ${name} not found`);
    }

    status.executionCount = 0;
    status.errors = 0;
    status.lastError = undefined;
    
    this.logger.log(`🔄 Task count reset: ${name}`);
  }

  /**
   * Update max executions for a task
   */
  updateMaxExecutions(name: string, maxExecutions?: number): void {
    const status = this.tasks.get(name);
    if (!status) {
      throw new Error(`Task ${name} not found`);
    }

    status.maxExecutions = maxExecutions;
    
    this.logger.log(`🔧 Task ${name} max executions updated: ${maxExecutions || 'infinite'}`);
  }

  // ========================================
  // 📬 NOTIFICATION QUEUE METHODS
  // ========================================

  /**
   * Schedule a notification to be executed at a specific time
   */
  scheduleNotification(notification: ScheduledNotification): void {
    const now = new Date();
    const scheduledTime = new Date(notification.scheduledTime);
    const delay = scheduledTime.getTime() - now.getTime();

    if (delay < 0) {
      this.logger.warn(`⚠️ Notification ${notification.id} scheduled in the past, executing immediately`);
      setImmediate(() => this.executeNotification(notification.id));
      return;
    }

    // Store notification
    this.notifications.set(notification.id, notification);

    // Schedule timeout
    const timeout = setTimeout(async () => {
      await this.executeNotification(notification.id);
    }, delay);

    this.notificationTimeouts.set(notification.id, timeout);

    this.logger.log(
      `📬 Notification scheduled: ${notification.id} (${notification.type}) ` +
      `at ${scheduledTime.toISOString()} (${notification.timezone})`
    );
  }

  /**
   * Execute a scheduled notification
   */
  private async executeNotification(id: string): Promise<void> {
    const notification = this.notifications.get(id);
    
    if (!notification) {
      this.logger.warn(`⚠️ Notification ${id} not found`);
      return;
    }

    try {
      this.logger.log(`📤 Executing notification: ${id} (${notification.type})`);
      
      await notification.callback();
      
      this.logger.log(`✅ Notification ${id} executed successfully`);
      
    } catch (error) {
      this.logger.error(`❌ Notification ${id} failed: ${error.message}`, error.stack);
      throw error;
      
    } finally {
      // Cleanup
      this.notifications.delete(id);
      this.notificationTimeouts.delete(id);
    }
  }

  /**
   * Cancel a scheduled notification
   */
  cancelNotification(id: string): void {
    const timeout = this.notificationTimeouts.get(id);
    
    if (timeout) {
      clearTimeout(timeout);
      this.notificationTimeouts.delete(id);
      this.notifications.delete(id);
      this.logger.log(`🗑️ Notification cancelled: ${id}`);
    }
  }

  /**
   * Get notification queue status
   */
  getNotificationQueueStatus(): NotificationQueueStatus {
    const byType: Record<string, number> = {};
    const upcoming: ScheduledNotification[] = [];

    for (const [, notification] of this.notifications) {
      byType[notification.type] = (byType[notification.type] || 0) + 1;
      upcoming.push(notification);
    }

    // Sort by scheduled time
    upcoming.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());

    return {
      totalScheduled: this.notifications.size,
      byType,
      upcoming: upcoming.slice(0, 50), // First 50
    };
  }

  /**
   * Get notifications by type
   */
  getNotificationsByType(type: string): ScheduledNotification[] {
    const notifications: ScheduledNotification[] = [];
    
    for (const [, notification] of this.notifications) {
      if (notification.type === type) {
        notifications.push(notification);
      }
    }

    return notifications.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
  }

  /**
   * Clear all scheduled notifications
   */
  clearAllNotifications(): void {
    for (const [id] of this.notifications) {
      this.cancelNotification(id);
    }
    
    this.logger.log(`🧹 All notifications cleared`);
  }

  /**
   * Clear notifications by type
   */
  clearNotificationsByType(type: string): void {
    const toCancel: string[] = [];
    
    for (const [id, notification] of this.notifications) {
      if (notification.type === type) {
        toCancel.push(id);
      }
    }

    toCancel.forEach(id => this.cancelNotification(id));
    
    this.logger.log(`🧹 Cleared ${toCancel.length} notifications of type: ${type}`);
  }
}
