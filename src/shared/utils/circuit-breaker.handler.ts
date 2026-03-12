import { Injectable } from '@nestjs/common';
import * as CircuitBreaker from 'opossum';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CircuitBreakerHandler {
  private readonly options = {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
  };

  createBreaker<T extends (...args: any[]) => Promise<any>>(
    func: T,
  ): CircuitBreaker {
    const breaker = new CircuitBreaker(func, this.options);

    breaker.fallback(async () => {
      await this.logToFile('⚠️ Circuit open. Using fallback.');
    });

    breaker.on('failure', async (error) => {
      await this.logToFile(`❌ Action failed: ${error}`);
    });

    breaker.on('open', async () => {
      await this.logToFile('🔌 Circuit has been opened.');
    });

    breaker.on('close', async () => {
      await this.logToFile('✅ Circuit has been closed.');
    });

    breaker.on('halfOpen', async () => {
      await this.logToFile('🟡 Circuit is half open.');
    });

    return breaker;
  }

  private async logToFile(message: string) {
    const logDir = path.resolve('Logs');
    const logFile = path.join(
      logDir,
      `log-${new Date().toISOString().split('T')[0]}.txt`,
    );

    try {
      await fs.promises.mkdir(logDir, { recursive: true });
      await fs.promises.appendFile(
        logFile,
        `${new Date().toISOString()} - ${message}\n`,
      );
    } catch (error) {
      console.error('🚫 Failed to write circuit breaker log:', error);
    }
  }
}
