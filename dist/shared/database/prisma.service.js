"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    logger = new common_1.Logger(PrismaService_1.name);
    client = null;
    async onModuleInit() {
        try {
            this.logger.log('🔄 Inicializando PrismaService...');
            this.client = new client_1.PrismaClient({
                datasources: {
                    db: {
                        url: process.env.DATABASE_URL || process.env.DATABASE_URL_DEV,
                    },
                },
                log: ['error', 'warn'],
            });
            Object.assign(this, this.client);
            const start = Date.now();
            await this.client.$connect();
            const connectTime = Date.now() - start;
            this.logger.log(`✅ Conectado en ${connectTime}ms`);
        }
        catch (error) {
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
            }
            catch (error) {
                this.logger.error('❌ Error desconectando:', error);
            }
        }
    }
    async healthCheck() {
        const start = Date.now();
        try {
            if (!this.client) {
                throw new Error('Prisma client not initialized');
            }
            await this.client.$queryRaw `SELECT 1`;
            return {
                status: 'healthy',
                latency: Date.now() - start,
                database: 'PostgreSQL',
                multiTenancy: 'disabled',
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                latency: Date.now() - start,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    async performanceTest() {
        if (!this.client) {
            throw new Error('Prisma client not initialized');
        }
        const start1 = Date.now();
        await this.client.$queryRaw `SELECT 1`;
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
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map