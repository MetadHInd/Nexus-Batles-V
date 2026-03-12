/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private client: PrismaClient | null = null;

  async onModuleInit() {
    try {
      this.logger.log('🔄 Inicializando PrismaService...');

      this.client = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL || process.env.DATABASE_URL_DEV,
          },
        },
        log: ['error', 'warn'],
      });

      Object.assign(this, this.client);

      // Conectar
      const start = Date.now();
      await this.client.$connect();
      const connectTime = Date.now() - start;
      
      this.logger.log(`✅ Conectado en ${connectTime}ms`);
      
    } catch (error) {
      this.logger.error('❌ Error inicializando:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        this.logger.log('🔌 Desconectando...');
        await this.client.$disconnect();
        this.logger.log('✅ Desconectado exitosamente');
      } catch (error) {
        this.logger.error('❌ Error desconectando:', error);
      }
    }
  }

  /**
   * Health check de la base de datos
   */
  async healthCheck() {
    const start = Date.now();
    try {
      if (!this.client) {
        throw new Error('Prisma client not initialized');
      }
      await this.client.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        latency: Date.now() - start,
        database: 'PostgreSQL',
        multiTenancy: 'disabled',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: Date.now() - start,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Test de performance de queries
   */
  async performanceTest() {
    if (!this.client) {
      throw new Error('Prisma client not initialized');
    }
    const start1 = Date.now();
    await this.client.$queryRaw`SELECT 1`;
    const simpleQueryTime = Date.now() - start1;

    const start2 = Date.now();
    await this.client.sysUser.count();
    const countQueryTime = Date.now() - start2;

    return {
      simpleQuery: `${simpleQueryTime}ms`,
      countQuery: `${countQueryTime}ms`,
      status: 'OK',
      multiTenancy: 'disabled'
    };
  }
}
