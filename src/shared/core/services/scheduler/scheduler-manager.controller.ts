import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SchedulerManagerService } from './scheduler-manager.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Scheduler Manager')
@Controller('api/scheduler')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SchedulerManagerController {
  constructor(private readonly schedulerManager: SchedulerManagerService) {}

  /**
   * Get all registered tasks and their status
   */
  @Get('tasks')
  @ApiOperation({ summary: 'Get all registered scheduled tasks' })
  @ApiResponse({ status: 200, description: 'List of all tasks with status' })
  getAllTasks() {
    return {
      tasks: this.schedulerManager.getAllTasksStatus(),
      total: this.schedulerManager.getAllTasksStatus().length,
    };
  }

  /**
   * Get specific task status
   */
  @Get('tasks/:name')
  @ApiOperation({ summary: 'Get status of a specific task' })
  @ApiResponse({ status: 200, description: 'Task status' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  getTaskStatus(@Param('name') name: string) {
    const status = this.schedulerManager.getTaskStatus(name);
    if (!status) {
      return { error: 'Task not found', name };
    }
    return status;
  }

  /**
   * Manually trigger a task
   */
  @Post('tasks/:name/trigger')
  @ApiOperation({ summary: 'Manually trigger a task execution' })
  @ApiResponse({ status: 200, description: 'Task triggered successfully' })
  async triggerTask(@Param('name') name: string) {
    await this.schedulerManager.triggerTask(name);
    return {
      message: `Task ${name} triggered successfully`,
      triggeredAt: new Date(),
    };
  }

  /**
   * Enable a task
   */
  @Post('tasks/:name/enable')
  @ApiOperation({ summary: 'Enable a task' })
  @ApiResponse({ status: 200, description: 'Task enabled' })
  enableTask(@Param('name') name: string) {
    this.schedulerManager.enableTask(name);
    return {
      message: `Task ${name} enabled`,
      status: this.schedulerManager.getTaskStatus(name),
    };
  }

  /**
   * Disable a task
   */
  @Post('tasks/:name/disable')
  @ApiOperation({ summary: 'Disable a task' })
  @ApiResponse({ status: 200, description: 'Task disabled' })
  disableTask(@Param('name') name: string) {
    this.schedulerManager.disableTask(name);
    return {
      message: `Task ${name} disabled`,
      status: this.schedulerManager.getTaskStatus(name),
    };
  }

  /**
   * Reset task execution count
   */
  @Post('tasks/:name/reset')
  @ApiOperation({ summary: 'Reset task execution count' })
  @ApiResponse({ status: 200, description: 'Task count reset' })
  resetTask(@Param('name') name: string) {
    this.schedulerManager.resetTaskCount(name);
    return {
      message: `Task ${name} count reset`,
      status: this.schedulerManager.getTaskStatus(name),
    };
  }

  /**
   * Update max executions
   */
  @Post('tasks/:name/max-executions')
  @ApiOperation({ summary: 'Update max executions for a task' })
  @ApiResponse({ status: 200, description: 'Max executions updated' })
  updateMaxExecutions(
    @Param('name') name: string,
    @Body() body: { maxExecutions?: number },
  ) {
    this.schedulerManager.updateMaxExecutions(name, body.maxExecutions);
    return {
      message: `Task ${name} max executions updated`,
      maxExecutions: body.maxExecutions || 'infinite',
      status: this.schedulerManager.getTaskStatus(name),
    };
  }
}
