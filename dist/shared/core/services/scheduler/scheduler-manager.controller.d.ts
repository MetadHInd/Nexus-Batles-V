import { SchedulerManagerService } from './scheduler-manager.service';
export declare class SchedulerManagerController {
    private readonly schedulerManager;
    constructor(schedulerManager: SchedulerManagerService);
    getAllTasks(): {
        tasks: import("./scheduler-manager.service").TaskStatus[];
        total: number;
    };
    getTaskStatus(name: string): import("./scheduler-manager.service").TaskStatus | {
        error: string;
        name: string;
    };
    triggerTask(name: string): Promise<{
        message: string;
        triggeredAt: Date;
    }>;
    enableTask(name: string): {
        message: string;
        status: import("./scheduler-manager.service").TaskStatus | undefined;
    };
    disableTask(name: string): {
        message: string;
        status: import("./scheduler-manager.service").TaskStatus | undefined;
    };
    resetTask(name: string): {
        message: string;
        status: import("./scheduler-manager.service").TaskStatus | undefined;
    };
    updateMaxExecutions(name: string, body: {
        maxExecutions?: number;
    }): {
        message: string;
        maxExecutions: string | number;
        status: import("./scheduler-manager.service").TaskStatus | undefined;
    };
}
